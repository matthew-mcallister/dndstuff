import './App.scss'

import React, { useState } from 'react'
import { Npc, StatRange } from './npc'
import NpcBox from './NpcBox'
import StatInput from './StatInput';

function App() {
  const [statRanges, setStatRanges] = useState<StatRange[]>([
    new StatRange('Strength', 8, 12),
    new StatRange('Deftness', 8, 12),
    new StatRange('Speed', 8, 12),
    new StatRange('Health', 8, 12),
    new StatRange('Wit', 8, 12),
    new StatRange('Will', 8, 12),
  ]);
  const [npcs, setNpcs] = useState<Npc[]>([])

  function roll(): void {
    const npc = Npc.generate(statRanges)
    setNpcs([npc, ...npcs])
  }

  function deleteNpc(index: number): void {
    npcs.splice(index, 1)
    setNpcs([...npcs])
  }

  function updateStatRange(index: number, newRange: StatRange): void {
    statRanges.splice(index, 1, newRange)
    setStatRanges([...statRanges])
  }

  return (
    <div className="App">
      <div className="layout">
        <div className="left-panel">
          <div style={{ marginBottom: '16px' }}>
            {statRanges.map((range, i) => <StatInput
              key={'stat-input-' + i}
              range={range}
              onChange={(newRange) => updateStatRange(i, newRange)}
            />)}
          </div>
          <button onClick={roll}>Roll &#127922;</button>
        </div>
        <div className="right-panel">
          <div className="npc-list">
            {npcs.map((npc, i) => <NpcBox
              key={'npc-' + i}
              npc={npc}
              onClose={() => deleteNpc(i)}
            />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
