import joblib
from src.preprocessing import load_and_clean_data, encode_features, split_data
from src.data_loader import balance_with_smote
from src.train import train_random_forest


def promote_best_model():
    """
    Latih ulang model terbaik (Random Forest, berdasarkan hasil eksperimen)
    dan simpan sebagai model produksi di folder models/.
    
    Ini mensimulasikan 'model promotion gate' - model yang lolos evaluasi
    disalin ke lokasi tetap yang dipakai API, terpisah dari eksperimen MLflow.
    """
    print("Loading data...")
    df = load_and_clean_data("data/stunting_data.csv")
    df_encoded, gender_encoder, status_encoder = encode_features(df)
    X_train, X_test, y_train, y_test = split_data(df_encoded)

    print("Balancing dengan SMOTE...")
    X_train_balanced, y_train_balanced = balance_with_smote(X_train, y_train)

    print("Training model produksi (Random Forest)...")
    model, best_params = train_random_forest(X_train_balanced, y_train_balanced)
    print(f"Parameter terbaik: {best_params}")

    joblib.dump(model, "models/production_model.pkl")
    joblib.dump(gender_encoder, "models/gender_encoder.pkl")
    joblib.dump(status_encoder, "models/status_encoder.pkl")

    print("\nModel produksi tersimpan di models/production_model.pkl")
    print("Encoder tersimpan di models/gender_encoder.pkl dan models/status_encoder.pkl")


if __name__ == "__main__":
    promote_best_model()