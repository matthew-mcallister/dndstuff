// TODO: Make all tables user-editable

import Handlebars from 'handlebars'
import { d10, D20, d20, d3, d6 } from './common'

export const PROFESSIONS = [
  'Bushi',
  'Budoka',
  'Ninja',
  'Shugenja',
  'Gakusho',
  'Yakuza',
] as const
export type Profession = typeof PROFESSIONS[number]
export type Archetype = 'Adventurer'
export type Attitude = 'Unfavorable' | 'Neutral' | 'Favorable'

export const BUGEI = [
  'atemi_waza',
  'bajutsu',
  'bojutsu',
  'chikujo_jutsu',
  'hayagakejutsu',
  'hojojutsu',
  'iaijutsu',
  'jittejutsu',
  'jojutsu',
  'jujutsu',
  'kamajutsu',
  'karumijutsu',
  'kenjutsu',
  'kiserujutsu',
  'kusari_jutsu',
  'kyujutsu',
  'masakarijutsu',
  'naginatajutsu',
  'ni_to_kenjutsu',
  'nunchaku_te',
  'onojutsu',
  'sai_te',
  'senjo_jutsu',
  'shinobi_jutsu',
  'shurikenjutsu',
  'sodegaramijutsu',
  'sojutsu',
  'suieijutsu',
  'sumai',
  'tantojutsu',
  'tessenjutsu',
  'tonfa_te',
  'yadomejutsu',
  'yari_nage_jutsu',
] as const
export type Bugei = typeof BUGEI[number]
export type Skill = Bugei
// @ts-ignore
export const SKILLS: Skill[] = BUGEI

export type Inventory = Map<string, number>

function skillToBcs(skill: number): number {
  if (skill < 0 || skill > 100) console.error('Invalid skill level', skill)
  if (skill == 0) return 0
  if (skill > 95) return 19
  // @ts-ignore
  return Math.floor((skill - 1) / 5) + 1
}
Handlebars.registerHelper('skillToBcs', skillToBcs)

export class BushidoHuman {
  level: number
  profession?: Profession
  archetype: Archetype = 'Adventurer'

  attitudeRoll: D20 = 1
  attitude: Attitude = 'Neutral'
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

  initialSkills: Set<Skill> = new Set()
  skills: Map<Skill, number> = new Map()

  inventory: Inventory = new Map()

  public constructor(level: number, archetype?: Archetype, profession?: Profession) {
    this.level = level
    this.archetype = archetype
    this.profession = profession
  }

  private generateAttitude(): void {
    const table: { [key: string]: [Attitude, number] } = {
      1: ['Unfavorable', -10],
      2: ['Unfavorable', -5],
      3: ['Unfavorable', 0],
      4: ['Unfavorable', 0],
      5: ['Neutral', -5],
      6: ['Neutral', -5],
      7: ['Neutral', -5],
      8: ['Neutral', 0],
      9: ['Neutral', 0],
      10: ['Neutral', 0],
      11: ['Neutral', 0],
      12: ['Neutral', 0],
      13: ['Neutral', 0],
      14: ['Neutral', 5],
      15: ['Neutral', 5],
      16: ['Neutral', 5],
      17: ['Favorable', 0],
      18: ['Favorable', 0],
      19: ['Favorable', 5],
      20: ['Favorable', 10],
    }
    this.attitudeRoll = d20()
    const [attitude, bonus] = table[this.attitudeRoll]
    this.attitude = attitude
    this.reactionBonus = bonus
  }

  public generateAttributes(): void {
    switch (this.profession) {
      case 'Bushi':
        this.strength = 20
        this.deftness = 20
        this.speed = 15
        this.health = 25
        this.wit = 5
        this.will = 10
        this.hitpoints = this.health + d10(this.level)
        this.brawling = 6
        this.climbing = 10
        this.leaping = 8
        this.swimming = 7 + this.level
        break
      case 'Budoka':
        this.strength = 15
        this.deftness = 20
        this.speed = 20
        this.health = 20
        this.wit = 10
        this.will = 10
        this.hitpoints = this.health + d10(this.level)
        this.brawling = 5
        this.climbing = 10
        this.leaping = 10
        this.swimming = 6 + this.level
        break
      case 'Ninja':
        this.strength = 15
        this.deftness = 20
        this.speed = 20
        this.health = 20
        this.wit = 10
        this.will = 10
        this.hitpoints = this.health + d6(this.level)
        this.brawling = 5
        this.climbing = 10 + this.level
        this.leaping = 10 + this.level
        this.swimming = 6 + this.level
        break
      case 'Gakusho':
      case 'Shugenja':
        this.strength = 5
        this.deftness = 10
        this.speed = 10
        this.health = 10
        this.wit = 20
        this.will = 25
        this.hitpoints = this.health + d3(this.level)
        this.brawling = 4
        this.climbing = 5
        this.leaping = 5
        this.swimming = 3 + this.level
        this.magic = 9 + this.level
        this.power = 25 + d10(this.level)
        break
      case 'Yakuza':
        this.strength = 10
        this.deftness = 20
        this.speed = 15
        this.health = 15
        this.wit = 20
        this.will = 10
        this.hitpoints = 15 + d6(this.level)
        this.brawling = 4
        this.climbing = 10
        this.leaping = 8
        this.swimming = 5 + this.level
        break
      default:
        this.strength = 10
        this.deftness = 10
        this.speed = 10
        this.health = 10
        this.wit = 10
        this.will = 10
        this.hitpoints = this.health
        this.brawling = 3
        this.climbing = 5
        this.leaping = 5
        this.swimming = 3
    }
  }

