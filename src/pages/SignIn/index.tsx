import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../../assets/svg/visibilityIcon.svg'
import { auth } from '../../firebase.config'

type Inputs = {
  email: string
  password: string
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      if (userCredential.user) {
        navigate('/')
      }
    } catch (error) {
      toast.error('Bad user credentials.')
    }
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className='emailInput'
              id='email'
              placeholder='Email'
              type='text'
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

            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button type='submit' className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>

          {/* Google OAuth */}

          <Link to='/sign-up' className='registerLink'>
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  )
}
