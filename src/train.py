import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
from sklearn.model_selection import GridSearchCV

from src.preprocessing import load_and_clean_data, encode_features, split_data
from src.data_loader import balance_with_smote

mlflow.set_experiment("nutrition-status-classification")


def evaluate_model(model, X_test, y_test, target_encoder):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, support = precision_recall_fscore_support(
        y_test, y_pred, average=None, zero_division=0
    )

    class_names = target_encoder.classes_
    metrics = {"accuracy": accuracy}

    print(f"\nAkurasi keseluruhan: {accuracy:.4f}")
    print("\nMetric per kelas:")
    for i, class_name in enumerate(class_names):
        print(f"  {class_name:22} | Precision: {precision[i]:.3f} | Recall: {recall[i]:.3f} | F1: {f1[i]:.3f} | Support: {support[i]}")
        metrics[f"precision_{class_name}"] = precision[i]
        metrics[f"recall_{class_name}"] = recall[i]
        metrics[f"f1_{class_name}"] = f1[i]

    macro_f1 = f1.mean()
    metrics["macro_f1"] = macro_f1
    print(f"\nMacro F1-Score: {macro_f1:.4f}")

    return metrics, y_pred


def train_random_forest(X_train, y_train):
    param_grid = {
        "n_estimators": [150, 250],
        "max_depth": [15, 25, None],
    }
    grid = GridSearchCV(
        RandomForestClassifier(random_state=42, class_weight="balanced"),
        param_grid, cv=3, scoring="f1_macro", n_jobs=-1
    )
    grid.fit(X_train, y_train)
    return grid.best_estimator_, grid.best_params_


def train_and_log_indicator(indicator_name: str, target_column: str, df):
    """
    Latih 1 model untuk 1 indikator gizi tertentu (stunting/underweight/wasting),
    log ke MLflow, dan simpan model + encoder ke folder models/.
    """
    print(f"\n{'='*60}\nTRAINING INDIKATOR: {indicator_name.upper()}\n{'='*60}")

    df_encoded, gender_encoder, target_encoder = encode_features(df, target_column)
    X_train, X_test, y_train, y_test = split_data(df_encoded)

    print("Menerapkan SMOTE...")
    X_train_balanced, y_train_balanced = balance_with_smote(X_train, y_train)

    with mlflow.start_run(run_name=f"RandomForest_{indicator_name}"):
        model, best_params = train_random_forest(X_train_balanced, y_train_balanced)
        mlflow.log_params(best_params)
        mlflow.log_param("indicator", indicator_name)

        metrics, y_pred = evaluate_model(model, X_test, y_test, target_encoder)
        mlflow.log_metrics({k: v for k, v in metrics.items() if isinstance(v, (int, float))})
        mlflow.sklearn.log_model(model, "model")

        print(f"\nConfusion Matrix ({indicator_name}):")
        print(confusion_matrix(y_test, y_pred))

    return model, gender_encoder, target_encoder, metrics


if __name__ == "__main__":
    print("Loading dan membersihkan data...")
    df = load_and_clean_data()

    indicators = {
        "stunting": "stunting_status",
        "underweight": "underweight_status",
        "wasting": "wasting_status",
    }

    results = {}
    for indicator_name, target_column in indicators.items():
        model, gender_enc, target_enc, metrics = train_and_log_indicator(indicator_name, target_column, df)
        results[indicator_name] = metrics["macro_f1"]

    print(f"\n{'='*60}\nRINGKASAN SEMUA INDIKATOR (Macro F1-Score)\n{'='*60}")
    for name, f1 in results.items():
        print(f"{name:20}: {f1:.4f}")