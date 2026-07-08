import pandas as pd
import hashlib

SALT = "stunting-classifier-2026-portfolio"

def anonymize_id(original_id, salt=SALT):
    """Hash satu arah - ID yang sama menghasilkan hash yang sama (konsisten),
    tapi tidak bisa dilacak balik ke id_anak asli."""
    return "child_" + hashlib.sha256(f"{salt}{original_id}".encode()).hexdigest()[:10]

df = pd.read_excel(r"D:\SKRIPSI\Sistem_posyandu\DATA_FINAL_1_POSYANDU_FIX.xlsx")

# Hash id_anak jadi anon_id (konsisten per anak, tidak bisa dibalik)
df["anon_id"] = df["id_anak"].apply(anonymize_id)

# Hapus TOTAL kolom identitas langsung
df = df.drop(columns=["nama_anak", "nama_posyandu", "id_anak"])

df.to_excel("data/anonymized_growth_data.xlsx", index=False)

print("Selesai.")
print("Kolom akhir:", df.columns.tolist())
print("Jumlah baris:", len(df))
print("Jumlah anak unik:", df["anon_id"].nunique())
print("\nDistribusi jumlah pengukuran per anak:")
print(df["anon_id"].value_counts().describe())