import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect, useState, createContext, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchUserProfile } from '@/store/slices/user.slice'

import { Blank, Default } from '@/components/layouts'
import AuthGuard from '@/components/auth-guard'

import Home from '@/screens/home/home'
import Settings from '@/screens/settings/storage-settings'
import Test from '@/screens/test/test'
import Setup from '@/screens/setup/setup'
import Login from '@/screens/login/login'

// Setup status context
const SetupStatusContext = createContext<{ setupComplete: boolean | null, loading: boolean }>({ setupComplete: null, loading: true })
export const useSetupStatus = () => useContext(SetupStatusContext)

const SetupStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      setLoading(true)
      try {
        const res = await fetch('api/platform/setup-status', { credentials: 'include' })
        const data = await res.json()
        setSetupComplete(!!data.setupComplete)
      } catch {
        setSetupComplete(false)
      } finally {
        setLoading(false)
      }
    }
    checkSetup()
  }, [])

  return (
    <SetupStatusContext.Provider value={{ setupComplete, loading }}>
      {children}
    </SetupStatusContext.Provider>
  )
}

// Component to handle auth hydration
const AuthHydrator = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  useEffect(() => {
    // On app load, try to fetch user profile to check if user is authenticated
    if (!user && !isAuthenticated) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, user, isAuthenticated])

  return null
}

// Setup guard: redirects to /setup if setup is not complete, or blocks /setup if already complete
const SetupGuard = ({ children }: { children: React.ReactNode }) => {
  const { setupComplete, loading } = useSetupStatus()
  const location = useLocation()

  if (loading) return <div>Loading...</div>

  // If setup is not complete, only allow /setup
  if (setupComplete === false && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />
  }
  // If setup is complete, block /setup
  if (setupComplete === true && location.pathname === '/setup') {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const App = () => {
  return (
    <Provider store={store}>
      <SetupStatusProvider>
        <Router>
          <SetupGuard>
            <AuthHydrator />
            <Routes>
              <Route path="/setup" element={<Setup />} />
              <Route path="/login" element={
                <AuthGuard requireAuth={false}>
                  <Blank><Login /></Blank>
                </AuthGuard>
              } />
              <Route path="/" element={
                <AuthGuard>
                  <Default><Home /></Default>
                </AuthGuard>
              } />
              <Route path="/home" element={
                <AuthGuard>
                  <Default><Home /></Default>
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <Default><Settings /></Default>
                </AuthGuard>
              } />
              <Route path="/test/*" element={
                <AuthGuard>
                  <Default><Test /></Default>
                </AuthGuard>
              } />
            </Routes>
          </SetupGuard>
        </Router>
      </SetupStatusProvider>
    </Provider>
  )
}

export default App