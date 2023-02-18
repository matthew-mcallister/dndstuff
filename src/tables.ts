import _tables from './tables.json'

export interface Skill {
    name: string
    key: string
    initialValue: string[]
}

export type Attitude = [string, number]

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

export interface SkillChoiceDef {
  key?: string
  oneOf?: string[]
  setName?: string
}

// string = { "key": <value> }
// string[] = { "oneOf": <value> }
export type SkillChoice = string | string[] | SkillChoiceDef

export interface ItemDef {
  key: string
  // If undefined, name is generated from key
  name?: string
}

export type ItemSpecial = 'bugeiWeapons'

export interface InventoryChoiceDef {
  type?: string
  oneOf?: string[]
  // Quantity is either a number or a string of the form "XdY"
  quantity?: number | string
  special?: ItemSpecial
  maxQuantity?: number
}

// Similar to SkillChoice
export type InventoryChoice = string | string[] | InventoryChoiceDef

interface Tables {
    skills: Skill[]
    skillSets: { [key: string]: string[] }
    attitudes: Attitude[]
    stats: { [key: string]: StatTable }
    initialSkills: { [key: string]: SkillChoice[] }
    items: ItemDef[]
    initialItems: InventoryChoice[]
    bugeiWeapons: { [key: string]: string | string[] }
}

// @ts-ignore
const tables: Tables = _tables

export default tables
