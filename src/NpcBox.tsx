import './NpcBox.css'

import React from "react"
import { Npc } from "./npc"

function NpcBox(props: {
  npc: Npc
}) {
  return (
    <div className="npc-box">
      {Object.entries(props.npc.stats).map(([name, value]) => (
        <div>
          <label>{name}</label>:{' '}
          <span>{value}</span>
        </div>
      ))}
    </div>
  )
}

export default NpcBox