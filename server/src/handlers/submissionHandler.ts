import { Server, Socket } from 'socket.io';

export const registerSubmissionHandlers = (io: Server, socket: Socket) => {
  const onSubmissionCreated = (data: { 
    contestId: string; 
    problemId: string; 
    userId: string;
    username: string;
    problemTitle: string;
  }) => {
    const userId = data.userId || socket.data.user?.id;
    // Broadcast to the contest room for the feed
    io.to(`contest:${data.contestId}`).emit('feed:event', {
      type: 'submission',
      userId,
      username: data.username,
      problemId: data.problemId,
      problemTitle: data.problemTitle,
      timestamp: new Date().toISOString()
    });
  };

  const onSubmissionJudged = (data: {
    contestId: string;
    problemId: string;
    userId: string;
    verdict: string;
    username: string;
    problemTitle: string;
  }) => {
    const userId = data.userId || socket.data.user?.id;
    
    // Broadcast verdict change to the contest room for the host panel
    io.to(`contest:${data.contestId}`).emit('submission:updated', {
      ...data,
      userId,
      timestamp: new Date().toISOString()
    });

    // If accepted, broadcast to the contest room for the activity feed
    if (data.verdict === 'accepted') {
      io.to(`contest:${data.contestId}`).emit('feed:event', {
        type: 'solve',
        userId,
        username: data.username,
        problemId: data.problemId,
        problemTitle: data.problemTitle,
        timestamp: new Date().toISOString()
      });
    }

    // Always trigger leaderboard update as any verdict change can affect rankings
    io.to(`contest:${data.contestId}`).emit('leaderboard:update');
  };

  socket.on('submission:created', onSubmissionCreated);
  socket.on('submission:judged', onSubmissionJudged);
};
