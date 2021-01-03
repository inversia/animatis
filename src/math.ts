export interface Vec2 extends ReturnType<typeof vec2> {}

export function vec2(x: number, y: number) {
  const self = {
    x,
    y,

    add: (v: Vec2) => vec2(x + v.x, y + v.y),

    mult: (v: Vec2) => vec2(x * v.x, y * v.y),

    div: (v: Vec2) => vec2(x / v.x, y / v.y),

    sub: (v: Vec2) => self.add(v.negative()),

    distance: (v: Vec2) => self.sub(v).length(),

    scale: (s: number) => vec2(x * s, y * s),

    negative: () => vec2(-x, -y),

    lengthSquared: () => x * x + y * y,

    length: () => Math.sqrt(x * x + y * y),

    normalize: () => self.scale(1.0 / self.length()),

    rescale: (l: number) => self.normalize().scale(l),

    perp: () => vec2(-y, x),

    // multiplies vectors as complex numbers
    complexMult: (v: Vec2) => v.scale(x).add(v.perp().scale(y)),

    toString: () => `Vec2(${x}, ${y})`
  }

  return self
}

export function rescale(x: number, from: [number, number], to: [number, number]) {
  const t = (x - from[0]) / (from[1] - from[0])
  return to[0] + (to[1] - to[0]) * t
}

export function loopNumber(i: number, length: number) {
  return (length + (i % length)) % length
}