  private generateInitialSkillValues(): Map<Skill, number> {
    const skills = {
      atemi_waza: this.strength + this.deftness + this.will,
      bajutsu: 2 * this.will,
      bojutsu: this.strength + this.deftness + this.will,
      chikujo_jutsu: this.wit + this.will,
      hayagakejutsu: this.health + this.will,
      hojojutsu: this.speed + this.deftness,
      iaijutsu: this.deftness + this.speed + this.will,
      jittejutsu: this.deftness + this.speed + this.will,
      jojutsu: this.deftness + this.will,
      jujutsu: this.deftness + this.speed + this.will,
      kamajutsu: this.strength + this.deftness + this.will,
      karumijutsu: this.deftness + this.will,
      kenjutsu: this.strength + this.deftness + this.will,
      kiserujutsu: this.strength + this.deftness + this.will,
      kusari_jutsu: this.strength + this.will + this.deftness,
      kyujutsu: this.strength + this.deftness + this.will,
      masakarijutsu: this.strength + this.deftness + this.will,
      naginatajutsu: this.strength + this.deftness + this.will,
      ni_to_kenjutsu: this.strength + this.deftness + this.will,
      nunchaku_te: this.strength + this.deftness + this.will,
      onojutsu: this.strength + this.deftness + this.will,
      sai_te: this.strength + this.deftness + this.will,
      senjo_jutsu: this.wit + this.will,
      shinobi_jutsu: this.deftness + this.speed + this.wit,
      shurikenjutsu: this.deftness + this.will,
      sodegaramijutsu: this.strength + this.deftness + this.will,
      sojutsu: this.strength + this.deftness + this.will,
      suieijutsu: this.strength + this.health + this.will,
      sumai: this.strength + this.deftness + this.will,
      tantojutsu: this.strength + this.deftness + this.will,
      tessenjutsu: this.deftness + this.speed + this.will,
      tonfa_te: this.deftness + this.speed + this.will,
      yadomejutsu: this.speed + this.will,
      yari_nage_jutsu: this.deftness + this.will,
    }
    // @ts-ignore
    return new Map(Object.entries(skills))
  }

