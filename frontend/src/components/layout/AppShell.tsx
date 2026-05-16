import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import SecondarySidebar from './SecondarySidebar'
import ActivityPanel from './ActivityPanel'
import { useUIStore } from '@store/useUIStore'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'

const AppShell: React.FC = () => {
  const { 
    rightPanelOpen, 
    secondarySidebarOpen,
    toggleSecondarySidebar,
    toggleRightPanel
  } = useUIStore()

  // Register global shortcuts for a native feel
  useKeyboardShortcuts([
    { key: 'b', ctrlKey: true, handler: toggleSecondarySidebar }, // Toggle secondary sidebar
    { key: 'u', ctrlKey: true, handler: toggleRightPanel },      // Toggle activity panel
  ])

  return (
    <div className="flex h-screen w-full bg-background-primary overflow-hidden text-gray-100">
      {/* Global Navigation Sidebar (Discord-style narrow leftmost bar) */}
      <Sidebar />

      <div className="flex flex-1 overflow-hidden">
        {/* Contextual Sidebar (Discord-style channel/room list) */}
        <AnimatePresence initial={false}>
          {secondarySidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <SecondarySidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-background-primary relative">
          <Outlet />
        </main>

        {/* Right Activity Panel */}
        <AnimatePresence initial={false}>
          {rightPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <ActivityPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AppShell
