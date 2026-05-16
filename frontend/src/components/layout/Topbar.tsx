import React from 'react'
import { Menu, Bell, Search, HelpCircle, Users, Activity } from 'lucide-react'
import { useUIStore } from '@store/useUIStore'
import { useSocketStore } from '@store/useSocketStore'
import { cn } from '@utils/cn'

interface TopbarProps {
  title: string
  showSecondarySidebarToggle?: boolean
}

const Topbar: React.FC<TopbarProps> = ({ title, showSecondarySidebarToggle = true }) => {
  const { toggleSecondarySidebar, toggleRightPanel } = useUIStore()
  const { isConnected, isReconnecting } = useSocketStore()

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-background-primary shrink-0 z-40">
      <div className="flex items-center gap-6">
        {showSecondarySidebarToggle && (
          <button 
            onClick={toggleSecondarySidebar}
            className="p-1.5 hover:bg-white/5 rounded-sm lg:hidden transition-colors"
          >
            <Menu size={20} className="text-surface-400" />
          </button>
        )}
        
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">{title}</h2>
          
          <div className="h-4 w-px bg-white/10" />

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-white/[0.02] border border-white/5">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-500",
              isConnected ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
              isReconnecting ? "bg-warning animate-pulse" : "bg-error shadow-[0_0_8px_rgba(244,63,94,0.4)]"
            )} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              isConnected ? "text-success" : isReconnecting ? "text-warning" : "text-error"
            )}>
              {isConnected ? 'Syncing' : isReconnecting ? 'Reconnecting' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/5 rounded-sm px-3 py-1.5 gap-2 group focus-within:border-brand/30 focus-within:bg-white/[0.05] transition-all">
          <Search size={14} className="text-surface-500 group-focus-within:text-brand transition-colors" />
          <input 
            type="text" 
            placeholder="Command Palette (Ctrl + K)" 
            className="bg-transparent border-none outline-none text-xs text-white w-48 placeholder:text-surface-600 focus:placeholder:text-surface-500 transition-all font-medium"
          />
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[9px] font-bold text-surface-500">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-1">
          <button className="p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-sm transition-all">
            <Bell size={18} strokeWidth={2.5} />
          </button>
          <button 
            onClick={toggleRightPanel}
            className="p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-sm transition-all"
          >
            <Users size={18} strokeWidth={2.5} />
          </button>
          <button className="p-2 text-surface-400 hover:text-white hover:bg-white/5 rounded-sm transition-all">
            <HelpCircle size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar
