import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { auth, db } from '../../firebase.config'
import googleIcon from '../../assets/svg/googleIcon.svg'

export default function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check for user
      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)

      // If user does not exist, create new user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }

      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Google.')
    }
  }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>{' '}
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt='googleIcon' />
      </button>
    </div>
  )
}
