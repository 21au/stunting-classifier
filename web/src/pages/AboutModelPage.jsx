const metrics = [
  { name: 'Stunting', f1: '0.881', desc: 'Performa sangat baik. Data cukup seimbang untuk kelas stunted dan severely stunted.' },
  { name: 'Underweight', f1: '0.673', desc: 'Performa moderat. Kelas "overweight" sangat jarang di data (hanya 27 kasus), menurunkan performa rata-rata.' },
  { name: 'Wasting', f1: '0.667', desc: 'Performa moderat. Kelas "obese" dan "severely wasted" tergolong jarang di data training.' },
]

export default function AboutModelPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold mb-1">Tentang Model</h1>
        <p className="text-muted text-sm">Metodologi, performa, dan keterbatasan sistem klasifikasi ini.</p>
      </div>

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-3">Metodologi</h2>
        <p className="text-sm text-ink leading-relaxed mb-3">
          Sistem ini menggunakan algoritma <strong>Random Forest</strong>, dipilih setelah dibandingkan
          dengan XGBoost dan Logistic Regression melalui eksperimen sistematis (dilacak menggunakan MLflow).
          Random Forest dipilih karena memberikan performa terbaik secara konsisten di ketiga indikator gizi.
        </p>
        <p className="text-sm text-ink leading-relaxed mb-3">
          Status gizi dihitung langsung dari Z-score menggunakan ambang batas standar WHO
          (Height-for-Age, Weight-for-Age, Weight-for-Height), bukan mengandalkan label yang sudah
          diproses sebelumnya — memastikan konsistensi dengan standar klinis resmi.
        </p>
        <p className="text-sm text-ink leading-relaxed">
          Karena distribusi kelas pada data asli tidak seimbang (misalnya kasus "normal" jauh lebih banyak
          dari kasus "severely stunted"), teknik <strong>SMOTE</strong> (Synthetic Minority Oversampling)
          diterapkan pada data latih untuk membantu model mengenali pola kelas minoritas dengan lebih baik.
        </p>
      </div>

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-3">Performa Model (Macro F1-Score)</h2>
        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i} className="border-b border-sage last:border-0 pb-3 last:pb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{m.name}</span>
                <span className="font-mono text-teal font-semibold">{m.f1}</span>
              </div>
              <p className="text-xs text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-3">Keterbatasan</h2>
        <ul className="text-sm text-ink space-y-2 list-disc list-inside">
          <li>Model dilatih pada data dari satu wilayah (Jeneponto, Sulawesi Selatan), sehingga generalisasi ke populasi lain perlu divalidasi lebih lanjut.</li>
          <li>Kelas minoritas ekstrem (misal "overweight", "obese") memiliki jumlah data sangat sedikit, sehingga prediksi pada kelas ini kurang dapat diandalkan dibanding kelas mayoritas.</li>
          <li>Sistem ini adalah alat bantu skrining awal, bukan alat diagnosis, dan tidak menggantikan penilaian klinis tenaga kesehatan profesional.</li>
        </ul>
      </div>

      <div className="bg-white border border-sage rounded-2xl p-6">
        <h2 className="font-display font-semibold mb-3">Infrastruktur</h2>
        <p className="text-sm text-ink leading-relaxed">
          Sistem dilengkapi dengan pelacakan eksperimen (MLflow), deteksi pergeseran distribusi data
          (drift detection menggunakan Population Stability Index dan Kolmogorov-Smirnov test),
          serta mekanisme retraining otomatis dengan validasi (model baru hanya dipromosikan
          ke produksi apabila performanya setara atau lebih baik dari model sebelumnya).
        </p>
      </div>
    </div>
  )
}