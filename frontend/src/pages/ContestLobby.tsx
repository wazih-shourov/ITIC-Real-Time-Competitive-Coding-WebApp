import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AnimatedPageContainer from '@components/core/AnimatedPageContainer';
import Topbar from '@components/layout/Topbar';
import { contestService } from '@lib/contests';
import { problemService } from '@lib/problems';
import { submissionService } from '@lib/submissions';
import { useContestStore } from '@store/useContestStore';
import { LoadingScreen } from '@components/core/LoadingScreen';
import ContestHeader from '@components/features/contests/ContestHeader';
import ParticipantList from '@components/features/contests/ParticipantList';
import ProblemList from '@components/features/problems/ProblemList';
import CreateProblemModal from '@components/features/problems/CreateProblemModal';
import AttachProblemModal from '@components/features/problems/AttachProblemModal';
import ContestTimer from '@components/features/contests/ContestTimer';
import ContestStatusBanner from '@components/features/contests/ContestStatusBanner';
import LiveLeaderboard from '@components/features/contests/LiveLeaderboard';
import LiveSolveFeed from '@components/features/contests/LiveSolveFeed';
import ParticipantPresencePanel from '@components/features/contests/ParticipantPresencePanel';
import ContestEndModal from '@components/features/contests/ContestEndModal';
import HostSubmissionSidebar from '@components/features/contests/HostSubmissionSidebar';
import { useContestSocket } from '../hooks/useContestSocket';
import { useLeaderboardStore } from '@store/useLeaderboardStore';
import { Rocket, ShieldQuestion, Zap, Play, Plus, BookOpen, Settings2, Trophy, Users, Layout, LogOut, AlertTriangle, X, Activity } from 'lucide-react';
import { useAuthStore } from '@store/useAuthStore';
import { toast } from 'sonner';
import { cn } from '@utils/cn';

