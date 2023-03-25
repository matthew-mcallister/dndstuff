import React from 'react'
import { useParams } from 'react-router-dom'

import Npc from '../Npc'
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

type Weapon = {
  key: string
  name: string
  damage: string
}

function getWeapons(npc: Npc): Weapon[] {
  const inventory = npc.inventoryList()
  const weapons = []
  for (const item of inventory) {
    if (item.damage) {
      weapons.push(item)
    }
  }
  return weapons
}

export default function NpcPage() {
  const { id } = useParams()
  const npc: Npc = new Npc()
  Object.assign(npc, JSON.parse(localStorage.getItem(`npc:${id}`)))

  const weapons = getWeapons(npc)
  function weaponRaw(weapon: Weapon | undefined): React.ReactNode {
    if (!weapon) {
      return <Stat name='Weap raw' alt />
    } else {
      return (
        <Stat name={`Weap raw (${weapon.name})`} value={weapon.damage} alt />
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

      {weaponRaw(weapons[0])}
      <Stat name='Dam' value='' />
      {weaponRaw(weapons[1])}
      <Stat name='Dam' value='' />
      {weaponRaw(weapons[2])}
      <Stat name='Dam' value='' style={{ marginBottom: '0.5rem' }} />

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
