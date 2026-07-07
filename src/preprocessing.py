import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """
    Load dataset dan bersihkan nama kolom biar konsisten (tanpa spasi/karakter aneh).
    """
    df = pd.read_csv(filepath)
    df = df.rename(columns={
        "Umur (bulan)": "age_months",
        "Jenis Kelamin": "gender",
        "Tinggi Badan (cm)": "height_cm",
        "Status Gizi": "status"
    })
    return df


def encode_features(df: pd.DataFrame):
    """
    Encode kolom kategorikal (gender, status) jadi numerik.
    
    Returns:
        df_encoded, gender_encoder, status_encoder
    """
    df = df.copy()
    
    gender_encoder = LabelEncoder()
    df["gender_encoded"] = gender_encoder.fit_transform(df["gender"])
    
    status_encoder = LabelEncoder()
    df["status_encoded"] = status_encoder.fit_transform(df["status"])
    
    return df, gender_encoder, status_encoder


def split_data(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """
    Split data jadi train/test, fitur: age_months, gender_encoded, height_cm.
    Target: status_encoded.
    """
    X = df[["age_months", "gender_encoded", "height_cm"]]
    y = df["status_encoded"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    return X_train, X_test, y_train, y_test


if __name__ == "__main__":
    df = load_and_clean_data("data/stunting_data.csv")
    print("Kolom setelah dibersihkan:", df.columns.tolist())
    
    df_encoded, gender_enc, status_enc = encode_features(df)
    print("\nMapping gender:", dict(zip(gender_enc.classes_, gender_enc.transform(gender_enc.classes_))))
    print("Mapping status:", dict(zip(status_enc.classes_, status_enc.transform(status_enc.classes_))))
    
    X_train, X_test, y_train, y_test = split_data(df_encoded)
    print(f"\nTrain size: {len(X_train)}, Test size: {len(X_test)}")