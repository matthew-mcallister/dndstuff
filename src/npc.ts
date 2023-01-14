export type Stats = { [key: string]: number }

export class StatRange {
  public name: string;
  public min: number
  public max: number

  constructor(name: string, min: number, max: number) {
    this.name = name;
    this.min = min
    this.max = max
  }

  generate(): number {
    return Math.floor(this.min + (this.max - this.min + 1) * Math.random())
  }
}

export class Npc {
  public stats: Stats

  constructor(stats: Stats) {
    this.stats = stats
  }

  static generate(ranges: StatRange[]): Npc {
    const stats = Object.fromEntries(ranges.map((range) => (
      [range.name, range.generate()]
    )))
    return new Npc(stats)
  }
}