import _tables from './tables.json'

export interface Skill {
    name: string
    key: string
    initialValue: string[]
}

export type Attitude = [string, number]

export type DieTable = number | string | (string | string)[]

export interface StatTable {
  strength: number
  strengthDie: DieTable
  deftness: number
  deftnessDie: DieTable
  speed: number
  speedDie: DieTable
  health: number
  healthDie: DieTable
  wit: number
  witDie: DieTable
  will: number
  willDie: DieTable
  hitpointDie: DieTable
  brawling: number
  brawlingDie?: DieTable
  climbing: number
  climbingDie?: DieTable
  leaping: number
  leapingDie?: DieTable
  swimming: number
  swimmingDie?: DieTable
  magic?: number
  magicDie?: DieTable
  power?: number
  powerDie?: DieTable
}

export interface SkillChoiceDef {
  key?: string
  oneOf?: string[]
  fromSet?: string
}

export interface ItemDef {
  key: string
  // If undefined, name is generated from key
  name?: string
  damage?: string
}

export type ItemSpecial = 'bugeiWeapons'

export interface InventoryChoiceDef {
  type?: string
  oneOf?: string[]
  // Quantity is either a number or a string of the form "XdY"
  quantity?: number | string
  special?: ItemSpecial
  maxQuantity?: number
  dedupe?: boolean
}

interface Tables {
    skills: Skill[]
    skillSets: { [key: string]: string[] }
    attitudes: Attitude[]
    stats: { [key: string]: StatTable }
    initialSkills: { [key: string]: SkillChoiceDef[] }
    items: ItemDef[]
    initialItems: InventoryChoiceDef[]
    bugeiWeapons: { [key: string]: string[] }
}

// TODO: Switch to Dhall or a comparably powerful configuration language.
// @ts-ignore
const tables: Tables = _tables

export default tables
