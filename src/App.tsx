import { useState } from 'react'
import LandingPage from './components/LandingPage'
import GlowStick from './components/GlowStick'

function App() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="w-full h-screen">
      {!isActive ? (
        <LandingPage onStart={() => setIsActive(true)} />
      ) : (
        <GlowStick />
      )}
    </div>
  )
}

export default App
