import './NpcBox.scss'

import React from 'react'
import Npc from './Npc'

export default function NpcBox(props: {
  npcId: string
  onClose?: () => void | Promise<void>
  onExpand?: () => void | Promise<void>
}) {
  const npc: Npc = new Npc()
  Object.assign(npc, JSON.parse(localStorage.getItem(props.npcId)))
  return (
    <div className='npc-box'>
      {npc.render()}
      <div className='box-buttons'>
        <div className='button-icon' onClick={props.onClose}>
          ✕
        </div>
        <div className='button-icon' onClick={props.onExpand}>
          &#8599;
        </div>
      </div>
    </div>
  )
}
