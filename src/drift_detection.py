import pandas as pd
import numpy as np
from scipy.stats import ks_2samp


def calculate_psi(expected: np.ndarray, actual: np.ndarray, bins: int = 10) -> float:
    """
    Hitung Population Stability Index (PSI) - metrik standar industri
    untuk deteksi drift pada 1 fitur numerik.
    
    Interpretasi umum:
    - PSI < 0.1  : tidak ada drift signifikan
    - 0.1 <= PSI < 0.25 : drift sedang, perlu diwaspadai
    - PSI >= 0.25 : drift signifikan, model perlu ditinjau ulang
    """
    breakpoints = np.linspace(0, 100, bins + 1)
    bin_edges = np.percentile(expected, breakpoints)
    bin_edges[0] = -np.inf
    bin_edges[-1] = np.inf

    expected_counts = np.histogram(expected, bins=bin_edges)[0]
    actual_counts = np.histogram(actual, bins=bin_edges)[0]

    expected_pct = expected_counts / len(expected)
    actual_pct = actual_counts / len(actual)

    expected_pct = np.where(expected_pct == 0, 0.0001, expected_pct)
    actual_pct = np.where(actual_pct == 0, 0.0001, actual_pct)

    psi_values = (actual_pct - expected_pct) * np.log(actual_pct / expected_pct)
    return float(np.sum(psi_values))


def ks_test_drift(expected: np.ndarray, actual: np.ndarray, alpha: float = 0.05) -> dict:
    """
    Kolmogorov-Smirnov test - uji statistik formal untuk membandingkan
    apakah 2 distribusi (data training vs data baru) berasal dari
    distribusi yang sama.
    
    Jika p-value < alpha, maka drift dianggap signifikan secara statistik.
    """
    statistic, p_value = ks_2samp(expected, actual)
    is_drift = p_value < alpha
    return {
        "ks_statistic": float(statistic),
        "p_value": float(p_value),
        "is_drift_detected": bool(is_drift),
        "alpha": alpha
    }


def check_feature_drift(reference_data: pd.DataFrame, new_data: pd.DataFrame, feature: str) -> dict:
    """
    Cek drift untuk 1 fitur, menggabungkan PSI dan KS-test.
    
    Args:
        reference_data: data yang dipakai training model (baseline)
        new_data: data baru yang mau dicek
        feature: nama kolom yang mau dicek driftnya
    
    Returns:
        dict hasil analisis drift untuk fitur ini
    """
    expected = reference_data[feature].values
    actual = new_data[feature].values

    psi = calculate_psi(expected, actual)
    ks_result = ks_test_drift(expected, actual)

    return {
        "feature": feature,
        "psi": round(psi, 4),
        "psi_interpretation": (
            "Tidak ada drift" if psi < 0.1
            else "Drift sedang" if psi < 0.25
            else "Drift signifikan"
        ),
        "ks_test": ks_result
    }


def check_dataset_drift(reference_data: pd.DataFrame, new_data: pd.DataFrame, features: list[str]) -> dict:
    """
    Cek drift untuk semua fitur numerik sekaligus, hasilkan ringkasan
    apakah model perlu di-retrain atau tidak.
    """
    results = []
    any_significant_drift = False

    for feature in features:
        result = check_feature_drift(reference_data, new_data, feature)
        results.append(result)
        if result["psi"] >= 0.25 or result["ks_test"]["is_drift_detected"]:
            any_significant_drift = True

    return {
        "features_checked": results,
        "retraining_recommended": any_significant_drift
    }


if __name__ == "__main__":
    from src.preprocessing import load_and_clean_data, encode_features

    df = load_and_clean_data("data/stunting_data.csv")
    df_encoded, _, _ = encode_features(df)

    reference = df_encoded.sample(n=5000, random_state=1)
    simulated_new_data = df_encoded.sample(n=1000, random_state=99).copy()
    simulated_new_data["height_cm"] = simulated_new_data["height_cm"] * 1.15  # simulasi shift 15%

    print("Simulasi: membandingkan data referensi vs data baru (dengan shift buatan)\n")
    result = check_dataset_drift(reference, simulated_new_data, ["age_months", "height_cm"])

    for feat_result in result["features_checked"]:
        print(f"Fitur: {feat_result['feature']}")
        print(f"  PSI: {feat_result['psi']} ({feat_result['psi_interpretation']})")
        print(f"  KS-test p-value: {feat_result['ks_test']['p_value']:.6f} (drift terdeteksi: {feat_result['ks_test']['is_drift_detected']})")
        print()

    print(f"Rekomendasi retraining: {result['retraining_recommended']}")