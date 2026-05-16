import React from 'react'
import { cn } from '@utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const AuthInput: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] leading-none">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className={cn(
            "w-full bg-background-sidebar text-white px-3 py-2.5 rounded-sm border border-white/5 outline-none transition-all duration-200",
            "placeholder:text-surface-600 text-sm font-medium",
            "focus:border-brand/40 focus:bg-white/[0.02] focus:ring-1 focus:ring-brand/20",
            error ? "border-rose-500/50 bg-rose-500/[0.02] focus:border-rose-500 focus:ring-rose-500/20" : ""
          )}
        />
        {error && (
          <span className="absolute -bottom-5 left-0 text-[10px] font-bold text-rose-500 uppercase tracking-wider">
            {error}
          </span>
        )}
      </div>
    </div>
  )
}
