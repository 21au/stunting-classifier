from imblearn.over_sampling import SMOTE
import pandas as pd


def balance_with_smote(X_train: pd.DataFrame, y_train: pd.Series, random_state: int = 42):
    """
    Terapkan SMOTE untuk balancing kelas minoritas di training set.
    PENTING: SMOTE hanya diterapkan ke TRAINING set, tidak pernah ke test set,
    supaya evaluasi tetap mencerminkan distribusi data asli di dunia nyata.
    
    Returns:
        X_train_balanced, y_train_balanced
    """
    smote = SMOTE(random_state=random_state)
    X_balanced, y_balanced = smote.fit_resample(X_train, y_train)
    return X_balanced, y_balanced


if __name__ == "__main__":
    from src.preprocessing import load_and_clean_data, encode_features, split_data
    
    df = load_and_clean_data("data/stunting_data.csv")
    df_encoded, gender_enc, status_enc = encode_features(df)
    X_train, X_test, y_train, y_test = split_data(df_encoded)
    
    print("Distribusi kelas SEBELUM SMOTE:")
    print(y_train.value_counts())
    
    X_balanced, y_balanced = balance_with_smote(X_train, y_train)
    
    print("\nDistribusi kelas SETELAH SMOTE:")
    print(pd.Series(y_balanced).value_counts())