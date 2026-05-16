import { useEffect, useCallback } from 'react';
import { useSocket } from '@hooks/useSocket';
import { useActivityStore } from '@store/useActivityStore';
import { usePresenceStore, type UserStatus } from '@store/usePresenceStore';
import { useLeaderboardStore } from '@store/useLeaderboardStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuthStore } from '../store/useAuthStore';

export const useContestSocket = (contestId?: string) => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const addEvent = useActivityStore((state) => state.addEvent);
  const updateParticipant = usePresenceStore((state) => state.updateParticipant);
  const setLastUpdated = useLeaderboardStore((state) => state.setLastUpdated);

  const emitStatus = useCallback((status: UserStatus) => {
    if (socket && isConnected && contestId && user) {
      socket.emit('participant:status', { contestId, userId: user.id, status });
    }
  }, [socket, isConnected, contestId, user]);

  useEffect(() => {
    if (!socket || !isConnected || !contestId || !user) return;

    // Join contest room
    socket.emit('contest:join', { contestId, userId: user.id });

    // Activity feed events
    const onFeedEvent = (event: any) => {
      addEvent(event);
      if (event.type === 'solve') {
        // Refresh leaderboard when someone solves a problem
        queryClient.invalidateQueries({ queryKey: ['leaderboard', contestId] });
        setLastUpdated(new Date().toISOString());
      }
    };

    // Presence events
    const onPresenceUpdate = (data: { userId: string, status: UserStatus }) => {
      updateParticipant(data.userId, data.status);
    };

    const onStatusUpdate = (data: { userId: string, status: UserStatus }) => {
      updateParticipant(data.userId, data.status);
    };

    // Leaderboard update event
    const onLeaderboardUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard', contestId] });
      setLastUpdated(new Date().toISOString());
    };

    // Contest events
    const onContestStart = () => {
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      toast.info('Contest has started!', { icon: '🚀' });
    };

    const onContestEnd = () => {
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
      toast.info('Contest has ended!', { icon: '🏁' });
    };

    socket.on('feed:event', onFeedEvent);
    socket.on('participant:presence', onPresenceUpdate);
    socket.on('participant:status', onStatusUpdate);
    socket.on('leaderboard:update', onLeaderboardUpdate);
    socket.on('contest:start', onContestStart);
    socket.on('contest:end', onContestEnd);

    return () => {
      socket.emit('contest:leave', contestId);
      socket.off('feed:event', onFeedEvent);
      socket.off('participant:presence', onPresenceUpdate);
      socket.off('participant:status', onStatusUpdate);
      socket.off('leaderboard:update', onLeaderboardUpdate);
      socket.off('contest:start', onContestStart);
      socket.off('contest:end', onContestEnd);
    };
  }, [socket, isConnected, contestId, addEvent, updateParticipant, queryClient, setLastUpdated]);

  return { emitStatus };
};
