import { useState, useRef, useEffect, useCallback } from 'react'

const RESET_TIMEOUT_MS = 10000
const MAX_TAPS = 8

export function useBpm(onBeat: () => void) {
  const [bpm, setBpm] = useState(0)
  const [lastManualTapTime, setLastManualTapTime] = useState(0)
  const tapsRef = useRef<number[]>([])
  const timerRef = useRef<any>(null)
  const lastBeatTimeRef = useRef<number>(0)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const lastTap = tapsRef.current[tapsRef.current.length - 1]

    if (lastTap && now - lastTap > RESET_TIMEOUT_MS) {
      tapsRef.current = []
    }

    tapsRef.current.push(now)
    if (tapsRef.current.length > MAX_TAPS) {
      tapsRef.current.shift()
    }

    if (tapsRef.current.length >= 2) {
      const intervals = []
      for (let i = 1; i < tapsRef.current.length; i++) {
        intervals.push(tapsRef.current[i] - tapsRef.current[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const newBpm = Math.round(60000 / avgInterval)
      setBpm(newBpm)

      // Update last manual tap time to sync the timer
      setLastManualTapTime(now)
      lastBeatTimeRef.current = now
    } else {
      setBpm(0)
    }
  }, [])

  useEffect(() => {
    if (bpm <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const intervalMs = 60000 / bpm

    const tick = () => {
      const now = Date.now()
      // If we are still tapping, don't trigger auto-beat too close to the last manual tap
      // Actually, if we just tapped, handleTap updated lastBeatTimeRef.
      // We want the auto-beat to be intervalMs after the last beat (manual or auto).
      onBeat()
      lastBeatTimeRef.current = now
    }

    // Schedule the next beat based on when the last beat occurred
    const timeSinceLastBeat = Date.now() - lastBeatTimeRef.current
    const delay = Math.max(0, intervalMs - timeSinceLastBeat)

    const startTimer = () => {
      timerRef.current = setInterval(tick, intervalMs)
    }

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
  }, [bpm, onBeat, lastManualTapTime])

  return { bpm, handleTap }
}
