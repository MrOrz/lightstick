import { useRef, type PointerEvent } from 'react'

const TAP_THRESHOLD_MS = 200

export function usePointerManager(onTap: () => void) {
  const pointerMap = useRef<Map<number, number>>(new Map())

  const handlePointerDown = (e: PointerEvent) => {
    const now = Date.now()
    pointerMap.current.set(e.pointerId, now)
  }

  const handlePointerUp = (e: PointerEvent) => {
    const startTime = pointerMap.current.get(e.pointerId)
    const now = Date.now()

    if (startTime === undefined) {
      return
    }

    const duration = now - startTime
    pointerMap.current.delete(e.pointerId)


    if (duration < TAP_THRESHOLD_MS) {
      onTap()
    }
  }

  const handlePointerCancel = (e: PointerEvent) => {
    pointerMap.current.delete(e.pointerId)
  }

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  }
}

