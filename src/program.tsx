import React, { useEffect, useRef } from 'react'
import { Noise } from 'noisejs'
import { vec2, Vec2, rescale, loopNumber } from './math'
import { useCanvasPixelsAnimationFrame } from './util'

const noiseX = new Noise(Math.random())
const noiseY = new Noise(Math.random())

export function Program() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const numChannels = 4

  const state = useRef<{
    velocities: Vec2[]
    prevVelocities: Vec2[]
  }>({
    velocities: [],
    prevVelocities: []
  })

  useCanvasPixelsAnimationFrame(
    canvasRef,
    function init(pixels: Uint8ClampedArray, width: number, height: number) {
      const velocities = new Array(width * height)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cellAddr = y * width + x

          const pt = vec2(x, y).div(vec2(width, height)).scale(2)

          velocities[cellAddr] = vec2(noiseX.simplex2(pt.x, pt.y), noiseY.simplex2(pt.x, pt.y))
        }
      }

      state.current.velocities = velocities
      state.current.prevVelocities = [...velocities]
    },
    function draw(pixels: Uint8ClampedArray, width: number, height: number, t: number, dt: number) {
      const { velocities, prevVelocities } = state.current

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cellAddr = y * width + x
          const pixelAddr = y * (width * numChannels) + x * numChannels

          const velocity = prevVelocities[cellAddr]

          const nextCell = vec2(
            loopNumber(Math.round(x + velocity.x * dt), width),
            loopNumber(Math.round(y + velocity.y * dt), height)
          )

          velocity

          const nextVelocity = vec2(velocity.x, velocity.y)

          velocities[cellAddr] = nextVelocity

          pixels[pixelAddr + 0] = rescale(nextVelocity.x, [-1, 1], [0, 255]) // R
          pixels[pixelAddr + 1] = 0 // G
          pixels[pixelAddr + 2] = rescale(nextVelocity.y, [-1, 1], [0, 255]) // B
          pixels[pixelAddr + 3] = 255 // A
        }
      }

      state.current.prevVelocities = velocities
      state.current.velocities = prevVelocities
    }
  )

  return (
    <>
      Hello world
      <canvas width={128} height={128} ref={canvasRef}></canvas>
    </>
  )
}
