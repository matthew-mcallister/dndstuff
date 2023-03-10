import './NpcBox.scss'

import React from 'react'
import Npc from './Npc'

export default function NpcBox(props: {
  npcId: string
  onClose?: () => void | Promise<void>
}) {
  const npc: Npc = new Npc()
  Object.assign(npc, JSON.parse(localStorage.getItem(props.npcId)))
  return (
    <div className='npc-box'>
      {npc.render()}
      <div className='close-button' onClick={props.onClose}>
        ✕
      </div>
    </div>
  )
}
