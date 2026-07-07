import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts'
import { motion } from 'framer-motion'

function generatePercentileCurves() {
  const data = []
  for (let age = 0; age <= 60; age += 2) {
    data.push({
      age,
      p3: 45 + age * 0.65 - (age > 24 ? (age - 24) * 0.15 : 0),
      p50: 50 + age * 0.85 - (age > 24 ? (age - 24) * 0.2 : 0),
      p97: 55 + age * 1.05 - (age > 24 ? (age - 24) * 0.25 : 0),
    })
  }
  return data
}

export default function GrowthChart({ childAge, childHeight, prediction }) {
  const data = generatePercentileCurves()

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-sage rounded-2xl p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-1">Posisi pada Kurva Pertumbuhan</h3>
      <p className="text-muted text-sm mb-4">Tinggi badan relatif terhadap persentil standar usia</p>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8DE" />
          <XAxis dataKey="age" label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5 }} tick={{ fontSize: 11 }} />
          <YAxis label={{ value: 'Tinggi (cm)', angle: -90, position: 'insideLeft' }} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8DE', fontSize: 12 }} />
          <Line type="monotone" dataKey="p97" stroke="#94A899" strokeWidth={1.5} dot={false} name="Persentil 97" />
          <Line type="monotone" dataKey="p50" stroke="#0F766E" strokeWidth={2} dot={false} name="Persentil 50 (median)" />
          <Line type="monotone" dataKey="p3" stroke="#94A899" strokeWidth={1.5} dot={false} name="Persentil 3" />
          <ReferenceDot x={childAge} y={childHeight} r={8} fill="#F97362" stroke="#fff" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-2 mt-3 text-xs text-muted">
        <span className="w-3 h-3 rounded-full bg-coral inline-block" /> Posisi anak saat ini
      </div>
    </motion.div>
  )
}