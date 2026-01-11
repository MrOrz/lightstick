import { useState } from 'react'
import { useWakeLock } from '../hooks/useWakeLock'
import { useFullscreen } from '../hooks/useFullscreen'
import { usePointerManager } from '../hooks/usePointerManager'

const COLORS = [
  '#FF1744',
  '#FF9100',
  '#FF3D00',
  '#FFEA00',
  '#acc700',
  '#00E676',
  '#00c22a',
  '#2dffb2',
  '#2979FF',
  '#00E5FF',
  '#D500F9',
  '#651FFF',
]

export default function GlowStick() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  useWakeLock()
  useFullscreen()
  const { handlers } = usePointerManager(() => {
    setCurrentColorIndex((prev) => (prev + 1) % COLORS.length)
  })

  const currentColor = COLORS[currentColorIndex]

  return (
    <div
      id="glow-stick-surface"
      className="w-full h-screen flex items-center justify-center transition-colors duration-300 cursor-pointer select-none touch-manipulation"
      style={{ backgroundColor: currentColor }}
      {...handlers}
    >
      <div className="text-white/20 text-6xl font-bold animate-pulse">
        {currentColorIndex + 1} / {COLORS.length}
      </div>
    </div>
  )
}
