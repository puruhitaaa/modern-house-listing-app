import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { auth } from '../firebase.config'

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true)
        }
        setIsLoading(false)
      })
    }

    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  return { loggedIn, isLoading }
}
