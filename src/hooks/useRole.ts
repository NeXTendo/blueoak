import { useAuthStore } from '@/stores/authStore'

export function useRole() {
  const profile = useAuthStore((s) => s.profile)
  const type    = profile?.user_type

  return {
    isBuyer:     type === 'buyer',
    isSeller:    type === 'seller' || type === 'agent',
    isAgent:     type === 'agent',
    isAdmin:     type === 'admin' || type === 'super_admin',
    isSuperAdmin: type === 'super_admin',
    hasRole:     (role: string) => type === role,
    userType:    type,
  }
}
