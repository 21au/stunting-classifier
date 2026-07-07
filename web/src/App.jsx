import AppHeader from './components/AppHeader'
import GrowthCurveHero from './components/GrowthCurveHero'
import ModelStats from './components/ModelStats'
import PredictionForm from './components/PredictionForm'

function App() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <GrowthCurveHero />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <ModelStats />
        <PredictionForm />
      </div>
    </div>
  )
}

export default App