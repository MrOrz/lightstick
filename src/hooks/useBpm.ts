import { useState, useRef, useEffect, useCallback } from 'react'

const RESET_TIMEOUT_MS = 10000
const MAX_TAPS = 8

function getAvgInterval(taps: number[]) {
  if (taps.length < 2) return 0
  return (taps[taps.length - 1] - taps[0]) / (taps.length - 1)
}

export function useBpm(onBeat: () => void) {
  // lastManualTapTime serves as a synchronization signal to reset the timer phase
  const [lastManualTapTime, setLastManualTapTime] = useState(0)

  // timestamp (ms) of the latest taps
  const tapsRef = useRef<number[]>([])
  const timerRef = useRef<any>(null)

  // timestamp (ms) of the last beat
  const lastBeatTimeRef = useRef<number>(0)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const taps = tapsRef.current
    const lastTap = taps[taps.length - 1]

    if (lastTap) {
      const avgInterval = getAvgInterval(taps)
      // Reset history if:
      // 1. Hard reset timeout reached (10s)
      // 2. Or, if we have an established rhythm, more than 4 beats have passed
      const isLongWait = now - lastTap > RESET_TIMEOUT_MS
      const isOffBeat = avgInterval > 0 && now - lastTap > avgInterval * 4

      if (isLongWait || isOffBeat) {
        tapsRef.current = []
      }
    }

    tapsRef.current.push(now)
    if (tapsRef.current.length > MAX_TAPS) {
      tapsRef.current.shift()
    }

    // Trigger re-render to reset the timer phase
    setLastManualTapTime(now)
    lastBeatTimeRef.current = now
  }, [])

  useEffect(() => {
    const avgInterval = getAvgInterval(tapsRef.current)

    // If not enough data to calculate rhythm, ensure timer is cleared
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
  }, [lastManualTapTime, onBeat])

  const currentInterval = getAvgInterval(tapsRef.current)
  return {
    bpm: currentInterval > 0 ? 60000 / currentInterval : 0,
    handleTap
  }
}
