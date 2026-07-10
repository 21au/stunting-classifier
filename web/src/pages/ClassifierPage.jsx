import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  Calculator, User, Stethoscope, Baby, Ruler, Scale, Info, Activity,
  AlertTriangle, AlertOctagon, Apple, Dumbbell, Sparkles, Loader2, TrendingUp,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Ganti dengan endpoint FastAPI classifier produksi (Random Forest kamu).
// Kalau kosong / fetch gagal -> fallback ke classifyChild() lokal, yang pakai
// formula Z-Score tapi median/SD masih PENDEKATAN KONTINU sederhana (bukan
// tabel WHO LMS 2006 MGRS resmi). Ganti sebelum dipakai untuk keputusan nyata.
// ---------------------------------------------------------------------------
const STATUS_API_URL = import.meta.env?.VITE_STATUS_GIZI_API_URL || '';

// --- Helper Functions ---
function computeZScore(value, median, sd) {
  return Math.round(((value - median) / sd) * 100) / 100;
}

// Cutoff resmi WHO Child Growth Standards / Permenkes RI No. 2 Tahun 2020,
// dipecah per indikator (beda dari versi lama yang cuma 1 skala generik —
// versi lama ini juga tidak mendeteksi arah kelebihan berat badan).
function classifyHAZ(z) {
  if (z < -3) return { code: 'severely_stunted', label: 'Sangat Pendek', severity: 3 };
  if (z < -2) return { code: 'stunted', label: 'Pendek (Stunting)', severity: 2 };
  if (z <= 3) return { code: 'normal', label: 'Normal', severity: 0 };
  return { code: 'tall', label: 'Tinggi', severity: 0 };
}
function classifyWAZ(z) {
  if (z < -3) return { code: 'severely_underweight', label: 'Gizi Buruk', severity: 3 };
  if (z < -2) return { code: 'underweight', label: 'Gizi Kurang', severity: 2 };
  if (z <= 1) return { code: 'normal', label: 'Gizi Baik', severity: 0 };
  return { code: 'overweight_risk', label: 'Risiko Berat Badan Lebih', severity: 1 };
}
function classifyWHZ(z) {
  if (z < -3) return { code: 'severely_wasted', label: 'Gizi Buruk (Wasting Berat)', severity: 3 };
  if (z < -2) return { code: 'wasted', label: 'Gizi Kurang (Wasting)', severity: 2 };
  if (z <= 1) return { code: 'normal', label: 'Proporsi Ideal', severity: 0 };
  if (z <= 2) return { code: 'overweight_risk', label: 'Risiko Gizi Lebih', severity: 1 };
  if (z <= 3) return { code: 'overweight', label: 'Gizi Lebih (Overweight)', severity: 2 };
  return { code: 'obese', label: 'Obesitas', severity: 3 };
}

const SEVERITY_LABEL = ['Ideal', 'Perlu Perhatian', 'Waspada', 'Butuh Penanganan'];

function statusTheme(severity) {
  if (severity === 0) return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', bar: '#10B981' };
  if (severity === 1) return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', bar: '#F59E0B' };
  if (severity === 2) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', bar: '#F97316' };
  return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300', bar: '#EF4444' };
}

