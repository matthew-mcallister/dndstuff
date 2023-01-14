export type Stats = { [key: string]: number }

export class StatRange {
  public min: number
  public max: number

  constructor(min: number, max: number) {
    this.min = min
    this.max = max
  }

  generate(): number {
    return Math.floor(this.min + (this.max - this.min + 1) * Math.random())
  }
}

export type StatRanges = { [key: string]: StatRange }

export class Npc {
  public stats: Stats

  constructor(stats: Stats) {
    this.stats = stats
  }

  static generate(ranges: StatRanges): Npc {
    const stats = Object.fromEntries(Object.entries(ranges).map(([name, range]) => (
      [name, range.generate()]
    )))
    return new Npc(stats)
  }
}