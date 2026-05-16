import { Server, Socket } from 'socket.io';

export const registerContestHandlers = (io: Server, socket: Socket) => {
  // Track contests this socket is in
  const joinedContests = new Set<string>();

  const joinContest = (data: string | { contestId: string, userId: string }) => {
    const contestId = typeof data === 'string' ? data : data.contestId;
    const userId = typeof data === 'string' ? socket.data.user?.id : data.userId;

    socket.join(`contest:${contestId}`);
    joinedContests.add(contestId);
    console.log(`[Socket] User ${userId} joined contest room: ${contestId}`);
    
    // Broadcast presence update
    io.to(`contest:${contestId}`).emit('participant:presence', {
      userId,
      status: 'online',
      timestamp: new Date().toISOString()
    });
  };

  const leaveContest = (data: string | { contestId: string, userId: string }) => {
    const contestId = typeof data === 'string' ? data : data.contestId;
    const userId = typeof data === 'string' ? socket.data.user?.id : data.userId;

    socket.leave(`contest:${contestId}`);
    joinedContests.delete(contestId);
    console.log(`[Socket] User ${userId} left contest room: ${contestId}`);

    // Broadcast presence update
    io.to(`contest:${contestId}`).emit('participant:presence', {
      userId,
      status: 'offline',
      timestamp: new Date().toISOString()
    });
  };

  const updateStatus = ({ contestId, userId, status }: { contestId: string, userId: string, status: string }) => {
    const finalUserId = userId || socket.data.user?.id;
    io.to(`contest:${contestId}`).emit('participant:status', {
      userId: finalUserId,
      status,
      timestamp: new Date().toISOString()
    });
  };

  const handleDisconnect = () => {
    const userId = socket.data.user?.id;
    if (!userId) return;

    joinedContests.forEach(contestId => {
      console.log(`[Socket] User ${userId} disconnected from contest: ${contestId}`);
      io.to(`contest:${contestId}`).emit('participant:presence', {
        userId,
        status: 'offline',
        timestamp: new Date().toISOString()
      });
    });
    joinedContests.clear();
  };

  socket.on('contest:join', joinContest);
  socket.on('contest:leave', leaveContest);
  socket.on('participant:status', updateStatus);
  socket.on('disconnect', handleDisconnect);
};