// Narasi ke Bunda (hangat, memotivasi) & versi klinis, per indikator & kode.
// Konten dasarnya dipertahankan dari versi awal, ditambah varian yang belum
// ada sebelumnya (severely_*, overweight_risk, overweight, obese, tall).
const NARRATIVES = {
  haz: {
    normal: { parent: 'Wah, hebat Bunda! Tinggi badan si Kecil saat ini sudah ideal dan sesuai dengan usianya. Pertumbuhan tulang dan tubuhnya berjalan sangat optimal. Terus pertahankan asupan gizi seimbangnya ya, Bun. Semangat terus mengawal tumbuh kembang si Kecil! 💕', clinical: 'Pertumbuhan linier dalam batas normal.' },
    tall: { parent: 'Tinggi badan si Kecil di atas rata-rata usianya — bukan hal yang perlu dikhawatirkan, Bun, tetap lanjutkan pola makan bergizi seimbang seperti biasa ya! 🌱', clinical: 'HAZ di atas +3 SD. Tidak ada indikasi patologis, pertumbuhan linier melebihi median populasi rujukan.' },
    stunted: { parent: 'Halo Bunda, dari hasil cek saat ini, tinggi badan si Kecil sepertinya masih sedikit di bawah standar usianya. Tapi jangan panik dulu ya, Bun! Yuk, jadikan ini pengingat buat pelan-pelan memperbaiki asupan gizinya, terutama protein hewani seperti telur, ayam, atau ikan. Jangan ragu buat konsultasi ke Posyandu atau dokter anak terdekat ya. Bunda pasti bisa, semangat! 💪', clinical: 'Indikasi gangguan pertumbuhan linier (stunting). Perlu evaluasi asupan nutrisi makro dan mikro, serta riwayat infeksi berulang.' },
    severely_stunted: { parent: 'Bunda, tinggi badan si Kecil saat ini jauh di bawah standar usianya dan butuh penanganan lebih serius. Yuk, secepatnya periksakan ke Puskesmas atau dokter anak untuk evaluasi lebih lanjut. Bunda tidak sendirian, tenaga kesehatan siap membantu perjalanan tumbuh kembang si Kecil 💛', clinical: 'HAZ < -3 SD. Severe stunting — indikasi gangguan pertumbuhan linier berat, evaluasi menyeluruh asupan gizi & riwayat infeksi, rujuk fasilitas kesehatan.' },
  },
  waz: {
    normal: { parent: 'Alhamdulillah, berat badan si Kecil terpantau sehat dan pas, Bun! Hebat banget Bunda sudah sabar memastikan nutrisi harian si Kecil terpenuhi. Yuk, lanjutkan terus rutinitas makan bergizi dan jangan lupa luangkan waktu buat istirahat biar Bunda juga bahagia! ✨', clinical: 'Berat badan sesuai dengan usia.' },
    underweight: { parent: 'Bunda, berat badan si Kecil saat ini butuh perhatian ekstra nih karena masih di bawah rata-rata. Tenang, Bun, masa pertumbuhan masih panjang kok! Coba kita koreksi lagi menu makanannya, mungkin butuh tambahan kalori, protein, atau lemak tambahan (seperti santan, minyak sayur, atau mentega). Tetap semangat ya, Bun, setiap suapan dari tangan Bunda itu sangat berharga buat si Kecil! 🍲', clinical: 'Kondisi underweight. Rekomendasikan konseling Pemberian Makan Bayi dan Anak (PMBA) serta monitoring berat badan mingguan.' },
    severely_underweight: { parent: 'Bunda sayang, berat badan si Kecil saat ini jauh di bawah standar dan perlu penanganan lebih serius. Yuk, secepatnya bawa ke Puskesmas atau dokter untuk dievaluasi dan dibantu program pemulihan gizinya. Bunda sudah berjuang luar biasa, sekarang saatnya minta bantuan tenaga profesional ya 🤍', clinical: 'WAZ < -3 SD. Indikasi gizi buruk — evaluasi segera & pertimbangkan tata laksana sesuai pedoman gizi buruk.' },
    overweight_risk: { parent: 'Bunda, berat badan si Kecil saat ini sedikit lebih dari rata-rata usianya. Bukan masalah besar kok, Bun — cukup jaga porsi makan tetap seimbang dan ajak si Kecil main aktif setiap hari ya 😊', clinical: 'WAZ > +1 SD. Belum masuk kategori risiko tinggi, pantau tren kenaikan berat badan berkala.' },
  },
  whz: {
    normal: { parent: 'Kabar gembira buat Bunda! Proporsi berat dan tinggi badan si Kecil sangat pas dan seimbang. Kelihatan banget nih Bunda pasti telaten merawatnya. Terus pantau dan berikan pelukan hangat setiap hari buat si Kecil ya, Bun! 🥰', clinical: 'Proporsi tubuh ideal (normal).' },
    wasted: { parent: 'Bunda sayang, postur tubuh si Kecil saat ini terlihat agak kurus dibandingkan dengan tinggi badannya. Jangan sedih dan jangan khawatir berlebihan ya, Bun, kita cari solusinya sama-sama. Yuk, segera bawa si Kecil ke bidan, puskesmas, atau dokter terdekat supaya dapat saran gizi terbaik dari ahlinya. Bunda hebat, yuk semangat kejar berat badan ideal si Kecil! 👩‍⚕️❤️', clinical: 'MAM/Wasting ringan — perlu intervensi gizi segera (Pemberian Makanan Tambahan).' },
    severely_wasted: { parent: 'Bunda, postur tubuh si Kecil saat ini butuh penanganan medis segera. Mohon secepatnya bawa ke fasilitas kesehatan terdekat ya, Bun — semakin cepat ditangani, semakin baik hasilnya. Bunda sudah melakukan hal yang tepat dengan memeriksakan si Kecil sekarang 💛', clinical: 'Indikasi SAM (Severe Acute Malnutrition) — rujuk segera untuk penanganan medis.' },
    overweight_risk: { parent: 'Proporsi berat dan tinggi si Kecil sedikit lebih dari ideal, Bun. Belum perlu khawatir, cukup jaga camilan manis/berlemak dan perbanyak main aktif ya 😊', clinical: 'WHZ +1 s.d. +2 SD. Berisiko gizi lebih, pantau tren dan pola makan.' },
    overweight: { parent: 'Bunda, berat badan si Kecil dibanding tingginya sudah tergolong lebih. Yuk pelan-pelan atur ulang porsi dan jenis makanannya, boleh juga konsultasi ke ahli gizi biar tetap terpenuhi nutrisinya tanpa berlebih ya, Bun 🍎', clinical: 'WHZ +2 s.d. +3 SD. Overweight — perlu pengaturan pola makan & aktivitas terstruktur.' },
    obese: { parent: 'Bunda, kondisi berat badan si Kecil saat ini perlu perhatian serius dari dokter atau ahli gizi anak. Yuk secepatnya konsultasi supaya si Kecil dibantu dengan cara yang aman dan tepat. Bunda hebat sudah peduli sejak dini 💪', clinical: 'WHZ > +3 SD. Obesitas — rujuk dokter spesialis anak/ahli gizi klinis untuk evaluasi & tata laksana terstruktur.' },
  },
};

