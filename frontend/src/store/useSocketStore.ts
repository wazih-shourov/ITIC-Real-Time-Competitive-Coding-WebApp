import { create } from 'zustand'
import { Socket } from 'socket.io-client'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  isReconnecting: boolean
  setSocket: (socket: Socket | null) => void
  setIsConnected: (isConnected: boolean) => void
  setIsReconnecting: (isReconnecting: boolean) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  isReconnecting: false,
  setSocket: (socket) => set({ socket }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsReconnecting: (isReconnecting) => set({ isReconnecting }),
}))
