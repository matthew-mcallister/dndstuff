import { D20, d20, d } from './common'
import tables, { DieTable, InventoryChoiceDef } from './tables'
import Npc from './Npc'

export type Inventory = Map<string, number>

/**
 * Rolls a die any number of times and returns the sum of rolls.
 *
 * The die format is `XdY[+-]C`. C defaults to 0 if omitted, while X
 * defaults to 1. If the die is a plain number Y, it is interpreted as
 * `1dY`.
 *
 * If count is > 1, the die will be rolled as many times as specified,
 * including if X > 1 to begin with. For example, if you roll a
 * 2d6+1 twice, it is the same as rolling 4d6+2 once.
 */
function rollDie(dieSpec: string | number, count: number = 1): number {
  let die = typeof dieSpec === 'number' ? '1d' + dieSpec : dieSpec
  if (die[0] === 'd') {
    die = '1' + die
  }

  let match = die.match(/([0-9]+)d([0-9])+([+-][0-9]+)?/)
  if (match === null) {
    throw new Error('Invalid die: ' + dieSpec)
  }

  let [n, r, c] = match.slice(1).map(Number)
  c = c || 0
  let res = d(r, count * n) + count * c
  console.log(dieSpec, count, n, r, c, res)
  return res
}

function rollDice(dieTable: DieTable, level: number): number {
  if (Array.isArray(dieTable)) {
    let v = 0
    for (let i = 0; i < level; i++) {
      let die = dieTable[Math.min(i, dieTable.length - 1)]
      v += rollDie(die)
    }
    return v
  } else {
    // table is string or number
    return rollDie(dieTable, level)
  }
}

function calculateStat(base: number, dieTable: DieTable, level: number) {
  return Math.min(base + rollDice(dieTable, level), 40)
}

function parseQuantity(qty: number | string): number {
  if (typeof qty === 'string') {
    const [n, m] = qty.split('d')
    return d(Number(m), Number(n))
  } else {
    return qty
  }
}

// TODO: Inherit from Npc class
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

  // I don't think there's any way in the rulebook randomly generate an
  // NPC with ki > 1
  ki: number = 1

  maxNumberActions: number = 0
  baseActionPhase: number = 0
  secondaryActionPhase1: number = 0
  secondaryActionPhase2: number = 0
  baseMovementAllowance: number = 0

  // TODO: Rename with underscores to avoid Npc field name conflict
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

    this.strength = calculateStat(table.strength, table.strengthDie || 0, this.level)
    this.deftness = calculateStat(table.deftness, table.deftnessDie || 0, this.level)
    this.speed = calculateStat(table.speed, table.speedDie || 0, this.level)
    this.health = calculateStat(table.health, table.healthDie || 0, this.level)
    this.wit = calculateStat(table.wit, table.witDie || 0, this.level)
    this.will = calculateStat(table.will, table.willDie || 0, this.level)

    this.hitpoints = table.health + rollDice(table.hitpointDie || 0, this.level)
    this.brawling = table.brawling + rollDice(table.brawlingDie || 0, this.level)
    this.climbing = table.climbing + rollDice(table.climbingDie || 0, this.level)
    this.leaping = table.leaping + rollDice(table.leapingDie || 0, this.level)
    this.swimming = table.swimming + rollDice(table.swimmingDie || 0, this.level)
    this.magic = (table.magic || 0) + rollDice(table.magicDie || 0, this.level)
    this.power = (table.power || 0) + rollDice(table.powerDie || 0, this.level)

    this.maxNumberActions = Math.floor(this.speed / 10)
    this.baseActionPhase = Math.floor(this.deftness / 2)
    if (this.maxNumberActions > 1) {
      this.secondaryActionPhase1 = Math.floor(this.baseActionPhase / 2)
    }
    if (this.maxNumberActions > 2) {
      this.secondaryActionPhase2 = Math.floor(this.baseActionPhase / 3)
    }
    this.baseMovementAllowance = Math.floor(this.speed / 3)
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
