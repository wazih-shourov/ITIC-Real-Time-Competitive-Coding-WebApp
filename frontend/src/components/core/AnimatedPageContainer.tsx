import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedPageContainerProps {
  children: React.ReactNode
}

const AnimatedPageContainer: React.FC<AnimatedPageContainerProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPageContainer
