import './App.scss'

import React, { useState } from 'react'
import NpcBox from './NpcBox'
import { BushidoHuman } from './bushido'
import { NumberInput, SelectInput } from './Input'
import tables from './tables'

export default function App() {
  const [npcIds, setNpcIds_] = useState<string[]>(
    JSON.parse(localStorage.getItem('npcIds')) || []
  )
  const [level, setLevel] = useState(1)
  const [statTable, setStatTable] = useState<string | null>(null)
  const [skillTable, setSkillTable] = useState<string | null>(null)
  const [itemTable1, setItemTable1] = useState<string | null>(null)
  const [itemTable2, setItemTable2] = useState<string | null>(null)

  function setNpcIds(ids: string[]): void {
    setNpcIds_(ids)
    localStorage.setItem('npcIds', JSON.stringify(ids))
  }

  function roll(): void {
    if (!statTable || !skillTable) {
      alert('Must choose stat and skill table')
      return
    }
    let items = [itemTable1, itemTable2].filter(x => x)
    const x = BushidoHuman.generate(level, statTable, skillTable, items)
    const key = `npc:${crypto.randomUUID()}`
    localStorage.setItem(key, JSON.stringify(x.toNpc()))
    setNpcIds([key, ...npcIds])
  }

  function deleteNpc(index: number): void {
    npcIds.splice(index, 1)
    setNpcIds([...npcIds])
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
  const itemTableOptions = keysAsOptions(tables.initialItems)

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
            <SelectInput
              key='itemsel1'
              label='Item table 1'
              value={itemTable1}
              options={itemTableOptions}
              // @ts-ignore
              onChange={setItemTable1}
            />
            <SelectInput
              key='itemsel2'
              label='Item table 2'
              value={itemTable2}
              options={itemTableOptions}
              // @ts-ignore
              onChange={setItemTable2}
            />
          </div>
          <button onClick={roll}>Roll &#127922;</button>
        </div>
        <div className='right-panel'>
          <div className='npc-list'>
            {npcIds.map((npcId, i) => (
              <NpcBox
                key={'npc-' + i}
                onClose={() => deleteNpc(i)}
                npcId={npcId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
