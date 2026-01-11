import { useEffect, useRef } from 'react'

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

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

    requestLock()

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
}
