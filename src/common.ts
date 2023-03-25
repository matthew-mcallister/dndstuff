export type D6 = 1 | 2 | 3 | 4 | 5 | 6
export type D10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type D20 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20

export function d(die: number, count: number = 1): number {
  if (die <= 0 || count <= 0) {
    return 0
  } else if (die === 1) {
    return count
  }

  let sum = 0
  for (let i = 0; i < count; i += 1) {
    sum += Math.floor(1 + Math.random() * die)
  }
  return sum
}

export function d3(): D6
export function d3(count: number): number
export function d3(count: number = 1): number {
  return d(3, count)
}

export function d6(): D6
export function d6(count: number): number
export function d6(count: number = 1): number {
  return d(6, count)
}

export function d10(): D10
export function d10(count: number): number
export function d10(count: number = 1): number {
  return d(10, count)
}

export function d20(): D20
export function d20(count: number): number
export function d20(count: number = 1): number {
  return d(20, count)
}