// Rekomendasi diet & aktivitas — RULE-BASED, dikurasi dari pedoman resmi
// (bukan hasil model ML — lebih aman & defensible untuk domain gizi anak).
const RECOMMENDATIONS = {
  severely_stunted: {
    urgent: true,
    diet: ['Rujuk ke Puskesmas/dokter anak untuk evaluasi stunting berat.', 'Prioritaskan protein hewani harian (telur, ikan, ayam, hati ayam).', 'Kombinasikan dengan suplementasi sesuai anjuran tenaga kesehatan.'],
    aktivitas: ['Stimulasi motorik & sensorik rutin sesuai usia.', 'Pantau tumbuh kembang tiap bulan di Posyandu.'],
    sumber: 'Kemenkes RI - Strategi Nasional Percepatan Pencegahan Stunting; WHO',
  },
  stunted: {
    urgent: false,
    diet: ['Pastikan asupan zinc dan zat besi tercukupi (daging merah, hati, kacang-kacangan).', 'Kombinasikan ASI/susu lanjutan sesuai usia dengan MP-ASI yang beragam.'],
    aktivitas: ['Stimulasi motorik kasar (merangkak, berjalan, memanjat aman).', 'Pastikan paparan sinar matahari pagi cukup.'],
    sumber: 'Kemenkes RI - Stranas Percepatan Pencegahan Stunting; WHO',
  },
  severely_underweight: {
    urgent: true,
    diet: ['Rujuk segera ke Puskesmas/RS untuk evaluasi gizi buruk (WHO 10 Steps Management of SAM).', 'Pemberian makanan tinggi kalori-protein bertahap di bawah tata laksana medis.', 'Porsi kecil tapi sering, 6-8x makan/hari.'],
    aktivitas: ['Prioritaskan stabilisasi medis sebelum menambah aktivitas fisik.', 'Pantau tanda bahaya (letargi, edema, infeksi).'],
    sumber: 'WHO Guideline: Management of Severe Acute Malnutrition (2013); Kemenkes RI',
  },
  underweight: {
    urgent: false,
    diet: ['Tambah frekuensi makan jadi 5-6x sehari, porsi kecil tapi padat energi.', 'Perkaya menu dengan protein hewani setiap hari.', 'Tambahkan lemak sehat (minyak, santan, alpukat) untuk densitas kalori.'],
    aktivitas: ['Bermain aktif 30-60 menit/hari untuk merangsang nafsu makan.', 'Pastikan waktu tidur cukup (11-14 jam) untuk mendukung hormon pertumbuhan.'],
    sumber: 'Kemenkes RI - Pedoman Gizi Seimbang; WHO Complementary Feeding Guidelines',
  },
  severely_wasted: {
    urgent: true,
    diet: ['Rujuk segera untuk tata laksana SAM (F-75/F-100 di bawah pengawasan medis).', 'Porsi kecil dan sering, hindari makan besar sekaligus.'],
    aktivitas: ['Prioritaskan stabilisasi medis dahulu.', 'Pantau tanda bahaya & laporkan ke tenaga kesehatan.'],
    sumber: 'WHO Guideline: Management of Severe Acute Malnutrition (2013)',
  },
  wasted: {
    urgent: false,
    diet: ['Pemberian Makanan Tambahan (PMT) sesuai anjuran Posyandu/Puskesmas.', 'Tingkatkan densitas energi menu harian.'],
    aktivitas: ['Aktivitas ringan-sedang, hindari kelelahan berlebih.', 'Pantau berat badan mingguan.'],
    sumber: 'Kemenkes RI - Pedoman PMT Balita; WHO',
  },
  overweight_risk: {
    urgent: false,
    diet: ['Kurangi camilan/minuman tinggi gula dan lemak jenuh.', 'Perbanyak porsi sayur dan buah di tiap sesi makan.', 'Hindari makan sambil menonton layar.'],
    aktivitas: ['Aktivitas fisik aktif minimal 60 menit/hari.', 'Batasi screen time (<1 jam/hari untuk usia 2-4 tahun).'],
    sumber: 'WHO Guidelines on Physical Activity, Sedentary Behaviour; Kemenkes RI',
  },
  overweight: {
    urgent: false,
    diet: ['Konsultasi ke ahli gizi untuk pengaturan porsi tanpa membatasi nutrisi esensial.', 'Ganti camilan tinggi kalori dengan buah potong/susu rendah lemak.', 'Pola makan teratur 3x utama + 2x camilan sehat.'],
    aktivitas: ['Aktivitas fisik terstruktur 60 menit/hari.', 'Libatkan keluarga agar pola makan konsisten.'],
    sumber: 'IDAI - Rekomendasi Tata Laksana Obesitas pada Anak; WHO',
  },
  obese: {
    urgent: true,
    diet: ['Rujuk ke dokter spesialis anak/ahli gizi klinis untuk evaluasi terstruktur.', 'Skrining kondisi penyerta (resistensi insulin, dislipidemia) sesuai anjuran dokter.'],
    aktivitas: ['Program aktivitas fisik terpantau tenaga profesional.'],
    sumber: 'IDAI - Konsensus Tata Laksana Obesitas pada Anak dan Remaja',
  },
  normal: {
    urgent: false,
    diet: ['Pertahankan pola makan bergizi seimbang sesuai Isi Piringku.', 'Variasikan menu agar mikronutrien tetap lengkap.'],
    aktivitas: ['Pertahankan aktivitas fisik aktif harian dan waktu tidur cukup.'],
    sumber: 'Kemenkes RI - Pedoman Gizi Seimbang',
  },
  tall: {
    urgent: false,
    diet: ['Pola makan bergizi seimbang tetap dilanjutkan, tidak ada pembatasan khusus.'],
    aktivitas: ['Aktivitas fisik normal sesuai usia.'],
    sumber: 'Kemenkes RI - Pedoman Gizi Seimbang',
  },
};

