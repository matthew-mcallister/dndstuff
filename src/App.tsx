import './App.scss'

import React, { useState } from 'react'
import NpcBox from './NpcBox'
import { BushidoHuman } from './bushido'
import { NumberInput, SelectInput } from './Input'
import tables from './tables'

export default function App() {
  const [npcs, setNpcs] = useState<string[]>([])
  const [level, setLevel] = useState(1)
  const [statTable, setStatTable] = useState<string | null>(null)
  const [skillTable, setSkillTable] = useState<string | null>(null)

  function roll(): void {
    if (!statTable || !skillTable) {
      alert('Must choose stat and skill table')
      return
    }
    const x = BushidoHuman.generate(level, statTable, skillTable)
    const npc = x.render()
    setNpcs([npc, ...npcs])
  }

  function deleteNpc(index: number): void {
    npcs.splice(index, 1)
    setNpcs([...npcs])
  }

  type Option<T> = {
    label: string
    value: T
  }
  function keysAsOptions(object: { [key: string]: any }): Option<string>[] {
    return Object.keys(object).map(name => ({
      label: name,
      value: name,
    }))
  }
  const statTableOptions = keysAsOptions(tables.stats)
  const skillTableOptions = keysAsOptions(tables.initialSkills)

  return (
    <div className='App'>
      <div className='layout'>
        <div className='left-panel'>
          <div style={{ marginBottom: '16px' }}>
            <NumberInput
              label='Level'
              value={level}
              min={1}
              onChange={setLevel}
            />
            <SelectInput
              key='statsel'
              label='Stat table'
              value={statTable}
              options={statTableOptions}
              // @ts-ignore
              onChange={setStatTable}
            />
            <SelectInput
              key='skillsel'
              label='Skill table'
              value={skillTable}
              options={skillTableOptions}
              // @ts-ignore
              onChange={setSkillTable}
            />
          </div>
          <button onClick={roll}>Roll &#127922;</button>
        </div>
        <div className='right-panel'>
          <div className='npc-list'>
            {npcs.map((npc, i) => (
              <NpcBox key={'npc-' + i} onClose={() => deleteNpc(i)}>
                {npc}
              </NpcBox>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
