import './StatInput.scss'

import { StatRange } from './npc';
import React from 'react';

export default function StatInput(props: {
  range: StatRange
  onChange?: (newRange: StatRange) => void | Promise<void>
}) {
  const range = props.range

  function onMinChange(value: string): void {
    range.min = Number(value);
    props.onChange && props.onChange(range)
  }

  function onMaxChange(value: string): void {
    range.max = Number(value);
    props.onChange && props.onChange(range)
  }

  return <div className="stat-input">
    {/* TODO: Use an actual grid layout */}
    <label
      style={{ display: 'inline-block', minWidth: '200px' }}
    >{range.name}:</label>{' '}
    <input
      type='number'
      value={range.min}
      style={{ marginLeft: '8px' }}
      onChange={(e) => onMinChange(e.target.value)}
    ></input>
    <input
      type='number'
      value={range.max}
      style={{ marginLeft: '8px' }}
      onChange={(e) => onMaxChange(e.target.value)}
    ></input>
  </div>
}