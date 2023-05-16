import React from 'react'
import { useParams } from 'react-router-dom'

import Npc, { InventoryItem } from '../Npc'
import './Npc.scss'

interface StatProps {
  name: string
  alt?: boolean
  style?: any
  value?: string | number
  children?: React.ReactNode
}

function Stat(props: StatProps) {
  const { name, value, alt } = props
  const className = alt ? 'GridCell Alt' : 'GridCell'
  return (
    <div className={className} style={props.style}>
      <h4>{name}</h4>
      {props.children ? props.children : <div className='Stat'>{value}</div>}
    </div>
  )
}

interface Weapon extends InventoryItem {
  rawDamage: string
  damage: string
}

type DamageParams = [number, number, number]

function parseDamage(damageSpec: string): DamageParams {
  let [n, r, c] = [0, 0, 0]
  const match = damageSpec.match(/([0-9]+)d([0-9]+)([+-][0-9]+)?/)
  if (match !== null) {
    ;[n, r, c] = match.slice(1).map(Number)
    c = c || 0
  } else {
    c = Number(damageSpec)
  }
  return [n, r, c]
}

function formatDamage([n, r, c]: DamageParams): string {
  let damage = ''
  if (n && r) {
    damage = `${n}d${r}`
    if (c) {
      damage += `+${c}`
    }
  } else {
    damage = String(c)
  }
  return damage
}

function weaponDamage(npc: Npc, weapon: Weapon): DamageParams {
  let [n, r, c] = parseDamage(weapon.damage)
  c = c + Number(weapon.quality?.bonus || 0) + npc.damageBonus
  return [n, r, c]
}

function getWeapons(npc: Npc): Weapon[] {
  const inventory = npc.inventoryList()
  const weapons = []
  for (let item of inventory) {
    if (!item.damage) {
      continue
    }

    const weap: any = { ...item }
    weap.rawDamage = weap.damage
    weap.damage = formatDamage(weaponDamage(npc, weap))
    weapons.push(weap)
  }

  function averageDamage(weapon: Weapon): number {
    const [n, r, c] = weaponDamage(npc, weapon)
    if (!n || !r) {
      return c
    } else {
      return (n * (r + 1)) / 2 + c
    }
  }

  weapons.sort((w1, w2) => averageDamage(w2) - averageDamage(w1))

  return weapons
}

export default function NpcPage() {
  const { id } = useParams()
  const npc: Npc = new Npc()
  Object.assign(npc, JSON.parse(localStorage.getItem(`npc:${id}`)))

  const weapons = getWeapons(npc)
  function weaponDamage(
    weapon: Weapon | undefined,
    style?: any
  ): React.ReactNode {
    if (!weapon) {
      return (
        <>
          <Stat name='Weap raw' alt />
          <Stat name='Dam' value='' style={style} />
        </>
      )
    } else {
      return (
        <>
          <Stat
            name={`Weap raw: ${weapon.name}`}
            value={weapon.rawDamage}
            alt
          />
          <Stat
            name={`Dam: ${weapon.name}`}
            value={weapon.damage}
            style={style}
          />
        </>
      )
    }
  }

  return (
    <div className='NpcSheet'>
      <Stat name='Level' value={npc.level} />
      <Stat name='Budo' value='' alt />
      <Stat name='Kill credit' value='' />
      {/* TODO: Learn how grid template areas work. */}
      <div
        className='GridCell Alt'
        style={{ gridColumnStart: 4, gridColumnEnd: 7 }}
      >
        <h4>Name</h4>
      </div>
      <div className='BigBox Alt'>
        <h4>HP tracker</h4>
        {npc.hitpoints} / {npc.hitpoints}
      </div>

      <Stat name='BAP' value={npc.baseActionPhase} />
      <Stat name='SAP' value={npc.secondaryActionPhase1 || null} alt />
      <Stat name='SAP' value={npc.secondaryActionPhase2 || null} />
      <Stat name='BMA' value={npc.baseMovementAllowance} alt />
      <Stat name='AC' value='' />
      <Stat name='Zanshin' value='' alt />

      {weaponDamage(weapons[0])}
      {weaponDamage(weapons[1])}
      {weaponDamage(weapons[2], { marginBottom: '0.5rem' })}

      <Stat name='Strength' value={npc.strength} />
      <Stat name='Deftness' value={npc.deftness} alt />
      <Stat name='Speed' value={npc.speed} />
      <Stat name='Health' value={npc.health} alt />
      <Stat name='Wit' value={npc.wit} />
      <Stat name='Will' value={npc.will} alt />

      <Stat name='Brawl' value={npc.brawling} alt />
      <Stat name='Climb' value={npc.climbing} />
      <Stat name='Leap' value={npc.leaping} alt />
      <Stat name='Swim' value={npc.swimming} />
      <Stat name='Magic' value={npc.magic} alt />
      <Stat name='Power' value={npc.power} />

      <div className='BigBox'>
        <h4>Notes</h4>
      </div>
    </div>
  )
}
