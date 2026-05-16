import React from 'react'
import { Hash, Volume2, ChevronDown, UserPlus, Mic, LogOut, Plus } from 'lucide-react'
import { cn } from '@utils/cn'
import { useAuthStore } from '@store/useAuthStore'
import { supabase } from '@lib/supabase'
import UserAvatar from '@components/core/UserAvatar'

const ChannelItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-2 px-3 py-1.5 rounded-sm group cursor-pointer transition-all duration-150 mx-1",
    active ? "bg-brand/10 text-brand font-bold" : "text-surface-400 hover:bg-white/5 hover:text-white"
  )}>
    <Icon size={16} strokeWidth={2.5} className={active ? "text-brand" : "text-surface-500 group-hover:text-surface-300"} />
    <span className="text-sm tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1 h-1 rounded-full bg-brand" />}
  </div>
)

const SecondarySidebar: React.FC = () => {
  const { profile, user } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <aside className="w-full h-full bg-background-secondary flex flex-col flex-shrink-0 border-r border-white/5">
      {/* Sidebar Header */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <h1 className="text-sm font-black text-white uppercase tracking-[0.15em] truncate">Arena Lobby</h1>
        <div className="p-1.5 hover:bg-white/5 rounded-sm cursor-pointer transition-colors text-surface-500 hover:text-white">
          <ChevronDown size={16} />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        <section>
          <div className="flex items-center justify-between px-3 py-1 text-surface-500 uppercase text-[10px] font-black tracking-[0.2em] group cursor-pointer hover:text-white transition-colors">
            <div className="flex items-center gap-1.5">
              <ChevronDown size={12} strokeWidth={3} />
              <span>Channels</span>
            </div>
            <Plus size={14} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-2 space-y-0.5">
            <ChannelItem icon={Hash} label="general" active />
            <ChannelItem icon={Hash} label="competitive-chat" />
            <ChannelItem icon={Hash} label="problem-discussions" />
            <ChannelItem icon={Hash} label="showcase" />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between px-3 py-1 text-surface-500 uppercase text-[10px] font-black tracking-[0.2em] group cursor-pointer hover:text-white transition-colors">
            <div className="flex items-center gap-1.5">
              <ChevronDown size={12} strokeWidth={3} />
              <span>Voice Arenas</span>
            </div>
            <Plus size={14} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-2 space-y-0.5">
            <ChannelItem icon={Volume2} label="Lobby Main" />
            <ChannelItem icon={Volume2} label="Team Alpha" />
            <ChannelItem icon={Volume2} label="Team Beta" />
          </div>
        </section>
      </div>

      {/* User Bar */}
      <footer className="h-16 bg-white/[0.03] border-t border-white/5 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-white/5 cursor-pointer flex-1 min-w-0 transition-colors">
          <div className="relative shrink-0">
            <UserAvatar 
              username={profile?.username || 'U'} 
              src={profile?.avatar_url || undefined} 
              size="sm"
              className="rounded-md ring-1 ring-white/10"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1A1B1E]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-white truncate leading-none mb-0.5">{profile?.username || 'User'}</span>
            <span className="text-[10px] text-surface-500 font-mono truncate tracking-tight">ID: {user?.id.substring(0, 8)}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-surface-500">
          <button className="p-2 hover:bg-white/5 hover:text-white rounded-md transition-colors"><Mic size={18} /></button>
          <button className="p-2 hover:bg-white/5 hover:text-rose-500 rounded-md transition-colors" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
        </div>
      </footer>
    </aside>
  )
}

export default SecondarySidebar
