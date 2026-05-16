import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Sword, Trophy, Users, Settings, Plus, Ghost, LogOut, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@utils/cn'
import { supabase } from '@lib/supabase'
import { toast } from 'sonner'
import { useSocket } from '@hooks/useSocket'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  to: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className="relative group flex items-center justify-center py-1">
          {/* Active Indicator (Vertical Line) */}
          <motion.div
            initial={false}
            animate={{
              height: isActive ? 32 : 0,
              opacity: isActive ? 1 : 0,
            }}
            className="absolute left-0 w-[3px] bg-brand rounded-r-sm"
          />
          
          <div
            className={cn(
              "w-11 h-11 flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer overflow-hidden",
              "text-surface-400 hover:text-white hover:bg-white/5",
              isActive && "bg-brand/10 text-brand"
            )}
          >
            <Icon size={20} strokeWidth={2.5} />
          </div>

          {/* Tooltip */}
          <div className="absolute left-16 px-2.5 py-1.5 bg-background-elevated text-white text-[11px] font-bold uppercase tracking-wider rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-premium border border-white/10">
            {label}
          </div>
        </div>
      )}
    </NavLink>
  )
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected, isReconnecting } = useSocket()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Failed to log out')
    }
  }

  return (
    <aside className="w-[68px] bg-background-sidebar border-r border-white/5 flex flex-col items-center py-4 gap-4 flex-shrink-0 z-50">
      <div className="w-11 h-11 flex items-center justify-center bg-brand/10 rounded-sm text-brand mb-2 shadow-accent border border-brand/20">
        <Code2 size={24} strokeWidth={2.5} />
      </div>
      
      <div className="w-8 h-[1px] bg-white/5" />

      <div className="flex flex-col gap-2 w-full">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <SidebarItem icon={Sword} label="Battles" to="/battles" />
        <SidebarItem icon={Trophy} label="Contests" to="/contests" />
        <SidebarItem icon={Users} label="Rankings" to="/rankings" />
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 w-full">
        {/* Connection Status Dot */}
        <div className="relative group">
          <div className="absolute left-16 px-2.5 py-1.5 bg-background-elevated text-white text-[11px] font-bold uppercase tracking-wider rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-premium border border-white/10">
            {isConnected ? 'Network Stable' : isReconnecting ? 'Reconnecting...' : 'Network Offline'}
          </div>
          
          <div className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isConnected ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" : 
            isReconnecting ? "bg-warning animate-pulse" : "bg-error shadow-[0_0_8px_rgba(244,63,94,0.4)]"
          )} />
        </div>

        <div className="w-8 h-[1px] bg-white/5" />

        <SidebarItem icon={Settings} label="Settings" to="/settings" />
        
        <div 
          onClick={handleLogout}
          className="relative group flex items-center justify-center py-1 w-full cursor-pointer"
        >
          <div className="w-11 h-11 flex items-center justify-center rounded-md text-surface-400 hover:text-white hover:bg-rose-500/10 transition-all">
            <LogOut size={20} strokeWidth={2.5} />
          </div>
          <div className="absolute left-16 px-2.5 py-1.5 bg-background-elevated text-white text-[11px] font-bold uppercase tracking-wider rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-premium border border-white/10">
            Logout
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
