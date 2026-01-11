import { useEffect, useCallback } from 'react'

export function useFullscreen() {
  const requestFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch (err) {
      console.log('Fullscreen request failed:', err)
    }
  }, [])

  useEffect(() => {
    requestFullscreen()

    // Re-request full screen after switching to other app and comes back
    document.documentElement.addEventListener('pointerup', requestFullscreen)

    return () => {
      document.documentElement.removeEventListener('pointerup', requestFullscreen)
    }
  }, [requestFullscreen])

  return { requestFullscreen }
}
