import { doc, getDoc } from 'firebase/firestore'
import { useState, useEffect, ChangeEvent } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spinner } from '../../components'
import { db } from '../../firebase.config'
import { IUser } from '../../types/users'

type Input = {
  message?: string
}

export default function Contact() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [landlord, setLandlord] = useState<IUser | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId!)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setLandlord(docSnap.data())
        setIsLoading(false)
      } else {
        toast.error('Could not get landlord data.')
      }
    }

    getLandlord()
  }, [params])

  return !isLoading ? (
    <div className='pageContainer'>
      <header>
        <h1 className='pageHeader'>Contact Landlord</h1>
      </header>

      {landlord !== null && (
        <main>
          <div className='contactLandlord'>
            <p className='landlordName'>Contact {landlord.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label className='messageLabel'>Message</label>
              <textarea
                id='message'
                className='textarea'
                name='message'
                onChange={onChange}
                value={message}
              />
            </div>

            <a
              className='primaryButton'
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              Send Message
            </a>
          </form>
        </main>
      )}
    </div>
  ) : (
    <Spinner />
  )
}
