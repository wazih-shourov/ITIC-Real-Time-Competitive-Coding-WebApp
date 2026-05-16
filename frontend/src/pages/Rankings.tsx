import React from 'react'
import AnimatedPageContainer from '@components/core/AnimatedPageContainer'
import Topbar from '@components/layout/Topbar'

const Rankings: React.FC = () => {
  return (
    <AnimatedPageContainer>
      <Topbar title="Leaderboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-background-secondary rounded-xl overflow-hidden border border-white/5 shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-sidebar/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Coder</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Wins</th>
                <th className="px-6 py-4">Win Rate</th>
              </tr>
            </thead>
            <tbody className="text-gray-100">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => (
                <tr key={rank} className="border-t border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-bold">{rank}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold text-xs">
                        U{rank}
                      </div>
                      <span className="font-semibold">User_{rank * 1337}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand font-bold">{2500 - rank * 50}</td>
                  <td className="px-6 py-4 font-medium">{100 - rank * 2}</td>
                  <td className="px-6 py-4 text-emerald-500 font-bold">{85 - rank}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPageContainer>
  )
}

export default Rankings
