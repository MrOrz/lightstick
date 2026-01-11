import { useState, useCallback, useRef, useEffect } from 'react'
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
  const [tapPos, setTapPos] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  useWakeLock()
  useFullscreen()

  const triggerNext = useCallback((x?: number, y?: number) => {
    // Reset animation state
    setIsAnimating(false)

    // Set new position and color
    const posX = x ?? window.innerWidth / 2
    const posY = y ?? window.innerHeight / 2
    setTapPos({ x: posX, y: posY })
    setCurrentColorIndex((prev) => (prev + 1) % COLORS.length)

    // Trigger animation in next frame to ensure "isAnimating: false" is applied first
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })
  }, [])

  const { handleTap, bpm } = useBpm(triggerNext)

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    triggerNext(e.clientX, e.clientY)
    handleTap()
  }

  const prevColorIndex = (currentColorIndex - 1 + COLORS.length) % COLORS.length

  // Ripple size constants
  const rippleSize = '300vmax'
  const rippleRadiusNum = 150 // vmax half

  const surfaceStyle: React.CSSProperties = {
    backgroundColor: COLORS[prevColorIndex],
    backgroundImage: `radial-gradient(circle closest-side, ${COLORS[currentColorIndex]} 99%, transparent 100%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: isAnimating ? `${rippleSize} ${rippleSize}` : '0vmax 0vmax',
    backgroundPosition: isAnimating
      ? `calc(${tapPos.x}px - ${rippleRadiusNum}vmax) calc(${tapPos.y}px - ${rippleRadiusNum}vmax)`
      : `${tapPos.x}px ${tapPos.y}px`,
    transition: isAnimating
      ? 'background-size 0.6s ease-out, background-position 0.6s ease-out'
      : 'none',
  }

  return (
    <div
      id="glow-stick-surface"
      className="w-full h-screen flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation relative overflow-hidden"
      style={surfaceStyle}
      onPointerDown={handlePointerDown}
    >
      <div className="z-10 text-white/20 text-6xl font-bold animate-pulse pointer-events-none">
        {currentColorIndex + 1} / {COLORS.length}
      </div>
      {bpm > 0 && (
        <div className="z-10 absolute bottom-8 text-white/40 text-2xl font-mono pointer-events-none">
          {bpm.toFixed(2)} BPM
        </div>
      )}
    </div>
  )
}

