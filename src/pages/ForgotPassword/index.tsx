import { sendPasswordResetEmail } from 'firebase/auth'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg'
import { auth } from '../../firebase.config'

type Input = {
  email?: string | null
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>()

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email!)
      toast.success('Email was sent, please check your inbox.')
    } catch (error) {
      toast.error('Could not send reset email.')
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <h1 className='pageHeader'>Forgot Password</h1>
      </header>

      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            id='email'
            type='email'
            className='emailInput'
            {...register('email')}
          />
          <Link className='forgotPasswordLink' to='/sign-in'>
            Sign In
          </Link>

          <div className='signInBar'>
            <p className='signInText'>Send Reset Link</p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