// --- Klasifikasi satu titik data (dipakai untuk data "saat ini" MAUPUN "proyeksi") ---
function classifyChild({ usia, berat, tinggi }) {
  const medianHAZ = 85 + usia * 0.3;
  const medianWAZ = 9 + usia * 0.1;
  const medianWHZ = (berat / (tinggi / 100) ** 2) * 0.95;

  const haz = computeZScore(tinggi, medianHAZ, 3.5);
  const waz = computeZScore(berat, medianWAZ, 1.1);
  const whz = computeZScore(medianWHZ, 17, 2.5);

  const hazC = classifyHAZ(haz);
  const wazC = classifyWAZ(waz);
  const whzC = classifyWHZ(whz);

  const makeProbs = (severity) => {
    const base = [
      [72, 18, 7, 3],
      [20, 54, 18, 8],
      [8, 22, 52, 18],
      [3, 8, 18, 71],
    ][severity];
    const colors = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];
    return SEVERITY_LABEL.map((kelas, i) => ({ kelas, prob: base[i], color: colors[i] }));
  };

  return [
    { key: 'haz', label: 'Stunting (Tinggi Badan menurut Usia)', zscore: haz, ...hazC, probabilities: makeProbs(hazC.severity), narrative: NARRATIVES.haz[hazC.code] },
    { key: 'waz', label: 'Underweight (Berat Badan menurut Usia)', zscore: waz, ...wazC, probabilities: makeProbs(wazC.severity), narrative: NARRATIVES.waz[wazC.code] },
    { key: 'whz', label: 'Wasting (Berat Badan menurut Tinggi Badan)', zscore: whz, ...whzC, probabilities: makeProbs(whzC.severity), narrative: NARRATIVES.whz[whzC.code] },
  ];
}

