import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Initializing system..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-primary z-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full"
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 font-medium animate-pulse"
        >
          {message}
        </motion.span>
      </div>
    </div>
  )
}