const ContestLobby: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { setCurrentContest } = useContestStore();
  const { entries } = useLeaderboardStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'problems' | 'leaderboard'>('problems');

  const { data: contest, isLoading: isLoadingContest, error: contestError } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestService.getContestById(id!),
    enabled: !!id,
  });

  const { emitStatus } = useContestSocket(id);

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['progress', user?.id, id],
    queryFn: () => submissionService.getParticipantProgress(id!, user!.id),
    enabled: !!user && !!id,
  });

  const startMutation = useMutation({
    mutationFn: () => contestService.startContest(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest', id] });
      toast.success('Contest started! Good luck to all participants.');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to start contest'),
  });

  const endMutation = useMutation({
    mutationFn: () => contestService.endContest(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest', id] });
      toast.success('Contest ended.');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to end contest'),
  });

  const leaveMutation = useMutation({
    mutationFn: () => contestService.leaveContest(id!, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContests', user?.id] });
      toast.success('You have left the contest.');
      navigate('/contests');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to leave contest'),
  });

  useEffect(() => {
    if (contest) {
      setCurrentContest(contest);
    }
  }, [contest, setCurrentContest]);

  useEffect(() => {
    if (contest?.status === 'ended' && !isEndModalOpen) {
      setIsEndModalOpen(true);
    }
  }, [contest?.status]);

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ['contest-participants', id],
    queryFn: () => contestService.getContestParticipants(id!),
    enabled: !!id,
  });

  const { data: contestProblems, isLoading: isLoadingProblems } = useQuery({
    queryKey: ['contest-problems', id],
    queryFn: () => problemService.getContestProblems(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (contestError) {
      navigate('/contests');
    }
  }, [contestError, navigate]);

  useEffect(() => {
    if (contest?.status === 'active') {
      emitStatus('online');
    }
  }, [contest?.status, emitStatus]);

  if (isLoadingContest || isLoadingParticipants || isLoadingProblems || !contest) return <LoadingScreen />;

  const isCreator = user?.id === contest.creator_id;
  const problems = contestProblems?.map(cp => cp.problem).filter(Boolean) as any[] || [];
  const isWaiting = contest.status === 'waiting';
  const isActive = contest.status === 'active';
  const isEnded = contest.status === 'ended';
  const isLocked = isWaiting && !isCreator;

  const solvedCount = progress?.filter(p => p.status === 'solved').length || 0;

  return (
    <AnimatedPageContainer>
      <Topbar title={`Contest: ${contest.name}`} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sub-Header / Control Bar */}
        <div className="h-16 border-b border-white/5 bg-[#2b2d31]/50 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <ContestStatusBanner status={contest.status} />
            <div className="h-4 w-px bg-white/10" />
            <ContestTimer 
              startedAt={contest.started_at} 
              durationMinutes={contest.duration_minutes} 
              status={contest.status}
              onEnd={() => isCreator && !isEnded && endMutation.mutate()}
            />
          </div>

          <div className="flex items-center gap-3">
            {isCreator && isWaiting && (
              <button
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending || problems.length === 0}
                className="flex items-center gap-2 bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-brand/20"
              >
                <Play size={18} className="fill-current" />
                {startMutation.isPending ? 'Starting...' : 'Start Competition'}
              </button>
            )}

            {isCreator && isActive && (
               <button
                onClick={() => endMutation.mutate()}
                disabled={endMutation.isPending}
                className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl font-bold transition-all"
              >
                End Contest
              </button>
            )}

            <button
              onClick={() => setIsExitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            >
              <LogOut size={18} />
              Exit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Workspace */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Stats Bar */}
              {!isWaiting && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <Trophy className="w-8 h-8 text-amber-500 mb-3" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Your Rank</span>
                    <span className="text-2xl font-black text-white">--</span>
                  </div>
                  <div className="bg-background-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <Zap className="w-8 h-8 text-brand mb-3" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Points</span>
                    <span className="text-2xl font-black text-white">{solvedCount * 100}</span>
                  </div>
                  <div className="bg-background-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <Layout className="w-8 h-8 text-emerald-500 mb-3" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Solved</span>
                    <span className="text-2xl font-black text-white">{solvedCount}/{problems.length}</span>
                  </div>
                </div>
              )}

              {/* Tabs for Active Contest */}
              {!isWaiting && (
                <div className="flex border-b border-white/5">
                  <button
                    onClick={() => setActiveTab('problems')}
                    className={cn(
                      "px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2",
                      activeTab === 'problems' ? "text-brand border-brand" : "text-gray-500 border-transparent hover:text-gray-300"
                    )}
                  >
                    Problems
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={cn(
                      "px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2",
                      activeTab === 'leaderboard' ? "text-brand border-brand" : "text-gray-500 border-transparent hover:text-gray-300"
                    )}
                  >
                    Leaderboard
                  </button>
                </div>
              )}

              {activeTab === 'problems' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-lg font-bold text-white">Battle Ground</h3>
                      <span className="bg-white/5 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">
                        {problems.length}
                      </span>
                    </div>
                    {isCreator && isWaiting && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all border border-white/5"
                        >
                          <Plus className="w-4 h-4" />
                          New Problem
                        </button>
                        <button
                          onClick={() => setIsAttachModalOpen(true)}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20"
                        >
                          <Settings2 className="w-4 h-4" />
                          Manage
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={cn(
                    "transition-all duration-500",
                    isLocked && "grayscale"
                  )}>
                    <ProblemList 
                      problems={problems} 
                      showIndex={true} 
                      isLocked={isLocked}
                      progress={progress || []}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-background-secondary rounded-2xl border border-white/5 overflow-hidden">
                  <LiveLeaderboard contestId={contest.id} problemIds={problems.map(p => p.id)} />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Activity & Presence */}
          <div className="w-80 border-l border-white/5 bg-[#2b2d31]/30 flex flex-col p-4 gap-4 overflow-hidden">
            {isCreator && (
              <div className="h-[45%] min-h-[300px]">
                <HostSubmissionSidebar contestId={contest.id} />
              </div>
            )}
            <div className={cn("min-h-[200px]", isCreator ? "h-[30%]" : "flex-1")}>
               <LiveSolveFeed />
            </div>
            <div className={cn("min-h-[150px]", isCreator ? "h-[20%]" : "h-1/3")}>
               <ParticipantPresencePanel participants={participants || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#2b2d31] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-rose-500">
                <div className="p-3 bg-rose-500/10 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Exit Contest</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8">
                Are you sure you want to exit this contest? Your progress may be lost, and you will need to re-join if the contest is still active.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsExitModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => leaveMutation.mutate()}
                  disabled={leaveMutation.isPending}
                  className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
                >
                  {leaveMutation.isPending ? 'Exiting...' : 'Yes, Exit'}
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsExitModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {isCreator && (
        <>
          <CreateProblemModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
          />
          <AttachProblemModal 
            isOpen={isAttachModalOpen} 
            onClose={() => setIsAttachModalOpen(false)} 
            contestId={id!}
            existingProblemIds={problems.map(p => p.id)}
          />
        </>
      )}

      <ContestEndModal 
        isOpen={isEndModalOpen} 
        onClose={() => setIsEndModalOpen(false)} 
        entries={entries}
        contestName={contest.name}
      />
    </AnimatedPageContainer>
  );
};

export default ContestLobby;
