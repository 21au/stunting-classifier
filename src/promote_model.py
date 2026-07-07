import joblib
from src.preprocessing import load_and_clean_data, encode_features, split_data
from src.data_loader import balance_with_smote
from src.train import train_random_forest


def promote_indicator(indicator_name: str, target_column: str, df):
    print(f"\nPromosikan model: {indicator_name}")

    df_encoded, gender_encoder, target_encoder = encode_features(df, target_column)
    X_train, X_test, y_train, y_test = split_data(df_encoded)

    X_train_balanced, y_train_balanced = balance_with_smote(X_train, y_train)

    model, best_params = train_random_forest(X_train_balanced, y_train_balanced)
    print(f"Parameter terbaik ({indicator_name}): {best_params}")

    joblib.dump(model, f"models/{indicator_name}_model.pkl")
    joblib.dump(gender_encoder, f"models/{indicator_name}_gender_encoder.pkl")
    joblib.dump(target_encoder, f"models/{indicator_name}_target_encoder.pkl")

    print(f"Model {indicator_name} tersimpan.")


def promote_best_model():
    print("Loading data...")
    df = load_and_clean_data()

    indicators = {
        "stunting": "stunting_status",
        "underweight": "underweight_status",
        "wasting": "wasting_status",
    }

    for indicator_name, target_column in indicators.items():
        promote_indicator(indicator_name, target_column, df)

    print("\nSemua model produksi (3 indikator) berhasil disimpan di folder models/.")


if __name__ == "__main__":
    promote_best_model()