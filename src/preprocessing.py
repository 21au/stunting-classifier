import pandas as pd
import datetime
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


def reconstruct_corrupted_weight(val):
    """
    Excel mengubah angka desimal seperti '7.14' menjadi tanggal (14 Juli)
    karena format bulan.hari dianggap tanggal valid jika bulan <= 12.
    Fungsi ini merekonstruksi nilai berat asli dari objek datetime yang salah parse.
    """
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        try:
            return float(val.replace(",", "."))
        except ValueError:
            return None
    if isinstance(val, (pd.Timestamp, datetime.datetime)):
        month = val.month
        day = val.day
        return month + day / 10 if day < 10 else month + day / 100
    return None


def classify_haz(z: float) -> str:
    if z < -3:
        return "severely stunted"
    elif z < -2:
        return "stunted"
    elif z > 3:
        return "tinggi"
    return "normal"


def classify_waz(z: float) -> str:
    if z < -3:
        return "severely underweight"
    elif z < -2:
        return "underweight"
    elif z > 2:
        return "overweight"
    return "normal"


def classify_whz(z: float) -> str:
    if z < -3:
        return "severely wasted"
    elif z < -2:
        return "wasted"
    elif z > 3:
        return "obese"
    return "normal"


def load_and_clean_data(filepath: str = "data/nutrition_data.xlsx") -> pd.DataFrame:
    df = pd.read_excel(filepath)

    df = df.rename(columns={
        "Age (Month)": "age_months",
        "Weight": "weight_kg",
        "Height": "height_cm",
        "Z-Score  W/A": "zscore_waz",
        "Z-Score H/A": "zscore_haz",
        "Z-Score W/H": "zscore_whz",
    })

    df["weight_kg"] = df["weight_kg"].apply(reconstruct_corrupted_weight)

    df["zscore_waz"] = pd.to_numeric(df["zscore_waz"], errors="coerce")
    df["zscore_haz"] = pd.to_numeric(df["zscore_haz"], errors="coerce")
    df["zscore_whz"] = pd.to_numeric(df["zscore_whz"], errors="coerce")

    before = len(df)
    df = df.dropna(subset=["age_months", "weight_kg", "height_cm", "zscore_waz", "zscore_haz", "zscore_whz"])
    after_dropna = len(df)
    print(f"Data dibersihkan (missing values): {before} -> {after_dropna} baris")

    # Validasi fisiologis: batas wajar berat (kg) dan tinggi (cm) untuk balita 0-60 bulan
    # Referensi kasar WHO growth standards: berat lahir min ~1.5kg, maksimum wajar usia 5 tahun ~30kg
    # Tinggi: bayi baru lahir min ~40cm, maksimum wajar usia 5 tahun ~130cm
    valid_mask = (
        df["weight_kg"].between(1.5, 30) &
        df["height_cm"].between(40, 130) &
        df["age_months"].between(0, 60)
    )
    outliers_removed = (~valid_mask).sum()
    df = df[valid_mask]
    print(f"Data dibersihkan (outlier fisiologis tidak wajar): dibuang {outliers_removed} baris")
    print(f"Total data final: {len(df)} baris")

    df["stunting_status"] = df["zscore_haz"].apply(classify_haz)
    df["underweight_status"] = df["zscore_waz"].apply(classify_waz)
    df["wasting_status"] = df["zscore_whz"].apply(classify_whz)

    return df


def encode_features(df: pd.DataFrame, target_column: str):
    df = df.copy()
    gender_encoder = LabelEncoder()
    df["gender_encoded"] = gender_encoder.fit_transform(df["Gender"])

    target_encoder = LabelEncoder()
    df["target_encoded"] = target_encoder.fit_transform(df[target_column])

    return df, gender_encoder, target_encoder


def split_data(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    X = df[["age_months", "gender_encoded", "weight_kg", "height_cm"]]
    y = df["target_encoded"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    df = load_and_clean_data()
    print(f"\nTotal data final: {len(df)}")
    print("\nDistribusi Stunting:\n", df["stunting_status"].value_counts())
    print("\nDistribusi Underweight:\n", df["underweight_status"].value_counts())
    print("\nDistribusi Wasting:\n", df["wasting_status"].value_counts())
    print("\nContoh weight_kg setelah rekonstruksi:\n", df["weight_kg"].describe())