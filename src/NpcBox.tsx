import './NpcBox.scss'

import React from 'react'

export default function NpcBox(props: {
  children?: React.ReactNode
  onClose?: () => void | Promise<void>
}) {
  return (
    <div className='npc-box'>
      {props.children}
      <div className='close-button' onClick={props.onClose}>
        ✕
      </div>
    </div>
  )
}
