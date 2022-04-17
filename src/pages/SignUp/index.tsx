import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../../assets/svg/visibilityIcon.svg'
import {
  doc,
  FieldValue,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

type Inputs = {
  name: string
  email: string
  password?: string
  timestamp: Timestamp | FieldValue
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password!
      )

      const user = userCredential.user

      updateProfile(auth.currentUser!, {
        displayName: data.name,
      })

      const dataCopy = { ...data }
      delete dataCopy.password
      dataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), dataCopy)

      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome!</p>
        </header>

        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className='nameInput'
              id='name'
              placeholder='Name'
              type='text'
              {...register('name', { required: true })}
            />

            {errors.name?.type === 'required' && (
              <p className='validationErrorText'>Name is required</p>
            )}

            <input
              className='emailInput'
              id='email'
              placeholder='Email'
              type='email'
              {...register('email', { required: true })}
            />

            {errors.email?.type === 'pattern' && (
              <p className='validationErrorText'>
                Please enter a valid email address
              </p>
            )}

            {errors.email?.type === 'required' && (
              <p className='validationErrorText'>Email is required</p>
            )}

            <div className='passwordInputDiv'>
              <input
                className='passwordInput'
                id='password'
                placeholder='Password'
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: true,
                  minLength: 6,
                  maxLength: 250,
                })}
              />

              <img
                src={visibilityIcon}
                alt='show password'
                className='showPassword'
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {errors.password?.type === 'maxLength' && (
              <p className='validationErrorText'>
                Password is max 250 characters
              </p>
            )}

            {errors.password?.type === 'minLength' && (
              <p className='validationErrorText'>
                Password is min 6 characters
              </p>
            )}

            {errors.password?.type === 'required' && (
              <p className='validationErrorText'>Password is required</p>
            )}

            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button type='submit' className='signUpButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>

          {/* Google OAuth */}

          <Link to='/sign-in' className='registerLink'>
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  )
}
