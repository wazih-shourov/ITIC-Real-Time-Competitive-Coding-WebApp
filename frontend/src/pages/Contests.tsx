import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnimatedPageContainer from '@components/core/AnimatedPageContainer'
import Topbar from '@components/layout/Topbar'
import { Trophy, Plus, Hash } from 'lucide-react'
import { contestService } from '@lib/contests'
import { useAuthStore } from '@store/useAuthStore'
import { useContestStore } from '@store/useContestStore'
import ContestCard from '@components/features/contests/ContestCard'
import CreateContestModal from '@components/features/contests/CreateContestModal'
import JoinContestModal from '@components/features/contests/JoinContestModal'
import InviteCodeModal from '@components/features/contests/InviteCodeModal'
import { LoadingScreen } from '@components/core/LoadingScreen'
import { useEffect } from 'react'
import type { Contest } from '@/types/contest'
import { toast } from 'sonner'

const Contests: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { setMyContests } = useContestStore()
  const queryClient = useQueryClient()
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [createdContest, setCreatedContest] = useState<Contest | null>(null)

  // Fetch public contests
  const { data: publicContests, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['publicContests'],
    queryFn: () => contestService.getPublicContests()
  })

  // Fetch user's contests
  const { data: myContests, isLoading: isLoadingMy } = useQuery({
    queryKey: ['myContests', user?.id],
    queryFn: () => user ? contestService.getMyContests(user.id) : Promise.resolve([]),
    enabled: !!user,
  })

  useEffect(() => {
    if (myContests) {
      setMyContests(myContests);
    }
  }, [myContests, setMyContests]);

  const joinMutation = useMutation({
    mutationFn: async (contestId: string) => {
      if (!user) throw new Error('No user');
      
      // Check if already in ANY contest
      if (myContests && myContests.length > 0) {
        // If already in THIS contest, just return (will navigate in onSuccess)
        if (joinedIds.has(contestId)) return;
        
        throw new Error('You are already in an active contest. Please exit first.');
      }
      
      return contestService.joinContest(contestId, user.id);
    },
    onSuccess: (_, contestId) => {
      queryClient.invalidateQueries({ queryKey: ['myContests', user?.id] })
      navigate(`/contests/lobby/${contestId}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to join contest');
    }
  })

  const handleContestSuccess = (contest: Contest) => {
    queryClient.invalidateQueries({ queryKey: ['myContests', user?.id] })
    queryClient.invalidateQueries({ queryKey: ['publicContests'] })
    setCreatedContest(contest)
  }

  const handleJoinSuccess = (contestId: string) => {
    queryClient.invalidateQueries({ queryKey: ['myContests', user?.id] })
    navigate(`/contests/lobby/${contestId}`)
  }

  if (isLoadingPublic || isLoadingMy) return <LoadingScreen />

  const joinedIds = new Set(myContests?.map(c => c.id) || [])

  return (
    <AnimatedPageContainer>
      <Topbar title="Contests" />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Programming Contests</h2>
            <p className="text-gray-400 text-sm">Join a room and compete in realtime code battles.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 bg-background-modifier hover:bg-white/10 text-gray-100 px-4 py-2.5 rounded-lg font-bold transition-all border border-white/5"
            >
              <Hash size={18} className="text-brand" />
              Enter ID
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-brand/20"
            >
              <Plus size={18} />
              Create Contest
            </button>
          </div>
        </div>
        
        {/* My Active Contests */}
        {myContests && myContests.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-brand rounded-full"></div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">My Active Contests</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myContests.map((contest) => (
                <div key={contest.id} onClick={() => navigate(`/contests/lobby/${contest.id}`)}>
                  <ContestCard 
                    contest={contest} 
                    isJoined={true} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Discover */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Discover Public Rooms</h3>
          </div>
          
          {publicContests && publicContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicContests
                .filter(c => !joinedIds.has(c.id))
                .map((contest) => (
                  <ContestCard 
                    key={contest.id} 
                    contest={contest}
                    onJoin={(id) => joinMutation.mutate(id)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-background-secondary/50 rounded-2xl border border-dashed border-white/5">
               <Trophy size={48} className="text-gray-700 mb-4" />
               <p className="text-gray-500 font-medium text-lg">No public contests available yet.</p>
               <p className="text-gray-600 text-sm mt-1">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>

      <CreateContestModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleContestSuccess}
      />

      <JoinContestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />

      {createdContest && (
        <InviteCodeModal
          isOpen={!!createdContest}
          onClose={() => {
            const id = createdContest.id
            setCreatedContest(null)
            navigate(`/contests/lobby/${id}`)
          }}
          inviteCode={createdContest.invite_code}
          contestName={createdContest.name}
        />
      )}
    </AnimatedPageContainer>
  )
}

export default Contests
