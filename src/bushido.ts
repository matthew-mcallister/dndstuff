// TODO: Make all tables user-editable

import Handlebars from 'handlebars'
import { d10, D20, d20, d3, d6 } from './common'

export type Profession = 'Bushi'
  | 'Budoka'
  | 'Ninja'
  | 'Shugenja'
  | 'Gakusho'
  | 'Yakuza'
export type Attitude = 'Unfavorable' | 'Neutral' | 'Favorable'

export class Bugei {
  atemi_waza: number = 0
  bajutsu: number = 0
  bojutsu: number = 0
  chikujo_jutsu: number = 0
  hayagakejutsu: number = 0
  hojojutsu: number = 0
  iaijutsu: number = 0
  jittejutsu: number = 0
  jojutsu: number = 0
  jujutsu: number = 0
  karumijutsu: number = 0
  kenjutsu: number = 0
  kiserujutsu: number = 0
  kusari_jutsu: number = 0
  kyujutsu: number = 0
  masakarijutsu: number = 0
  naginatajutsu: number = 0
  ni_to_kenjutsu: number = 0
  nunchaku_te: number = 0
  onojutsu: number = 0
  sai_te: number = 0
  senjo_jutsu: number = 0
  shinobi_jutsu: number = 0
  shurikenjutsu: number = 0
  sodegaramijutsu: number = 0
  sojutsu: number = 0
  suieijutsu: number = 0
  sumai: number = 0
  tantojutsu: number = 0
  tessenjutsu: number = 0
  tonfa_te: number = 0
  two_weapon_bugei: number = 0
  yadomejutsu: number = 0
  yari_nage_jutsu: number = 0
}

export class BushidoHuman {
  level: number
  profession?: Profession

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

  bugei: Bugei = new Bugei()

  public constructor(level: number, profession?: Profession) {
    this.level = level
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

  private _generate(): void {
    this.generateAttitude()
    this.generateAttributes()
  }

  public static generate(level: number, profession?: Profession): BushidoHuman {
    const x = new BushidoHuman(level, profession);
    x._generate();
    return x;
  }

  public render(): string {
    return renderHuman(this)
  }
}

const renderHuman = Handlebars.compile(`\
Level: {{level}}
{{#if profession}}
Profession: {{profession}}
{{/if}}

Attitude: {{attitude}} (roll {{attitudeRoll}})
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
`)