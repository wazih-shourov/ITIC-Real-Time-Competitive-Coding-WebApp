import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from '@components/layout/AppShell'
import { AuthGuard, PublicGuard } from '@components/core/AuthGuard'
import { useAuthManager } from '@hooks/useAuthManager'
import { useSocketManager } from '@hooks/useSocketManager'
import { syncServerTime } from '@utils/time'
import Dashboard from '@pages/Dashboard'
import Battles from '@pages/Battles'
import Contests from '@pages/Contests'
import ContestLobby from '@pages/ContestLobby'
import ProblemWorkspace from '@pages/ProblemWorkspace'
import Rankings from '@pages/Rankings'
import Settings from '@pages/Settings'
import Login from '@pages/Login'
import Signup from '@pages/Signup'

const AnimatedRoutes = () => {
  const location = useLocation()
  useAuthManager() // Initialize auth listeners
  useSocketManager() // Initialize socket manager

  React.useEffect(() => {
    syncServerTime()
  }, [])
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<PublicGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="battles" element={<Battles />} />
            <Route path="contests" element={<Contests />} />
            <Route path="contests/lobby/:id" element={<ContestLobby />} />
            <Route path="rankings" element={<Rankings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="problems/:problemSlug" element={<ProblemWorkspace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
