import React from 'react'
import { UserAvatar } from './UserAvatar'
import { Trophy, Star } from 'lucide-react'

interface ProfileCardProps {
  profile: any
  className?: string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  if (!profile) return null

  return (
    <div className="bg-background-secondary rounded-xl p-5 border border-white/5 shadow-lg space-y-4">
      <div className="flex items-center gap-4">
        <UserAvatar size="lg" src={profile.avatar_url} username={profile.username} />
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-100">{profile.username}</h3>
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Level 15 Pro</span>
        </div>
      </div>

      {profile.bio && (
        <p className="text-sm text-gray-400 line-clamp-2">
          {profile.bio}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Rating</span>
          <div className="flex items-center gap-1 text-brand font-bold">
            <Star size={14} />
            <span>{profile.rating || 1200}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Rank</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Trophy size={14} />
            <span>#1,234</span>
          </div>
        </div>
      </div>
    </div>
  )
}
