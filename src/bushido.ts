// TODO: Give a die to everything? Could theoretically replace bonus
// stats with a D1.

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
        select(tables.skillSets[x])
      } else {
        select(x)
      }
    }
  }

  private generateSkills(): void {
    const values = this.generateInitialSkillValues()
    this.initialSkills.forEach(skill => {
      this.skills.set(skill, values.get(skill))
    })
  }

  private generateInventory(): void {
  }

  private _generate(stats: string, initialSkills: string): void {
    this.generateAttitude()
    this.generateAttributes(stats)
    this.generateInitialSkills(initialSkills)
    this.generateSkills()
    this.generateInventory()
  }

  public static generate(
    level: number,
    stats: string,
    initialSkills: string,
  ): BushidoHuman {
    const x = new BushidoHuman(level)
    x._generate(stats, initialSkills)
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

  public render(): string {
    return renderHuman({
      ...this,
      skills: this.skillList(),
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
`)