import Handlebars from 'handlebars'
import { D20, d20, d } from './common'
import tables from './tables'

export type Inventory = Map<string, number>

function skillToBcs(skill: number): number {
  if (skill < 0 || skill > 100) console.error('Invalid skill level', skill)
  if (skill === 0) return 0
  if (skill > 95) return 19
  // @ts-ignore
  return Math.floor((skill - 1) / 5) + 1
}

Handlebars.registerHelper('skillToBcs', skillToBcs)

function calculateStat(base: number, die: number, level: number): number {
  if (die === 0) {
    return base
  } else if (die === 1) {
    return base + level
  } else {
    return base + d(die, level)
  }
}

interface SkillValue {
  name: string
  value: number
}

interface InventoryItem {
  key: string
  name: string
  quantity: number
}

// Converts a "camelCase" string to a "Title Case" string (with spaces)
function keyToName(key: string): string {
    key = key.charAt(0).toUpperCase() + key.substring(1)
    return key.replace(/[A-Z]/g, (c) => ' ' + c)
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

function parseQuantity(qty: number | string): number {
  if (typeof qty === 'string') {
    const [n, m] = qty.split('d')
    return d(Number(m), Number(n))
  } else {
    return qty
  }
}

export class BushidoHuman {
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

  // Currently I don't think there's any way to randomly generate an NPC
  // with ki > 1
  ki: number = 1

  initialSkills: Set<string> = new Set()
  skills: Map<string, number> = new Map()

  inventory: Inventory = new Map()

  public constructor(level: number) {
    this.level = level
  }

  private generateAttitude(): void {
    this.attitudeRoll = d20()
    const [attitude, bonus] = tables.attitudes[this.attitudeRoll - 1]
    this.attitude = attitude
    this.reactionBonus = bonus
  }

  public generateAttributes(tableName: string): void {
    const table = tables.stats[tableName]

    this.strength = table.strength
    this.deftness = table.deftness
    this.speed = table.speed
    this.health = table.health
    this.wit = table.wit
    this.will = table.will

    this.hitpoints = calculateStat(table.hitpoints, table.hitpointDie || 0, this.level)
    this.brawling = calculateStat(table.brawling, table.brawlingDie || 0, this.level)
    this.climbing = calculateStat(table.climbing, table.climbingDie || 0, this.level)
    this.leaping = calculateStat(table.leaping, table.leapingDie || 0, this.level)
    this.swimming = calculateStat(table.swimming, table.swimmingDie || 0, this.level)
    this.magic = calculateStat(table.magic || 0, table.magicDie || 0, this.level)
    this.power = calculateStat(table.power || 0, table.powerDie || 0, this.level)
  }

  private generateInitialSkillValues(): Map<string, number> {
    const values = new Map()
    for (const skill of tables.skills) {
      let value = 0
      for (const key of skill.initialValue) {
        value += this[key]
      }
      values.set(skill.key, value)
    }
    return values
  }

  private generateInitialSkills(tableName: string): void {
    const initialSkills = this.initialSkills

    function select(choices: string[]) {
      choices = choices.filter(choice => !initialSkills.has(choice))
      if (!choices.length) return
      const i = Math.floor(Math.random() * choices.length)
      const skill = Array.from(choices)[i]
      initialSkills.add(skill)
    }

    for (const x of tables.initialSkills[tableName]) {
      if (typeof x === 'string') {
        select([x])
      } else if (x instanceof Array) {
        select(x)
      } else if (typeof x == 'object') {
        select(tables.skillSets[x['setName']])
      } else {
        throw new Error('Invalid skill def: ' + x)
      }
    }
  }

  private generateSkills(): void {
    const values = this.generateInitialSkillValues()
    this.initialSkills.forEach(skill => {
      this.skills.set(skill, values.get(skill))
    })
  }

  private generateInventory(tableName: string): void {
    const inventory = this.inventory;
    function addItems(key: string, qty: number): void {
      inventory.set(key, (inventory.get(key) || 0) + qty)
    }
    for (const x of tables.initialItems[tableName]) {
      let choices = []
      let quantity = 1
      if (typeof x === 'string') {
        choices = [x]
      } else if (x instanceof Array) {
        choices = x
      } else if (typeof x == 'object') {
        choices = x.oneOf
        quantity = parseQuantity(x.quantity)
      } else {
        throw new Error('Invalid inventory def: ' + x)
      }
      let key
      if (choices.length > 1) {
        const i = Math.floor(Math.random() * choices.length)
        key = Array.from(choices)[i]
      } else {
        key = choices[0]
      }
      addItems(key, quantity)
    }
  }

  private _generate(
    stats: string,
    initialSkills: string,
    items?: string | string[],
  ): void {
    this.generateAttitude()
    this.generateAttributes(stats)
    this.generateInitialSkills(initialSkills)
    this.generateSkills()
    if (typeof items === 'string') {
      this.generateInventory(items)
    } else if (items instanceof Array) {
      for (const table of items) {
        this.generateInventory(table)
      }
    }
  }

  public static generate(
    level: number,
    stats: string,
    initialSkills: string,
    items?: string | string[],
  ): BushidoHuman {
    const x = new BushidoHuman(level)
    x._generate(stats, initialSkills, items)
    return x
  }

  private skillList(): SkillValue[] {
    return Array.from(this.skills.entries()).map(([k, v]) => {
      const skill = tables.skills.find(s => s.key === k)
      if (!skill) throw new Error(`Invalid skill: ${k}`)
      return {
        name: skill.name,
        value: v,
      }
    })
  }

  private inventoryList(): InventoryItem[] {
    return Array.from(this.inventory.entries()).map(([k, v]) => {
      const item = lookupItem(k)
      item.quantity = v
      return item
    })
  }

  public render(): string {
    return renderHuman({
      ...this,
      skills: this.skillList(),
      inventory: this.inventoryList(),
    })
  }
}

const renderHuman = Handlebars.compile(`\
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