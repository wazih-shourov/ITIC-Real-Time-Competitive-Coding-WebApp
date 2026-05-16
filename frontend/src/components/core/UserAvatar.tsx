import React from 'react'
import { cn } from '@utils/cn'

interface UserAvatarProps {
  src?: string
  username?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, username, size = 'md', className }) => {
  const initials = username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className={cn(
      "rounded-full bg-background-modifier flex items-center justify-center font-bold text-gray-100 overflow-hidden flex-shrink-0 border border-white/5",
      sizeMap[size],
      className
    )}>
      {src ? (
        <img src={src} alt={username} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}

export default UserAvatar;
