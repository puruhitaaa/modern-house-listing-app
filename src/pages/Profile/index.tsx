import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { auth, db } from '../../firebase.config'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

type Inputs = {
  name?: string | null
  email?: string | null
}

export default function Profile() {
  const navigate = useNavigate()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (auth.currentUser?.displayName !== data.name) {
        await updateProfile(auth.currentUser!, {
          displayName: data.name,
        })

        const userRef = doc(db, 'users', auth.currentUser!.uid)

        await updateDoc(userRef, {
          name: data.name,
        })
      }
    } catch (error) {
      toast.error('Could not update profile details.')
    }
  }

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  return (
    <div>
      <header className='profileHeader'>
        <h1 className='pageHeader'>My Profile</h1>
        <button type='button' className='logOut' onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && btnRef.current?.click()
              setChangeDetails(!changeDetails)
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className='profileCard'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              id='name'
              disabled={!changeDetails}
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              type='text'
              {...register('name')}
            />

            <input
              id='email'
              disabled={!changeDetails}
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              type='email'
              {...register('email')}
            />

            <button ref={btnRef} hidden type='submit'>
              Update
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
