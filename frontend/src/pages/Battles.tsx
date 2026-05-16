import React from 'react'
import AnimatedPageContainer from '@components/core/AnimatedPageContainer'
import Topbar from '@components/layout/Topbar'

const Battles: React.FC = () => {
  return (
    <AnimatedPageContainer>
      <Topbar title="1v1 Battles" />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center mb-6">
          <Sword size={48} className="text-brand" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Ready for a Battle?</h2>
        <p className="text-gray-400 max-w-md mb-8">
          Challenge other coders in realtime 1v1 battles. Prove your skills and climb the rankings.
        </p>
        <button className="bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-md font-bold text-lg transition-all shadow-lg active:scale-95">
          Find a Match
        </button>
      </div>
    </AnimatedPageContainer>
  )
}

import { Sword } from 'lucide-react'
export default Battles
