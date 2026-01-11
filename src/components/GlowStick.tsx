import { useEffect, useState, useRef } from 'react'

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
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const pointerDownTime = useRef<number>(0)
  const TAP_THRESHOLD_MS = 200

  // Request wake lock and fullscreen
  useEffect(() => {
    const requestLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          const lock = await navigator.wakeLock.request('screen')
          wakeLockRef.current = lock
          console.log('Wake Lock acquired')

          lock.addEventListener('release', () => {
            wakeLockRef.current = null
            console.log('Wake Lock released')
          })
        }
      } catch (err) {
        console.error('Wake Lock request failed:', err)
      }
    }

    const requestFS = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (err) {
        // This will likely fail on first mount if not triggered directly by click
        // but that's okay, handlePointerUp will catch it on first tap
        console.log('Initial fullscreen request failed:', err)
      }
    }

    requestLock()
    requestFS()

    // Re-acquire wake lock if visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handlePointerDown = () => {
    pointerDownTime.current = Date.now()
  }

  const handlePointerUp = async () => {
    const duration = Date.now() - pointerDownTime.current

    // Try to re-enter fullscreen if lost (e.g. after screen lock)
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
      } catch (err) {
        console.log('Recover fullscreen failed:', err)
      }
    }

    // Only change color if it was a quick tap (not a long hold)
    if (duration < TAP_THRESHOLD_MS) {
      setCurrentColorIndex((prev) => (prev + 1) % COLORS.length)
    }
  }

  const currentColor = COLORS[currentColorIndex]

  return (
    <div
      className="w-full h-screen flex items-center justify-center transition-colors duration-300 cursor-pointer select-none"
      style={{ backgroundColor: currentColor }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="text-white/20 text-6xl font-bold animate-pulse">
        {currentColorIndex + 1} / {COLORS.length}
      </div>
    </div>
  )
}
