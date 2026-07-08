import joblib
import shap
import pandas as pd
from src.explanation_templates import get_layman_explanation, get_clinical_explanation, get_reference

INDICATORS = ["stunting", "underweight", "wasting"]


def load_indicator_model(indicator_name: str):
    """Load model, gender encoder, dan target encoder untuk 1 indikator tertentu."""
    model = joblib.load(f"models/{indicator_name}_model.pkl")
    gender_encoder = joblib.load(f"models/{indicator_name}_gender_encoder.pkl")
    target_encoder = joblib.load(f"models/{indicator_name}_target_encoder.pkl")
    return model, gender_encoder, target_encoder


def explain_single_indicator(indicator_name: str, age_months: int, gender, weight_kg: float, height_cm: float):
    """
    Prediksi 1 indikator gizi tertentu, sekaligus hasilkan:
    - probabilitas tiap kelas
    - penjelasan SHAP (fitur paling berpengaruh)
    - ringkasan bahasa awam
    - ringkasan bahasa klinis
    - referensi standar yang dipakai
    """
    model, gender_encoder, target_encoder = load_indicator_model(indicator_name)

    gender_encoded = gender_encoder.transform([gender])[0]
    input_data = pd.DataFrame({
        "age_months": [age_months],
        "gender_encoded": [gender_encoded],
        "weight_kg": [weight_kg],
        "height_cm": [height_cm],
    })

    prediction_encoded = model.predict(input_data)[0]
    prediction_label = target_encoder.inverse_transform([prediction_encoded])[0]
    probabilities = model.predict_proba(input_data)[0]

    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_data)

    if isinstance(shap_values, list):
        contributions = shap_values[prediction_encoded][0]
    else:
        contributions = shap_values[0, :, prediction_encoded]

    feature_names = ["Usia (bulan)", "Jenis Kelamin", "Berat Badan (kg)", "Tinggi Badan (cm)"]
    explanation = [
        {"feature": name, "contribution": round(float(val), 4)}
        for name, val in zip(feature_names, contributions)
    ]
    explanation.sort(key=lambda x: abs(x["contribution"]), reverse=True)

    return {
        "prediction": prediction_label,
        "probabilities": {
            target_encoder.classes_[i]: round(float(p), 4)
            for i, p in enumerate(probabilities)
        },
        "explanation": explanation,
        "layman_summary": get_layman_explanation(indicator_name, prediction_label),
        "clinical_summary": get_clinical_explanation(indicator_name, prediction_label),
        "reference": get_reference(indicator_name)
    }


def explain_prediction(age_months: int, gender, weight_kg: float, height_cm: float):
    """
    Prediksi ketiga indikator gizi sekaligus: stunting, underweight, wasting.
    Ini fungsi utama yang dipanggil oleh API.
    """
    results = {}
    for indicator in INDICATORS:
        results[indicator] = explain_single_indicator(indicator, age_months, gender, weight_kg, height_cm)
    return results


if __name__ == "__main__":
    result = explain_prediction(age_months=24, gender=0, weight_kg=9.5, height_cm=78.5)

    for indicator, data in result.items():
        print(f"\n{'='*60}\n{indicator.upper()}\n{'='*60}")
        print(f"Prediksi: {data['prediction']}")

        print("\nProbabilitas:")
        for label, prob in data["probabilities"].items():
            print(f"  {label:20}: {prob:.2%}")

        print("\nPenjelasan (SHAP):")
        for item in data["explanation"]:
            print(f"  {item['feature']:20}: {item['contribution']:+.4f}")

        print(f"\n[Untuk Orang Tua]\n{data['layman_summary']}")
        print(f"\n[Untuk Tenaga Kesehatan]\n{data['clinical_summary']}")
        print(f"Referensi: {data['reference']}")