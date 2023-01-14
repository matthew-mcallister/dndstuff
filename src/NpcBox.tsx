import './NpcBox.scss'

import React from "react"
import { Npc } from "./npc"

function NpcBox(props: {
  npc: Npc
  onClose?: () => void | Promise<void>
}) {
  return (
    <div className="npc-box">
      {Object.entries(props.npc.stats).map(([name, value]) => (
        <div>
          <label>{name}</label>:{' '}
          <span>{value}</span>
        </div>
      ))}
      <div className="close-button" onClick={props.onClose}>✕</div>
    </div>
  )
}

export default NpcBox