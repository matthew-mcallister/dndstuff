import './App.scss'

import React, { useState } from 'react'
import {Npc, StatRange} from './npc'
import NpcBox from './NpcBox'

function App() {
  const [npcs, setNpcs] = useState<Npc[]>([])

  function roll(): void {
    const npc = Npc.generate({
      Strength: new StatRange(8, 12),
      Deftness: new StatRange(8, 12),
      Speed: new StatRange(8, 12),
      Health: new StatRange(8, 12),
      Wit: new StatRange(8, 12),
      Will: new StatRange(8, 12),
    })
    setNpcs([npc, ...npcs])
  }

  function deleteNpc(index: number): void {
    npcs.splice(index, 1);
    setNpcs([...npcs]);
  }

  return (
    <div className="App">
      <div className="layout">
        <div className="left-panel">
          <button onClick={roll}>Roll &#127922;</button>
        </div>
        <div className="right-panel">
          <div className="npc-list">
            {npcs.map((npc, i) => <NpcBox npc={npc} onClose={() => deleteNpc(i)}/>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
