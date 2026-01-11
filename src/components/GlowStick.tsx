import { useState, useCallback } from 'react'
import { useWakeLock } from '../hooks/useWakeLock'
import { useFullscreen } from '../hooks/useFullscreen'
import { useBpm } from '../hooks/useBpm'

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

  const nextColor = useCallback(() => {
    setCurrentColorIndex((prev) => (prev + 1) % COLORS.length)
  }, [])

  const { bpm, handleTap } = useBpm(nextColor)

  const currentColor = COLORS[currentColorIndex]

  return (
    <div
      id="glow-stick-surface"
      className="w-full h-screen flex flex-col items-center justify-center transition-colors duration-300 cursor-pointer select-none touch-manipulation relative"
      style={{ backgroundColor: currentColor }}
      onPointerDown={() => {
        nextColor()
        handleTap()
      }}
    >
      <div className="text-white/20 text-6xl font-bold animate-pulse">
        {currentColorIndex + 1} / {COLORS.length}
      </div>
      {bpm > 0 && (
        <div className="absolute bottom-8 text-white/40 text-2xl font-mono">
          {bpm.toFixed(2)} BPM
        </div>
      )}
    </div>
  )
}

