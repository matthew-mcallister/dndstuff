import Handlebars from 'handlebars'
import { D20 } from './common'
import tables from './tables'

function skillToBcs(skill: number): number {
  if (skill < 0 || skill > 100) console.error('Invalid skill level', skill)
  if (skill === 0) return 0
  if (skill > 95) return 19
  // @ts-ignore
  return Math.floor((skill - 1) / 5) + 1
}

// Converts a "camelCase" string to a "Title Case" string (with spaces)
function keyToName(key: string): string {
  key = key.charAt(0).toUpperCase() + key.substring(1)
  return key.replace(/[A-Z]/g, c => ' ' + c)
}

function lookupItem(name: string): InventoryItem {
  let item = tables.items[name]
  if (!item) {
    item = { key: name }
  }

  if (!item.name) {
    item.name = keyToName(item.key)
  }

  item.quantity = 0

  return item
}

Handlebars.registerHelper('skillToBcs', skillToBcs)

export interface SkillValue {
  name: string
  value: number
}

export interface InventoryItem {
  key: string
  name: string
  quantity: number
}

export default class Npc {
  level: number

  attitudeRoll: D20 = 1
  attitude: string = 'Neutral'
  reactionBonus: number = 0

  strength: number = 0
  deftness: number = 0
  speed: number = 0
  health: number = 0
  wit: number = 0
  will: number = 0
  magic: number = 0
  hitpoints: number = 0
  power: number = 0

  brawling: number = 0
  climbing: number = 0
  leaping: number = 0
  swimming: number = 0

  ki: number = 1

  maxNumberActions: number = 0
  baseActionPhase: number = 0
  secondaryActionPhase1: number = 0
  secondaryActionPhase2: number = 0
  baseMovementAllowance: number = 0

  skills: { [key: string]: number } = {}
  inventory: { [key: string]: number } = {}

  // TODO: Sort alphabetically
  private skillList(): SkillValue[] {
    return Array.from(Object.entries(this.skills)).map(([k, v]) => {
      const skill = tables.skills.find(s => s.key === k)
      if (!skill) throw new Error(`Invalid skill: ${k}`)
      return {
        name: skill.name,
        value: v,
      }
    })
  }

  // TODO: Sort alphabetically and hide x1
  private inventoryList(): InventoryItem[] {
    return Array.from(Object.entries(this.inventory)).map(([k, v]) => {
      const item = lookupItem(k)
      item.quantity = v
      return item
    })
  }

  public render(): string {
    return renderNpc({
      ...this,
      skills: this.skillList(),
      inventory: this.inventoryList(),
    })
  }
}

const renderNpc = Handlebars.compile(`\
Level: {{level}}
{{#if profession}}
Profession: {{profession}}
{{/if}}

Attitude: {{attitude}} (rolled {{attitudeRoll}})
Reaction bonus: {{reactionBonus}}

Strength: {{strength}}
Deftness: {{deftness}}
Speed: {{speed}}
Health: {{health}}
Wit: {{wit}}
Will: {{will}}
Hitpoints: {{hitpoints}}
{{#if magic}}
Magic: {{magic}}
{{/if}}
{{#if power}}
Power: {{power}}
{{/if}}

Brawling: {{brawling}}
Climbing: {{climbing}}
Leaping: {{leaping}}
Swimming: {{swimming}}

Ki: {{ki}}

Base action phase: {{baseActionPhase}}
{{#if secondaryActionPhase1}}
Secondary action phase: {{secondaryActionPhase1}}
{{/if}}
{{#if secondaryActionPhase2}}
Secondary action phase: {{secondaryActionPhase2}}
{{/if}}
Base movement allowance: {{baseMovementAllowance}}

{{#each skills}}
{{#if value}}
{{name}}: {{value}} (BCS: {{skillToBcs value}})
{{/if}}
{{/each}}

{{#each inventory}}
{{#if quantity}}
{{name}} x{{quantity}}
{{/if}}
{{/each}}
`)
