import { D20, d20, d } from './common'
import tables, { InventoryChoiceDef } from './tables'
import Npc from './Npc'

export type Inventory = Map<string, number>

function calculateStat(base: number, die: number, level: number): number {
  if (die === 0) {
    return base
  } else if (die === 1) {
    return base + level
  } else {
    return base + d(die, level)
  }
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

  public toNpc(): Npc {
    let npc = new Npc()
    Object.assign(npc, this)
    npc.skills = Object.fromEntries(this.skills.entries())
    npc.inventory = Object.fromEntries(this.inventory.entries())
    return npc
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

    for (const def of tables.initialSkills[tableName]) {
      if (def.key) {
        select([def.key])
      } else if (def.oneOf) {
        select(def.oneOf)
      } else if (def.fromSet) {
        select(tables.skillSets[def.fromSet])
      } else {
        throw new Error('invalid skill def: ' + def)
      }
    }
  }

  private generateSkills(): void {
    const values = this.generateInitialSkillValues()
    this.initialSkills.forEach(skill => {
      this.skills.set(skill, values.get(skill))
    })
  }

  private applyItemSpecial(def: InventoryChoiceDef): InventoryChoiceDef[] {
    if (!def.special) {
      return [def]
    }
    if (def.special === 'bugeiWeapons') {
      let defs = []
      for (const bugei of tables.skillSets['bugei']) {
        if (!this.initialSkills.has(bugei)) {
          continue
        }
        let weapon = tables.bugeiWeapons[bugei]
        if (!weapon) {
          continue
        }
        if (typeof weapon === 'string') {
          weapon = [weapon]
        }
        defs.push({ oneOf: weapon, dedupe: true })
      }
      return defs
    } else {
      throw new Error('Invalid special: ' + def.special)
    }
  }

  private addItems(key: string, quantity: number, maxQuantity?: number): void {
    const currentQuantity = this.inventory.get(key) || 0
    let newQuantity = currentQuantity + quantity
    if (maxQuantity) {
      newQuantity = Math.min(newQuantity, maxQuantity)
    }
    this.inventory.set(key, newQuantity)
  }

  private processRegularItem(def: InventoryChoiceDef): void {
    let choices = def.oneOf || [def.type]
    if (def.dedupe) {
      // XXX: This assumes that all keys have quantity > 0
      const heldItems = new Set(this.inventory.keys())
      choices = choices.filter((choice) => !heldItems.has(choice))
    }

    let quantity = parseQuantity(def.quantity || 1)

    let key
    if (choices.length > 1) {
      const i = Math.floor(Math.random() * choices.length)
      key = Array.from(choices)[i]
    } else if (choices.length === 1) {
      key = choices[0]
    } else {
      return
    }

    this.addItems(key, quantity, def.maxQuantity)
  }

  private generateInventory(tableName: string): void {
    for (const origDef of tables.initialItems[tableName]) {
      for (const subDef of this.applyItemSpecial(origDef)) {
        this.processRegularItem(subDef)
      }
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
}
