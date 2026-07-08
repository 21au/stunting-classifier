const terms = [
  { term: 'Z-Score (SD)', desc: 'Ukuran seberapa jauh nilai seorang anak (tinggi/berat) dari rata-rata anak seusianya. Z-score 0 berarti persis rata-rata. Semakin jauh dari 0 (positif atau negatif), semakin jauh dari rata-rata.' },
  { term: 'HAZ (Height-for-Age Z-score)', desc: 'Z-score tinggi badan dibanding usia. Digunakan untuk menilai stunting.' },
  { term: 'WAZ (Weight-for-Age Z-score)', desc: 'Z-score berat badan dibanding usia. Digunakan untuk menilai underweight.' },
  { term: 'WHZ (Weight-for-Height Z-score)', desc: 'Z-score berat badan dibanding tinggi badan. Digunakan untuk menilai wasting.' },
  { term: 'Stunting', desc: 'Kondisi tinggi badan anak lebih rendah dari standar usianya (HAZ < -2 SD), menandakan kekurangan gizi kronis/jangka panjang.' },
  { term: 'Underweight', desc: 'Kondisi berat badan anak lebih rendah dari standar usianya (WAZ < -2 SD).' },
  { term: 'Wasting', desc: 'Kondisi berat badan tidak proporsional dengan tinggi badan (WHZ < -2 SD), biasanya menandakan kekurangan gizi akut/mendadak.' },
  { term: 'SAM (Severe Acute Malnutrition)', desc: 'Istilah klinis untuk kondisi wasting berat (WHZ < -3 SD). Memerlukan penanganan medis segera.' },
  { term: 'MAM (Moderate Acute Malnutrition)', desc: 'Istilah klinis untuk kondisi wasting sedang (WHZ antara -3 SD dan -2 SD).' },
  { term: 'Cara Membaca Probabilitas', desc: 'Model menampilkan persentase keyakinan untuk setiap kemungkinan status. Semakin tinggi persentase suatu status, semakin yakin model bahwa itulah kondisi anak tersebut.' },
  { term: 'SHAP Value', desc: 'Angka yang menunjukkan seberapa besar suatu faktor (usia, berat, tinggi, gender) mempengaruhi hasil prediksi. Nilai positif mendukung prediksi, nilai negatif melawan prediksi.' },
]

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1">Panduan Istilah</h1>
      <p className="text-muted text-sm mb-8">Penjelasan istilah, singkatan, dan cara membaca hasil prediksi.</p>

      <div className="space-y-4">
        {terms.map((t, i) => (
          <div key={i} className="bg-white border border-sage rounded-xl p-4">
            <h3 className="font-display font-semibold text-teal mb-1">{t.term}</h3>
            <p className="text-sm text-ink">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}