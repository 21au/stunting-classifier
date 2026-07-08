LAYMAN_TEMPLATES = {
    "stunting": {
        "normal": "Tinggi badan anak sesuai dengan usianya. Pertumbuhan tinggi badan dalam kondisi baik.",
        "stunted": "Tinggi badan anak berada di bawah rata-rata anak seusianya. Ini bisa menjadi tanda kekurangan gizi jangka panjang, disarankan konsultasi ke tenaga kesehatan untuk pemantauan lebih lanjut.",
        "severely stunted": "Tinggi badan anak jauh di bawah rata-rata anak seusianya. Kondisi ini perlu mendapat perhatian dan penanganan segera dari tenaga kesehatan.",
        "tinggi": "Tinggi badan anak berada di atas rata-rata anak seusianya.",
    },
    "underweight": {
        "normal": "Berat badan anak sesuai dengan usianya.",
        "underweight": "Berat badan anak berada di bawah rata-rata anak seusianya. Disarankan pemantauan asupan gizi dan konsultasi ke tenaga kesehatan.",
        "severely underweight": "Berat badan anak jauh di bawah rata-rata anak seusianya. Kondisi ini memerlukan penanganan segera dari tenaga kesehatan.",
        "overweight": "Berat badan anak berada di atas rata-rata anak seusianya.",
    },
    "wasting": {
        "normal": "Proporsi berat dan tinggi badan anak seimbang dan sehat.",
        "wasted": "Berat badan anak tergolong kurus dibandingkan tinggi badannya. Ini bisa menandakan kekurangan gizi akut, disarankan konsultasi ke tenaga kesehatan.",
        "severely wasted": "Berat badan anak sangat kurus dibandingkan tinggi badannya. Kondisi ini serius dan memerlukan penanganan medis segera.",
        "obese": "Berat badan anak tergolong berlebih dibandingkan tinggi badannya.",
    },
}

CLINICAL_TEMPLATES = {
    "stunting": {
        "normal": "HAZ dalam rentang normal (-2 SD hingga +2 SD). Tidak ada indikasi chronic malnutrition.",
        "stunted": "HAZ < -2 SD, terklasifikasi sebagai stunted (chronic malnutrition). Rekomendasi: evaluasi riwayat asupan gizi dan pertumbuhan longitudinal.",
        "severely stunted": "HAZ < -3 SD, terklasifikasi sebagai severely stunted (severe chronic malnutrition). Rekomendasi: rujukan untuk evaluasi komprehensif dan tata laksana sesuai pedoman WHO.",
        "tinggi": "HAZ > +3 SD, di atas rentang standar WHO Child Growth Standards.",
    },
    "underweight": {
        "normal": "WAZ dalam rentang normal (-2 SD hingga +2 SD).",
        "underweight": "WAZ < -2 SD, terklasifikasi sebagai underweight. Indikator ini bersifat komposit (dapat mencerminkan wasting dan/atau stunting).",
        "severely underweight": "WAZ < -3 SD, terklasifikasi sebagai severely underweight. Rekomendasi: evaluasi lebih lanjut untuk membedakan komponen akut (wasting) vs kronis (stunting).",
        "overweight": "WAZ > +2 SD, di atas rentang standar.",
    },
    "wasting": {
        "normal": "WHZ dalam rentang normal (-2 SD hingga +2 SD). Tidak ada indikasi acute malnutrition.",
        "wasted": "WHZ antara -3 SD dan -2 SD, terklasifikasi sebagai Moderate Acute Malnutrition (MAM) menurut kriteria WHO.",
        "severely wasted": "WHZ < -3 SD, terklasifikasi sebagai Severe Acute Malnutrition (SAM) menurut kriteria WHO. Rekomendasi: rujukan segera, evaluasi MUAC dan tanda klinis oedema sesuai WHO Guideline on Wasting and Nutritional Oedema (2023).",
        "obese": "WHZ > +3 SD, di atas rentang standar WHO Child Growth Standards untuk usia di bawah 5 tahun.",
    },
}

REFERENCES = {
    "stunting": "WHO Child Growth Standards (Height-for-Age Z-score)",
    "underweight": "WHO Child Growth Standards (Weight-for-Age Z-score)",
    "wasting": "WHO Guideline on the Prevention and Management of Wasting and Nutritional Oedema in Infants and Children Under 5 Years (2023)",
}


def get_layman_explanation(indicator: str, status: str) -> str:
    return LAYMAN_TEMPLATES.get(indicator, {}).get(status, "Status tidak dikenali.")


def get_clinical_explanation(indicator: str, status: str) -> str:
    return CLINICAL_TEMPLATES.get(indicator, {}).get(status, "Status tidak dikenali.")


def get_reference(indicator: str) -> str:
    return REFERENCES.get(indicator, "")