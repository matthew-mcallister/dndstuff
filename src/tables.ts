import _tables from './tables.json'

interface Skill {
    name: string
    // TODO: key may be redundant
    key: string
    initialValue: string[]
}

type Attitude = [string, number]

export interface StatTable {
  strength: number
  deftness: number
  speed: number
  health: number
  wit: number
  will: number
  hitpoints: number
  hitpointDie: number
  brawling: number
  brawlingDie?: number
  climbing: number
  climbingDie?: number
  leaping: number
  leapingDie?: number
  swimming: number
  swimmingDie?: number
  magic?: number
  magicDie?: number
  power?: number
  powerDie?: number
}

// string = randomly choose from named SkillSet
// string[] = random choose from options (i.e. inline SkillSet)
type SkillChoice = string | string[]

interface Tables {
    skills: Skill[]
    skillSets: { [key: string]: string[] }
    attitudes: Attitude[]
    stats: { [key: string]: StatTable }
    initialSkills: { [key: string]: SkillChoice[] }
}

// @ts-ignore
const tables: Tables = _tables

export default tables
