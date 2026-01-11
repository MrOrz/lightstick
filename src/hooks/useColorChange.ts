import { useRef } from 'react'

export function useColorChange(onChange: () => void) {
  const pointerDownTime = useRef<number>(0)
  const TAP_THRESHOLD_MS = 200

  const handlePointerDown = () => {
    pointerDownTime.current = Date.now()
  }

  const handlePointerUp = () => {
    const duration = Date.now() - pointerDownTime.current

    if (duration < TAP_THRESHOLD_MS) {
      onChange()
    }
  }

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  }
}
