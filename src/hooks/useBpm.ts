import { useState, useRef, useEffect, useCallback } from 'react'

const RESET_TIMEOUT_MS = 10000
const MAX_TAPS = 8

export function useBpm(onBeat: () => void) {
  // lastManualTapTime serves as a synchronization signal to reset the timer phase
  const [lastManualTapTime, setLastManualTapTime] = useState(0)
  const tapsRef = useRef<number[]>([])
  const timerRef = useRef<any>(null)
  const lastBeatTimeRef = useRef<number>(0)

  // -- Derived values --
  // Calculate average interval and BPM based on tap history for higher precision
  let avgInterval = 0
  let bpm = 0

  const taps = tapsRef.current
  if (taps.length >= 2) {
    const intervals = []
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1])
    }
    avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    bpm = 60000 / avgInterval
  }

  const handleTap = useCallback(() => {
    const now = Date.now()
    const lastTap = tapsRef.current[tapsRef.current.length - 1]

    // Reset history if the interval since last tap is too long
    if (lastTap && now - lastTap > RESET_TIMEOUT_MS) {
      tapsRef.current = []
    }

    tapsRef.current.push(now)
    if (tapsRef.current.length > MAX_TAPS) {
      tapsRef.current.shift()
    }

    // Trigger re-render to recalculate avgInterval and reset the timer phase
    setLastManualTapTime(now)
    lastBeatTimeRef.current = now
  }, [])

  useEffect(() => {
    // If not enough data to calculate BPM, ensure timer is cleared
    if (avgInterval <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const tick = () => {
      onBeat()
      lastBeatTimeRef.current = Date.now()
    }

    // Calculate time until the next beat to align with manual taps
    const timeSinceLastBeat = Date.now() - lastBeatTimeRef.current
    const delay = Math.max(0, avgInterval - timeSinceLastBeat)

    const startTimer = () => {
      timerRef.current = setInterval(tick, avgInterval)
    }

    // Use a one-time timeout to align the phase, then start the regular interval
    const timeout = setTimeout(() => {
      tick()
      startTimer()
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [avgInterval, lastManualTapTime, onBeat])

  return { bpm, handleTap }
}
