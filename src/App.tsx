import './App.scss'

import React, { useState } from 'react'
import NpcBox from './NpcBox'
import { BushidoHuman, Profession } from './bushido'
import { NumberInput, SelectInput } from './Input'

export default function App() {
  const [npcs, setNpcs] = useState<string[]>([])
  const [level, setLevel] = useState(1)
  const [profession, setProfession] = useState<Profession | null>(null)
  const archetype = 'Adventurer'

  function roll(): void {
    const x = BushidoHuman.generate(level, archetype, profession)
    const npc = x.render()
    setNpcs([npc, ...npcs])
  }

  function deleteNpc(index: number): void {
    npcs.splice(index, 1)
    setNpcs([...npcs])
  }

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
              label='Profession'
              value={profession}
              options={[
                { label: 'Bushi', value: 'Bushi' },
                { label: 'Budoka', value: 'Budoka' },
                { label: 'Ninja', value: 'Ninja' },
                { label: 'Shugenja', value: 'Shugenja' },
                { label: 'Gakusho', value: 'Gakusho' },
                { label: 'Yakuza', value: 'Yakuza' },
              ]}
              // @ts-ignore
              onChange={setProfession}
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
