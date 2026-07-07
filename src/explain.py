import joblib
import shap
import pandas as pd
import numpy as np


def load_production_model():
    """Load model produksi dan encoder yang sudah di-promote."""
    model = joblib.load("models/production_model.pkl")
    gender_encoder = joblib.load("models/gender_encoder.pkl")
    status_encoder = joblib.load("models/status_encoder.pkl")
    return model, gender_encoder, status_encoder


def explain_prediction(age_months: int, gender: str, height_cm: float):
    """
    Prediksi status gizi 1 anak, sekaligus jelaskan kontribusi tiap fitur
    terhadap keputusan model (SHAP values).
    """
    model, gender_encoder, status_encoder = load_production_model()

    gender_encoded = gender_encoder.transform([gender])[0]
    input_data = pd.DataFrame({
        "age_months": [age_months],
        "gender_encoded": [gender_encoded],
        "height_cm": [height_cm]
    })

    prediction_encoded = model.predict(input_data)[0]
    prediction_label = status_encoder.inverse_transform([prediction_encoded])[0]
    probabilities = model.predict_proba(input_data)[0]

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_data)

    predicted_class_idx = prediction_encoded
    if isinstance(shap_values, list):
        contributions = shap_values[predicted_class_idx][0]
    else:
        contributions = shap_values[0, :, predicted_class_idx]

    feature_names = ["Usia (bulan)", "Jenis Kelamin", "Tinggi Badan (cm)"]
    explanation = [
        {"feature": name, "contribution": round(float(val), 4)}
        for name, val in zip(feature_names, contributions)
    ]
    explanation.sort(key=lambda x: abs(x["contribution"]), reverse=True)

    return {
        "prediction": prediction_label,
        "probabilities": {
            status_encoder.classes_[i]: round(float(p), 4)
            for i, p in enumerate(probabilities)
        },
        "explanation": explanation
    }


if __name__ == "__main__":
    result = explain_prediction(age_months=24, gender="laki-laki", height_cm=78.5)

    print(f"Prediksi: {result['prediction']}")
    print(f"\nProbabilitas tiap kelas:")
    for label, prob in result["probabilities"].items():
        print(f"  {label:20}: {prob:.2%}")

    print(f"\nPenjelasan (SHAP - fitur paling berpengaruh):")
    for item in result["explanation"]:
        arah = "mendukung" if item["contribution"] > 0 else "melawan"
        print(f"  {item['feature']:20}: {item['contribution']:+.4f} ({arah} prediksi)")