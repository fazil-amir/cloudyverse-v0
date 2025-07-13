import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user)
  const isFirstMount = useRef(true)

  useEffect(() => {
    isFirstMount.current = false
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        navigate(redirectTo)
      } else if (!requireAuth && isAuthenticated) {
        navigate('/')
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, navigate])

  // Show loading state only on first mount
  if (isLoading && isFirstMount.current) {
    return <div>Loading...</div>
  }

  // If auth check passes, render children
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>
  }

  // Don't render anything while redirecting
  return null
}

export default AuthGuard 