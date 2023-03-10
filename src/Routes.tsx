import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import App from './pages/App'
import NpcPage from './pages/Npc'
import React from 'react'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/npcs'>
          <Route path=':id' element={<NpcPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
