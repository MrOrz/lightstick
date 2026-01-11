import { Routes, Route } from 'react-router'
import LandingPage from './components/LandingPage'
import GlowStick from './components/GlowStick'

function App() {
  return (
    <div className="w-full h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<GlowStick />} />
      </Routes>
    </div>
  )
}

export default App
