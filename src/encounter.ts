type StatRange = {
  min: number;
  max: number;
}

type StatRanges = { [key: string]: StatRange };
type Stats = { [key: string]: number }

export function generateStats(ranges: StatRanges): Stats {
  const stats: Stats = {};
  for (const [key, range] of Object.entries(ranges)) {
    const value = range.min + Math.floor((range.max - range.min + 1) * Math.random());
    stats[key] = value;
  }
  return stats
}

interface NpcClassProps {

}

class NpcClass {
  constructor(props: NpcClassProps) {

  }
}