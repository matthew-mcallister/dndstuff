import './Input.scss'

import React from 'react'

export function NumberInput(props: {
  label: string
  value: number
  min?: number
  onChange?: (newValue: number) => void | Promise<void>
}) {
  return (
    <div className='input'>
      {/* TODO: Use an actual grid layout */}
      <label style={{ display: 'inline-block', minWidth: '200px' }}>
        {props.label}:
      </label>{' '}
      <input
        type='number'
        value={props.value}
        style={{ marginLeft: '8px' }}
        onChange={e => props.onChange(Number(e.target.value))}
        min={props.min}
      ></input>
    </div>
  )
}

export interface Option<V extends string> {
  label: string
  value: V
}

export function SelectInput<V extends string>(props: {
  label: string
  value: string | null
  options: Option<V>[]
  onChange?: (value: string) => void | Promise<void>
}) {
  return (
    <div className='input'>
      <label style={{ display: 'inline-block', minWidth: '200px' }}>
        {props.label}:
      </label>{' '}
      <select
        style={{ marginLeft: '8px' }}
        onChange={props.onChange ? e => props.onChange(e.target.value) : null}
        value={props.value || ''}
      >
        <option key='option-empty' value=''></option>
        {props.options.map(({ label, value }, i) => (
          <option key={`option-${i}`} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
