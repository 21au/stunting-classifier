import GrowthCurveHero from './components/GrowthCurveHero'
import PredictionForm from './components/PredictionForm'

function App() {
  return (
    <div className="min-h-screen">
      <GrowthCurveHero />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <PredictionForm />
      </div>
    </div>
  )
}

export default App