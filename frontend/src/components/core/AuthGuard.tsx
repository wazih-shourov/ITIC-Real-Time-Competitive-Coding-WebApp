import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/useAuthStore'
import { LoadingScreen } from './LoadingScreen'

export const AuthGuard: React.FC = () => {
  const { user, isLoading, isInitialized } = useAuthStore()
  const location = useLocation()

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!user && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export const PublicGuard: React.FC = () => {
  const { user, isInitialized, isLoading } = useAuthStore()

  if (!isInitialized || isLoading) {
    return null // Keep it quiet during initial check
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
