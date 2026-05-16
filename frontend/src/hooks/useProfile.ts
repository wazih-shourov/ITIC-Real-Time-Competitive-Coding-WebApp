import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '@lib/profile'
import { useAuthStore } from '@store/useAuthStore'

export const useProfile = (userId?: string) => {
  const queryClient = useQueryClient()
  const { setProfile } = useAuthStore()

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const data = await getProfile(userId!)
      if (data) setProfile(data)
      return data
    },
    enabled: !!userId,
  })

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) => 
      updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      setProfile(data)
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  }
}