async function fetchStatusGizi(payload) {
  const res = await fetch(STATUS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API merespons status ${res.status}`);
  return res.json();
}

// Kurva referensi per indikator (P3/P15/P50/P85/P97), placeholder demo —
// TODO: ganti dengan tabel WHO Growth Reference resmi per Permenkes.
function growthCurveData(indicatorKey) {
  return Array.from({ length: 60 }, (_, i) => {
    const usia = i + 1;
    if (indicatorKey === 'waz') {
      return { usia, p3: 7 + usia * 0.08, p15: 8 + usia * 0.09, p50: 9 + usia * 0.1, p85: 10.2 + usia * 0.11, p97: 11.5 + usia * 0.12 };
    }
    if (indicatorKey === 'whz') {
      return { usia, p3: 13 + usia * 0.02, p15: 14.5 + usia * 0.02, p50: 16 + usia * 0.02, p85: 17.5 + usia * 0.02, p97: 19 + usia * 0.02 };
    }
    // default: haz (tinggi)
    return { usia, p3: 70 + usia * 0.28, p15: 72 + usia * 0.3, p50: 76 + usia * 0.31, p85: 80 + usia * 0.32, p97: 83 + usia * 0.33 };
  });
}

const INDICATOR_UNIT = { haz: 'cm', waz: 'kg', whz: 'kg' };
const INDICATOR_CHART_TITLE = { haz: 'Kurva Tinggi Badan menurut Usia', waz: 'Kurva Berat Badan menurut Usia', whz: 'Kurva Berat Badan menurut Tinggi Badan' };

// --- Sub-components ---
const ProgressBar = ({ prob, color }) => (
  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${prob}%` }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="h-full rounded-full"
      style={{ backgroundColor: color }}
    />
  </div>
);

const Toggle = ({ value, onChange }) => (
  <div className="flex bg-slate-100 p-1.5 rounded-full shadow-inner border border-slate-200">
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        !value ? 'bg-white text-teal-700 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      Bahasa Sehari-hari
    </button>
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        value ? 'bg-white text-amber-700 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      Bahasa Medis
    </button>
  </div>
);

