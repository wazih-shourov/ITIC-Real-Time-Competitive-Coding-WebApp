import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { problemService } from '../lib/problems';
import { contestService } from '../lib/contests';
import { useProblemStore } from '../store/useProblemStore';
import { useAuthStore } from '../store/useAuthStore';
import ProblemDescriptionPanel from '../components/features/problems/ProblemDescriptionPanel';
import MonacoEditorPanel from '../components/features/problems/MonacoEditorPanel';
import SubmissionPanel from '../components/features/problems/SubmissionPanel';
import { LoadingScreen } from '../components/core/LoadingScreen';
import { useContestSocket } from '../hooks/useContestSocket';
import { ChevronLeft, Share2, MessageSquare, Lock, History } from 'lucide-react';
import { cn } from '@utils/cn';

const ProblemWorkspace: React.FC = () => {
  const { problemSlug } = useParams<{ problemSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCurrentProblem } = useProblemStore();
  const [showSubmissions, setShowSubmissions] = React.useState(true);

  const { data: problem, isLoading: isLoadingProblem, error: problemError } = useQuery({
    queryKey: ['problem', problemSlug],
    queryFn: () => problemService.getProblemBySlug(problemSlug!),
    enabled: !!problemSlug,
  });

  const { data: myContests, isLoading: isLoadingContests } = useQuery({
    queryKey: ['my-contests', user?.id],
    queryFn: () => user ? contestService.getMyContests(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const activeContest = myContests?.find(c => c.status === 'active');
  const isHost = myContests?.some(c => c.creator_id === user?.id);
  const { emitStatus } = useContestSocket(activeContest?.id);

  useEffect(() => {
    if (problem) {
      setCurrentProblem(problem);
    }
  }, [problem, setCurrentProblem]);

  useEffect(() => {
    if (activeContest) {
      emitStatus('viewing_problem');
    }
  }, [activeContest, emitStatus]);

  if (isLoadingProblem || isLoadingContests) return <LoadingScreen message="Loading workspace..." />;
  
  if (problemError || !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1e1f22] text-white">
        <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isProblemCreator = user?.id === problem.creator_id;
  
  const checkAccess = () => {
    if (isProblemCreator) return true;
    if (activeContest) return true;
    if (isHost) return true;
    return false;
  };

  if (!checkAccess()) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#1e1f22] text-white p-6 text-center">
        <div className="bg-rose-500/10 p-4 rounded-full text-rose-500 mb-6">
          <Lock size={48} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          This problem is locked. You can only access it once the contest has officially started.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
        >
          Return to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1f22] overflow-hidden animate-in fade-in duration-500">
      {/* Workspace Header */}
      <header className="h-12 border-b border-white/5 bg-[#2b2d31] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-white/10" />
          <h2 className="text-sm font-semibold text-gray-200 truncate max-w-[300px]">
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSubmissions(!showSubmissions)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors rounded-lg",
              showSubmissions ? "bg-indigo-500/10 text-indigo-400" : "text-gray-400 hover:text-white"
            )}
          >
            <History className="w-4 h-4" />
            Submissions
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" />
            Discuss
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex min-h-0">
        {/* Left Panel: Description */}
        <div className="w-1/2 min-w-[400px] border-r border-white/5 flex flex-col">
          <ProblemDescriptionPanel problem={problem} />
        </div>

        {/* Right Panel: Editor & Submissions */}
        <div className="flex-1 flex min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <MonacoEditorPanel problemId={problem.id} contestId={activeContest?.id} />
          </div>
          
          {showSubmissions && (
             <div className="w-80 flex flex-col shrink-0">
                <SubmissionPanel problemId={problem.id} contestId={activeContest?.id} />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemWorkspace;
