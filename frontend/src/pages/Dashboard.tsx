import React from 'react'
import AnimatedPageContainer from '@components/core/AnimatedPageContainer'
import Topbar from '@components/layout/Topbar'
import { useAuthStore } from '@store/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { contestService } from '@lib/contests'
import { useNavigate } from 'react-router-dom'
import { cn } from '@utils/cn'
import { Trophy, Activity, Award } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { profile, user } = useAuthStore()
  const navigate = useNavigate()

  const { data: myContests, isLoading } = useQuery({
    queryKey: ['myContests', user?.id],
    queryFn: () => user ? contestService.getMyContests(user.id) : Promise.resolve([]),
    enabled: !!user,
  })

  return (
    <AnimatedPageContainer>
      <Topbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Welcome back, {profile?.username || 'Coder'}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard title="Current Rating" value={profile?.rating || '1200'} trend="+0" color="text-brand" icon={<Trophy size={20} />} />
            <StatsCard title="Battles Won" value="0" trend="+0" color="text-emerald-500" icon={<Activity size={20} />} />
            <StatsCard title="Global Rank" value="N/A" trend="-" color="text-amber-500" icon={<Award size={20} />} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background-secondary rounded-xl p-5 border border-white/5 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Active Contests</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-lg"></div>)}
                </div>
              ) : myContests && myContests.length > 0 ? (
                myContests.map(contest => (
                  <ContestItem 
                    key={contest.id}
                    title={contest.name} 
                    participants={0} // To be implemented with participant count
                    status="Active"
                    onClick={() => navigate(`/contests/lobby/${contest.id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No active contests found.</p>
                  <button 
                    onClick={() => navigate('/contests')}
                    className="text-brand font-bold text-sm mt-2 hover:underline"
                  >
                    Browse Contests
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-background-secondary rounded-xl p-5 border border-white/5 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="text-center py-10 text-gray-500">
                <p className="text-sm">Activity tracking will be available soon.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AnimatedPageContainer>
  )
}

const StatsCard = ({ title, value, trend, color, icon }: any) => (
  <div className="bg-background-secondary rounded-xl p-5 border border-white/5 shadow-lg">
    <div className="flex justify-between items-start">
      <span className="text-gray-400 text-sm font-medium">{title}</span>
      <div className={cn("p-2 rounded-lg bg-white/5", color)}>{icon}</div>
    </div>
    <div className="flex items-end justify-between mt-2">
      <span className={cn("text-3xl font-bold", color)}>{value}</span>
      <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-full">{trend}</span>
    </div>
  </div>
)

const ContestItem = ({ title, participants, status, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
  >
    <div className="flex flex-col">
      <span className="font-bold text-gray-100">{title}</span>
      <span className="text-xs text-gray-400">{participants} participants joined</span>
    </div>
    <div className="bg-brand/20 text-brand px-3 py-1 rounded-md text-sm font-bold lowercase first-letter:uppercase">
      {status}
    </div>
  </div>
)

export default Dashboard
