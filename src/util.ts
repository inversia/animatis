import React, { useState, useEffect, useMemo, useRef } from 'react'

export function useAnimationFrame(onFrame: (t: number, dt: number) => void) {
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  useEffect(() => {
    let isMounted = true
    let rafHandle: number | null = null
    let prevTime: number | null = null
    let initialTime: number | null = null

    function callback(time: number) {
      time /= 1000.0
      initialTime = initialTime ?? time
      onFrameRef.current(time - (initialTime ?? 0), time - (prevTime ?? 0))
      prevTime = time
      if (isMounted) rafHandle = window.requestAnimationFrame(callback)
    }

    rafHandle = window.requestAnimationFrame(callback)

    return () => {
      isMounted = false
      if (rafHandle !== null) window.cancelAnimationFrame(rafHandle)
    }
  }, [])
}

export function useCanvasPixelsAnimationFrame(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onInit: (pixels: Uint8ClampedArray, width: number, height: number) => void,
  onFrame: (pixels: Uint8ClampedArray, width: number, height: number, t: number, dt: number) => void
) {
  const [canvas, setCanvas] = useState(canvasRef.current)

  useEffect(() => {
    setCanvas(canvasRef.current)
  }, [])

  const { context, width, height } = useMemo(() => {
    const context = canvas?.getContext('2d')
    return {
      context,
      width: canvas?.width || 0,
      height: canvas?.height || 0
    }
  }, [canvas])

  const imgData = useMemo(() => {
    const newData = context?.createImageData(width, height)
    if (newData) onInit(newData.data, width, height)
    return newData
  }, [context, width, height])

  useAnimationFrame((t: number, dt: number) => {
    if (!context || !imgData) return

    onFrame(imgData.data, width, height, t, dt)

    context.putImageData(imgData, 0, 0)
  })
}
