import { Server, Socket } from 'socket.io';
import { registerContestHandlers } from './contestHandler';
import { registerSubmissionHandlers } from './submissionHandler';

export const registerHandlers = (io: Server, socket: Socket) => {
  registerContestHandlers(io, socket);
  registerSubmissionHandlers(io, socket);
};
