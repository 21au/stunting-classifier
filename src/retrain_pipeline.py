import joblib
import json
import os
from datetime import datetime

from src.preprocessing import load_and_clean_data, encode_features, split_data
from src.data_loader import balance_with_smote
from src.train import train_random_forest, evaluate_model

MODEL_PATH = "models/production_model.pkl"
METADATA_PATH = "models/model_metadata.json"
MIN_IMPROVEMENT_THRESHOLD = -0.01  # model baru boleh sedikit lebih rendah (toleransi noise), tapi tidak boleh jauh lebih buruk


def load_current_model_metrics() -> dict:
    """Load metric model produksi saat ini, kalau ada."""
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r") as f:
            return json.load(f)
    return {"macro_f1": 0.0}


def save_model_metadata(metrics: dict, params: dict):
    """Simpan metadata model produksi: kapan dilatih, metric, parameter."""
    metadata = {
        "trained_at": datetime.now().isoformat(),
        "macro_f1": metrics["macro_f1"],
        "accuracy": metrics["accuracy"],
        "params": params
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)


def retrain_and_validate() -> dict:
    """
    Retrain model, bandingkan dengan model produksi saat ini,
    dan hanya promosikan kalau performa cukup baik (validation gate).
    
    Returns:
        dict berisi keputusan: apakah model baru dipromosikan atau tidak
    """
    print("Loading data...")
    df = load_and_clean_data("data/stunting_data.csv")
    df_encoded, gender_encoder, status_encoder = encode_features(df)
    X_train, X_test, y_train, y_test = split_data(df_encoded)

    print("Balancing dengan SMOTE...")
    X_train_balanced, y_train_balanced = balance_with_smote(X_train, y_train)

    print("Training model kandidat baru...")
    new_model, best_params = train_random_forest(X_train_balanced, y_train_balanced)
    new_metrics, _ = evaluate_model(new_model, X_test, y_test, status_encoder)

    current_metrics = load_current_model_metrics()
    current_f1 = current_metrics.get("macro_f1", 0.0)
    new_f1 = new_metrics["macro_f1"]

    improvement = new_f1 - current_f1
    should_promote = improvement >= MIN_IMPROVEMENT_THRESHOLD

    print(f"\n{'='*50}")
    print(f"VALIDATION GATE")
    print(f"{'='*50}")
    print(f"Model produksi saat ini - Macro F1: {current_f1:.4f}")
    print(f"Model kandidat baru     - Macro F1: {new_f1:.4f}")
    print(f"Selisih                : {improvement:+.4f}")
    print(f"Threshold minimum       : {MIN_IMPROVEMENT_THRESHOLD:+.4f}")
    print(f"Keputusan: {'PROMOSIKAN model baru' if should_promote else 'TOLAK, tetap pakai model lama'}")

    if should_promote:
        joblib.dump(new_model, MODEL_PATH)
        joblib.dump(gender_encoder, "models/gender_encoder.pkl")
        joblib.dump(status_encoder, "models/status_encoder.pkl")
        save_model_metadata(new_metrics, best_params)
        print("\nModel baru berhasil dipromosikan ke produksi.")
    else:
        print("\nModel lama dipertahankan. Model baru tidak memenuhi syarat.")

    return {
        "promoted": should_promote,
        "current_f1": current_f1,
        "new_f1": new_f1,
        "improvement": improvement
    }


if __name__ == "__main__":
    result = retrain_and_validate()