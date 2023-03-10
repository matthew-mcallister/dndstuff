import React from 'react'
import { useParams } from 'react-router-dom'

import Npc from '../Npc'
import './Npc.scss'

function Stat(props: { name: string; value: string | number; alt?: boolean }) {
  const { name, value, alt } = props
  const className = alt ? 'GridCell Alt' : 'GridCell'
  return (
    <div className={className}>
      <h4>{name}</h4>
      <span className='Stat'>{value}</span>
    </div>
  )
}

export default function NpcPage() {
  const { id } = useParams()
  const npc: Npc = new Npc()
  Object.assign(npc, JSON.parse(localStorage.getItem(`npc:${id}`)))
  return (
    <div className='NpcSheet'>
      <div className='BigBox Alt'>
        <h4>HP tracker</h4>
        {npc.hitpoints}
      </div>

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
