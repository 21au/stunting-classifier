import mlflow
import mlflow.sklearn
import mlflow.xgboost
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from sklearn.model_selection import GridSearchCV

from src.preprocessing import load_and_clean_data, encode_features, split_data
from src.data_loader import balance_with_smote

mlflow.set_experiment("stunting-classification")


def evaluate_model(model, X_test, y_test, status_encoder):
    """
    Evaluasi model dengan metric yang tepat untuk data imbalanced:
    precision, recall, F1 per kelas (bukan cuma akurasi keseluruhan).
    """
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, support = precision_recall_fscore_support(
        y_test, y_pred, average=None, zero_division=0
    )
    
    class_names = status_encoder.classes_
    metrics = {"accuracy": accuracy}
    
    print(f"\nAkurasi keseluruhan: {accuracy:.4f}")
    print("\nMetric per kelas:")
    for i, class_name in enumerate(class_names):
        print(f"  {class_name:20} | Precision: {precision[i]:.3f} | Recall: {recall[i]:.3f} | F1: {f1[i]:.3f} | Support: {support[i]}")
        metrics[f"precision_{class_name}"] = precision[i]
        metrics[f"recall_{class_name}"] = recall[i]
        metrics[f"f1_{class_name}"] = f1[i]
    
    macro_f1 = f1.mean()
    metrics["macro_f1"] = macro_f1
    print(f"\nMacro F1-Score (rata-rata semua kelas, bobot sama): {macro_f1:.4f}")
    
    return metrics, y_pred


def train_random_forest(X_train, y_train):
    """Training Random Forest dengan hyperparameter tuning sederhana."""
    param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [10, 20, None],
    }
    grid = GridSearchCV(
        RandomForestClassifier(random_state=42, class_weight="balanced"),
        param_grid, cv=3, scoring="f1_macro", n_jobs=-1
    )
    grid.fit(X_train, y_train)
    return grid.best_estimator_, grid.best_params_


def train_xgboost(X_train, y_train):
    """Training XGBoost dengan hyperparameter tuning sederhana."""
    param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [4, 6],
        "learning_rate": [0.1, 0.3],
    }
    grid = GridSearchCV(
        XGBClassifier(random_state=42, eval_metric="mlogloss"),
        param_grid, cv=3, scoring="f1_macro", n_jobs=-1
    )
    grid.fit(X_train, y_train)
    return grid.best_estimator_, grid.best_params_


def train_logistic_regression(X_train, y_train):
    """Training Logistic Regression sebagai baseline sederhana."""
    model = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42)
    model.fit(X_train, y_train)
    return model, {}


def run_experiment(model_name: str, train_fn, X_train, y_train, X_test, y_test, status_encoder):
    """
    Jalankan 1 eksperimen: training, evaluasi, log ke MLflow.
    """
    with mlflow.start_run(run_name=model_name):
        print(f"\n{'='*50}\nTraining: {model_name}\n{'='*50}")
        
        model, best_params = train_fn(X_train, y_train)
        
        if best_params:
            mlflow.log_params(best_params)
        
        metrics, y_pred = evaluate_model(model, X_test, y_test, status_encoder)
        mlflow.log_metrics({k: v for k, v in metrics.items() if isinstance(v, (int, float))})
        mlflow.log_param("model_type", model_name)
        
        if model_name == "XGBoost":
            mlflow.xgboost.log_model(model, "model")
        else:
            mlflow.sklearn.log_model(model, "model")
        
        print(f"\nConfusion Matrix ({model_name}):")
        print(confusion_matrix(y_test, y_pred))
        
        return model, metrics


if __name__ == "__main__":
    print("Loading dan preprocessing data...")
    df = load_and_clean_data("data/stunting_data.csv")
    df_encoded, gender_enc, status_enc = encode_features(df)
    X_train, X_test, y_train, y_test = split_data(df_encoded)
    
    print("Menerapkan SMOTE untuk balancing kelas...")
    X_train_balanced, y_train_balanced = balance_with_smote(X_train, y_train)
    
    results = {}
    
    model_rf, metrics_rf = run_experiment(
        "RandomForest", train_random_forest,
        X_train_balanced, y_train_balanced, X_test, y_test, status_enc
    )
    results["RandomForest"] = metrics_rf
    
    model_xgb, metrics_xgb = run_experiment(
        "XGBoost", train_xgboost,
        X_train_balanced, y_train_balanced, X_test, y_test, status_enc
    )
    results["XGBoost"] = metrics_xgb
    
    model_lr, metrics_lr = run_experiment(
        "LogisticRegression", train_logistic_regression,
        X_train_balanced, y_train_balanced, X_test, y_test, status_enc
    )
    results["LogisticRegression"] = metrics_lr
    
    print(f"\n{'='*50}\nRINGKASAN PERBANDINGAN MODEL (Macro F1-Score)\n{'='*50}")
    for name, m in results.items():
        print(f"{name:20}: {m['macro_f1']:.4f}")
    
    best_model_name = max(results, key=lambda k: results[k]["macro_f1"])
    print(f"\nModel terbaik: {best_model_name}")