import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Routes from './Routes'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
)
