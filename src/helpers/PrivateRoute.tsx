import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '../components'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { loggedIn, isLoading } = useAuth()

  if (isLoading) return <Spinner />

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}