  private generateInitialSkills(): void {
    let initialSkills = this.initialSkills
    function select(skill: Skill): void {
      initialSkills.add(skill)
    }
    function selectRandom(choices: readonly Skill[]): void {
      choices = choices.filter(choice => !initialSkills.has(choice))
      if (!choices.length) return
      const i = Math.floor(Math.random() * choices.length)
      const skill = Array.from(choices)[i]
      select(skill)
    }

    switch (this.profession) {
    case 'Bushi':
      select('kenjutsu')
      select('kyujutsu')
      selectRandom(BUGEI)
      selectRandom(BUGEI)
      break
    case 'Budoka':
      select('atemi_waza')
      select('jujutsu')
      selectRandom(BUGEI)
      break
    case 'Gakusho':
      selectRandom(['bojutsu', 'jujutsu'])
      break
    case 'Shugenja':
      selectRandom(BUGEI)
      break
    case 'Ninja':
      select('kenjutsu')
      selectRandom(['atemi_waza', 'jujutsu'])
      selectRandom(BUGEI)
      selectRandom(BUGEI)
      break
    case 'Yakuza':
      select('sumai')
      selectRandom(BUGEI)
      break
    default:
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

  private _generate(): void {
    this.generateAttitude()
    this.generateAttributes()
    this.generateInitialSkills()
    this.generateSkills()
    this.generateInventory()
  }

  public static generate(
    level: number,
    archetype?: Archetype,
    profession?: Profession,
  ): BushidoHuman {
    const x = new BushidoHuman(level, archetype, profession)
    x._generate()
    return x
  }

  private skillsAsObject(): { [key: string]: number} {
    return Object.fromEntries(this.skills)
  }

  public render(): string {
    return renderHuman({
      ...this,
      skills: this.skillsAsObject(),
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

{{#with skills}}
{{#if atemi_waza}}
Atemi-waza: {{atemi_waza}} (BCS: {{skillToBcs atemi_waza}})
{{/if}}
{{#if bajutsu}}
Bajutsu: {{bajutsu}} (BCS: {{skillToBcs bajutsu}})
{{/if}}
{{#if bojutsu}}
Bojutsu: {{bojutsu}} (BCS: {{skillToBcs bojutsu}})
{{/if}}
{{#if chikujo_jutsu}}
Chikujo-jutsu: {{chikujo_jutsu}} (BCS: {{skillToBcs chikujo_jutsu}})
{{/if}}
{{#if hayagakejutsu}}
Hayagakejutsu: {{hayagakejutsu}} (BCS: {{skillToBcs hayagakejutsu}})
{{/if}}
{{#if hojojutsu}}
Hojojutsu: {{hojojutsu}} (BCS: {{skillToBcs hojojutsu}})
{{/if}}
{{#if iaijutsu}}
Iaijutsu: {{iaijutsu}} (BCS: {{skillToBcs iaijutsu}})
{{/if}}
{{#if jittejutsu}}
Jittejutsu: {{jittejutsu}} (BCS: {{skillToBcs jittejutsu}})
{{/if}}
{{#if jojutsu}}
Jojutsu: {{jojutsu}} (BCS: {{skillToBcs jojutsu}})
{{/if}}
{{#if jujutsu}}
Jujutsu: {{jujutsu}} (BCS: {{skillToBcs jujutsu}})
{{/if}}
{{#if kamajutsu}}
Kamajutsu: {{kamajutsu}} (BCS: {{skillToBcs kamajutsu}})
{{/if}}
{{#if karumijutsu}}
Karumijutsu: {{karumijutsu}} (BCS: {{skillToBcs karumijutsu}})
{{/if}}
{{#if kenjutsu}}
Kenjutsu: {{kenjutsu}} (BCS: {{skillToBcs kenjutsu}})
{{/if}}
{{#if kiserujutsu}}
Kiserujutsu: {{kiserujutsu}} (BCS: {{skillToBcs kiserujutsu}})
{{/if}}
{{#if kusari_jutsu}}
Kusari-jutsu: {{kusari_jutsu}} (BCS: {{skillToBcs kusari_jutsu}})
{{/if}}
{{#if kyujutsu}}
Kyujutsu: {{kyujutsu}} (BCS: {{skillToBcs kyujutsu}})
{{/if}}
{{#if masakarijutsu}}
Masakarijutsu: {{masakarijutsu}} (BCS: {{skillToBcs masakarijutsu}})
{{/if}}
{{#if naginatajutsu}}
Naginatajutsu: {{naginatajutsu}} (BCS: {{skillToBcs naginatajutsu}})
{{/if}}
{{#if ni_to_kenjutsu}}
Ni-to-kenjutsu: {{ni_to_kenjutsu}} (BCS: {{skillToBcs ni_to_kenjutsu}})
{{/if}}
{{#if nunchaku_te}}
Nunchaku-te: {{nunchaku_te}} (BCS: {{skillToBcs nunchaku_te}})
{{/if}}
{{#if onojutsu}}
Onojutsu: {{onojutsu}} (BCS: {{skillToBcs onojutsu}})
{{/if}}
{{#if sai_te}}
Sai-te: {{sai_te}} (BCS: {{skillToBcs sai_te}})
{{/if}}
{{#if senjo_jutsu}}
Senjo-jutsu: {{senjo_jutsu}} (BCS: {{skillToBcs senjo_jutsu}})
{{/if}}
{{#if shinobi_jutsu}}
Shinobi-jutsu: {{shinobi_jutsu}} (BCS: {{skillToBcs shinobi_jutsu}})
{{/if}}
{{#if shurikenjutsu}}
Shurikenjutsu: {{shurikenjutsu}} (BCS: {{skillToBcs shurikenjutsu}})
{{/if}}
{{#if sodegaramijutsu}}
Sodegaramijutsu: {{sodegaramijutsu}} (BCS: {{skillToBcs sodegaramijutsu}})
{{/if}}
{{#if sojutsu}}
Sojutsu: {{sojutsu}} (BCS: {{skillToBcs sojutsu}})
{{/if}}
{{#if suieijutsu}}
Suieijutsu: {{suieijutsu}} (BCS: {{skillToBcs suieijutsu}})
{{/if}}
{{#if sumai}}
Sumai: {{sumai}} (BCS: {{skillToBcs sumai}})
{{/if}}
{{#if tantojutsu}}
Tantojutsu: {{tantojutsu}} (BCS: {{skillToBcs tantojutsu}})
{{/if}}
{{#if tessenjutsu}}
Tessenjutsu: {{tessenjutsu}} (BCS: {{skillToBcs tessenjutsu}})
{{/if}}
{{#if tonfa_te}}
Tonfa-te: {{tonfa_te}} (BCS: {{skillToBcs tonfa_te}})
{{/if}}
{{#if yadomejutsu}}
Yari-nage-jutsu: {{yadomejutsu}} (BCS: {{skillToBcs yadomejutsu}})
{{/if}}
{{#if yari_nage_jutsu}}
Yari-nage-jutsu: {{yari_nage_jutsu}} (BCS: {{skillToBcs yari_nage_jutsu}})
{{/if}}
{{/with}}
`)