function StatusBadge({ label, severity, prefix }) {
  const theme = statusTheme(severity);
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
      {prefix ? `${prefix}: ` : ''}{label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Component
//
// Props opsional — kalau history/prediction dikirim dari alur sebelumnya
// (AnthropometryInputPage -> Prophet), form otomatis terisi dari data
// terakhir dan hasil klasifikasi menampilkan perbandingan Saat Ini vs
// Proyeksi 3 Bulan. Kalau tidak ada props, halaman tetap bisa dipakai berdiri
// sendiri lewat form manual seperti sebelumnya.
// ---------------------------------------------------------------------------
export default function ClassifierPage({ history = [], prediction = null, childProfile = null, onNextStep }) {
  const latestActual = history.length ? history[history.length - 1] : null;

  const [form, setForm] = useState({
    usia: latestActual ? String(latestActual.umur) : '',
    kelamin: childProfile?.jenisKelamin || 'L',
    berat: latestActual ? String(latestActual.berat) : '',
    tinggi: latestActual ? String(latestActual.tinggi) : '',
  });
  const [results, setResults] = useState(null);
  const [projectedResults, setProjectedResults] = useState(null);
  const [clinicalMode, setClinicalMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeChart, setActiveChart] = useState('haz'); // 'haz' | 'waz' | 'whz'
  const [isLoading, setIsLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  const projected3Bulan = useMemo(() => {
    if (!prediction) return null;
    const beratP = prediction.berat?.[prediction.berat.length - 1];
    const tinggiP = prediction.tinggi?.[prediction.tinggi.length - 1];
    if (!beratP || !tinggiP) return null;
    return { usia: beratP.umur, berat: beratP.yhat, tinggi: tinggiP.yhat };
  }, [prediction]);

  const curveData = growthCurveData(activeChart);
  const currentPoint = submitted ? { usia: parseInt(form.usia) || 24, value: activeChart === 'haz' ? parseFloat(form.tinggi) || 85 : parseFloat(form.berat) || 10 } : null;
  const projectedPoint = submitted && projectedResults && projected3Bulan
    ? { usia: projected3Bulan.usia, value: activeChart === 'haz' ? projected3Bulan.tinggi : projected3Bulan.berat }
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUsingMock(false);
    const usia = parseInt(form.usia) || 24;
    const berat = parseFloat(form.berat) || 10;
    const tinggi = parseFloat(form.tinggi) || 85;

    try {
      if (!STATUS_API_URL) throw new Error('no-api-configured');
      const payload = {
        gender: form.kelamin,
        current: { umurBulan: usia, berat, tinggi },
        projected: projected3Bulan,
      };
      const res = await fetchStatusGizi(payload);
      setResults(res.current);
      setProjectedResults(res.projected || null);
    } catch {
      setUsingMock(true);
      setResults(classifyChild({ usia, berat, tinggi }));
      setProjectedResults(projected3Bulan ? classifyChild(projected3Bulan) : null);
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  // Indikator dengan severity tertinggi (current ATAU proyeksi) -> penentu rekomendasi
  const worstIndicator = useMemo(() => {
    if (!results) return null;
    const pool = [...results];
    if (projectedResults) pool.push(...projectedResults);
    return pool.sort((a, b) => b.severity - a.severity)[0];
  }, [results, projectedResults]);

  const recommendation = worstIndicator ? RECOMMENDATIONS[worstIndicator.code] : null;

  // Animation variants
  const containerVars = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVars = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 25 } } };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center md:text-left">
          <span className="text-teal-700 text-sm font-bold uppercase tracking-widest mb-2 block">
            Asisten Pintar Tumbuh Kembang
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">
            Cek Status Gizi si Kecil
          </h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto md:mx-0">
            Masukkan data si Kecil di bawah ini, lalu biarkan sistem AI kami membantu Bunda membaca grafik pertumbuhannya dengan bahasa yang mudah dipahami.
          </p>
        </motion.div>

        {/* Info: data dari Prophet Engine */}
        {latestActual && (
          <div className="max-w-xl mx-auto md:mx-0 mb-8 p-4 bg-teal-50/60 border border-teal-100 rounded-2xl flex items-start gap-3 text-teal-900">
            <TrendingUp size={18} className="mt-0.5 text-teal-700 flex-shrink-0" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Form terisi otomatis dari data pengukuran terakhir ({latestActual.umur} bln). Bunda tetap bisa mengubahnya manual sebelum cek status gizi.
              {projected3Bulan && ` Proyeksi Prophet (${projected3Bulan.usia} bln) juga akan ikut diklasifikasikan.`}
            </p>
          </div>
        )}

        {/* Peringatan tabel referensi masih pendekatan sederhana */}
        <div className="max-w-xl mx-auto md:mx-0 mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 text-amber-600 flex-shrink-0" />
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Median/SD yang dipakai untuk menghitung Z-Score di halaman ini masih pendekatan sederhana, bukan tabel WHO LMS 2006 MGRS resmi yang sudah divalidasi di aplikasi mobile. Ganti sebelum dipakai untuk keputusan gizi sungguhan.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className={`grid gap-8 items-start transition-all duration-500 ${submitted ? 'lg:grid-cols-12' : 'max-w-xl mx-auto'}`}>

          {/* Form Section */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handleSubmit}
            className={`bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm ${submitted ? 'lg:col-span-4 sticky top-6' : ''}`}
          >
            <h2 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Baby size={22} className="text-teal-600" /> Masukkan Data si Kecil
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Usia Anak (Bulan)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number" min="0" max="60"
                    value={form.usia}
                    onChange={(e) => setForm({ ...form, usia: e.target.value })}
                    placeholder="Contoh: 24 (untuk 2 tahun)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Jenis Kelamin</label>
                <div className="flex gap-3">
                  {['L', 'P'].map((k) => (
                    <button
                      key={k} type="button"
                      onClick={() => setForm({ ...form, kelamin: k })}
                      className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                        form.kelamin === k ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {k === 'L' ? '♂ Laki-laki (L)' : '♀ Perempuan (P)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Berat Badan (Kilogram)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Scale size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number" step="0.1" min="0"
                    value={form.berat}
                    onChange={(e) => setForm({ ...form, berat: e.target.value })}
                    placeholder="Contoh: 10.5"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Panjang/Tinggi Badan (Sentimeter)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ruler size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="number" step="0.1" min="0"
                    value={form.tinggi}
                    onChange={(e) => setForm({ ...form, tinggi: e.target.value })}
                    placeholder="Contoh: 85"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Calculator size={20} />}
              {isLoading ? 'Menghitung...' : 'Cek Pertumbuhan Sekarang'}
            </motion.button>

            {usingMock && (
              <p className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold mt-3">
                <AlertTriangle size={12} />
                Mode demo: API classifier belum terhubung — pakai perhitungan lokal.
              </p>
            )}
          </motion.form>

          {/* Results Section */}
          <div className={`${submitted ? 'lg:col-span-8' : 'hidden'}`}>
            <AnimatePresence>
              {results && (
                <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6">

                  {/* Toggle Mode Penjelasan */}
                  <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
                    <p className="text-sm text-slate-700 font-semibold">Tampilkan penjelasan dalam:</p>
                    <Toggle value={clinicalMode} onChange={setClinicalMode} />
                  </div>

                  {/* Indikator Cards */}
                  {results.map((res, idx) => {
                    const theme = statusTheme(res.severity);
                    const proj = projectedResults?.[idx];
                    return (
                      <motion.div
                        variants={itemVars}
                        key={res.key}
                        className={`bg-white rounded-3xl p-6 md:p-8 border-2 ${theme.border} shadow-sm relative overflow-hidden`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                          <div>
                            <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900">{res.label}</h3>
                            <p className="text-xs text-slate-500 mt-1">Skor teknis (Z-score): {res.zscore > 0 ? '+' : ''}{res.zscore.toFixed(2)} SD</p>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            <StatusBadge label={SEVERITY_LABEL[res.severity]} severity={res.severity} prefix="Saat Ini" />
                            {proj && <StatusBadge label={SEVERITY_LABEL[proj.severity]} severity={proj.severity} prefix="Proyeksi 3 Bln" />}
                          </div>
                        </div>

                        {proj && proj.severity > res.severity && (
                          <div className="mb-5 flex items-center gap-2 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                            <AlertTriangle size={13} />
                            Tren proyeksi memburuk dibanding kondisi saat ini — pantau lebih ketat bulan-bulan ke depan.
                          </div>
                        )}

                        <div className={`rounded-2xl p-5 mb-6 border-l-4 ${clinicalMode ? 'bg-amber-50 border-l-amber-500' : 'bg-teal-50 border-l-teal-500'}`}>
                          <div className="flex items-center gap-2 mb-3">
                            {clinicalMode ? <Stethoscope size={20} className="text-amber-600" /> : <Info size={20} className="text-teal-600" />}
                            <span className={`text-sm font-bold uppercase tracking-wider ${clinicalMode ? 'text-amber-800' : 'text-teal-800'}`}>
                              {clinicalMode ? 'Analisis Klinis (Untuk Nakes)' : 'Saran & Semangat Buat Bunda'}
                            </span>
                          </div>
                          <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                            {clinicalMode ? res.narrative.clinical : res.narrative.parent}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                            Prediksi Sistem untuk Kondisi si Kecil
                          </p>
                          <div className="space-y-4">
                            {res.probabilities.map((p) => (
                              <div key={p.kelas} className="flex items-center gap-4">
                                <span className="w-32 text-sm text-slate-600 font-semibold">{p.kelas}</span>
                                <ProgressBar prob={p.prob} color={p.color} />
                                <span className="w-12 text-right text-sm font-bold text-slate-700">{p.prob}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Rekomendasi Diet & Aktivitas */}
                  {recommendation && (
                    <motion.div
                      variants={itemVars}
                      className={`rounded-3xl p-6 md:p-8 shadow-sm border ${recommendation.urgent ? 'bg-rose-50/60 border-rose-200' : 'bg-white border-slate-200'}`}
                    >
                      {recommendation.urgent && (
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-4">
                          <AlertOctagon size={18} />
                          <span>Perlu rujukan tenaga medis segera — rekomendasi ini bukan pengganti penanganan profesional.</span>
                        </div>
                      )}
                      <h3 className="font-serif text-xl font-bold text-slate-900 mb-5">Rekomendasi Diet & Aktivitas</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Apple size={16} className="text-teal-700" />
                            <p className="text-xs font-extrabold text-slate-700 uppercase">Anjuran Diet</p>
                          </div>
                          <ul className="space-y-2">
                            {recommendation.diet.map((d, i) => (
                              <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed flex gap-2">
                                <span className="text-teal-600 font-bold">•</span>{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Dumbbell size={16} className="text-teal-700" />
                            <p className="text-xs font-extrabold text-slate-700 uppercase">Anjuran Aktivitas</p>
                          </div>
                          <ul className="space-y-2">
                            {recommendation.aktivitas.map((a, i) => (
                              <li key={i} className="text-sm text-slate-600 font-medium leading-relaxed flex gap-2">
                                <span className="text-teal-600 font-bold">•</span>{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-5 pt-4 border-t border-slate-100">
                        Sumber acuan: {recommendation.sumber}. Rekomendasi bersifat edukatif berbasis pedoman umum, bukan diagnosis atau resep medis personal — tetap konsultasikan ke tenaga kesehatan untuk kondisi spesifik anak.
                      </p>
                    </motion.div>
                  )}

                  {/* Kurva Pertumbuhan */}
                  <motion.div variants={itemVars} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <Activity size={24} className="text-teal-600" />
                        <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900">{INDICATOR_CHART_TITLE[activeChart]}</h3>
                      </div>
                      <div className="flex bg-slate-100 rounded-xl p-1 w-fit">
                        {[
                          { key: 'haz', label: 'Tinggi Badan' },
                          { key: 'waz', label: 'Berat Badan' },
                          { key: 'whz', label: 'BB/TB' },
                        ].map((tab) => (
                          <button
                            key={tab.key} type="button"
                            onClick={() => setActiveChart(tab.key)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeChart === tab.key ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-400'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-8">Grafik dibandingkan dengan standar usia. Garis merah putus-putus = posisi saat ini, titik teal = proyeksi 3 bulan.</p>

                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={curveData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="usia" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} unit={INDICATOR_UNIT[activeChart]} />
                          <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelFormatter={(v) => `Usia: ${v} bulan`}
                          />
                          <Line type="monotone" dataKey="p97" stroke="#cbd5e1" dot={false} strokeWidth={1.5} name="Sangat Tinggi" />
                          <Line type="monotone" dataKey="p85" stroke="#5eead4" dot={false} strokeWidth={2} name="Tinggi" />
                          <Line type="monotone" dataKey="p50" stroke="#0d9488" dot={false} strokeWidth={3} name="Ideal (Median)" />
                          <Line type="monotone" dataKey="p15" stroke="#fcd34d" dot={false} strokeWidth={2} name="Batas Bawah Ideal" />
                          <Line type="monotone" dataKey="p3" stroke="#fca5a5" dot={false} strokeWidth={1.5} name="Kurang (Waspada)" />

                          {currentPoint && (
                            <>
                              <ReferenceLine x={currentPoint.usia} stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" />
                              <ReferenceLine
                                y={currentPoint.value}
                                stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3"
                                label={{ value: `Saat Ini (${currentPoint.value}${INDICATOR_UNIT[activeChart]})`, position: 'insideTopLeft', fill: '#be123c', fontSize: 12, fontWeight: 'bold' }}
                              />
                            </>
                          )}
                          {projectedPoint && (
                            <>
                              <ReferenceLine x={projectedPoint.usia} stroke="#0d9488" strokeWidth={2} strokeDasharray="6 3" />
                              <ReferenceLine
                                y={projectedPoint.value}
                                stroke="#0d9488" strokeWidth={2} strokeDasharray="6 3"
                                label={{ value: `Proyeksi (${projectedPoint.value}${INDICATOR_UNIT[activeChart]})`, position: 'insideBottomRight', fill: '#0f766e', fontSize: 12, fontWeight: 'bold' }}
                              />
                            </>
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {onNextStep && (
                    <motion.button
                      variants={itemVars}
                      onClick={() => onNextStep('riwayat')}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Sparkles size={18} /> Simpan Hasil ke Riwayat
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}