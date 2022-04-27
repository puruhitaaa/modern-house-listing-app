import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { updateProfile } from 'firebase/auth'
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  DocumentData,
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import { auth, db } from '../../firebase.config'
import arrowRightIcon from '../../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../../assets/svg/homeIcon.svg'
import { IListing } from '../../types/listing'
import { ListingItem } from '../../components'

type Inputs = {
  name?: string | null
  email?: string | null
}

type Listing = {
  id: string
  data: DocumentData | IListing
}

export default function Profile() {
  const navigate = useNavigate()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const onDelete = async (listingId: string) => {
    if (
      window.confirm(`Are you sure you want to delete listing ${listingId}?`)
    ) {
      const docRef = doc(db, 'listings', listingId)
      await deleteDoc(docRef)

      setListings((prevState) =>
        prevState?.filter((listing) => listing.id !== listingId)
      )

      toast.success(`Successfully deleted listing ${listingId}`)
    }
  }

  const onEdit = (listingId: string) => navigate(`/edit-listing/${listingId}`)

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser?.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings: Listing[] = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setIsLoading(false)
    }

    fetchUserListings()
  }, [])

  return (
    <div className='pageContainer'>
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

        <Link className='createListing' to='/create-listing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRightIcon} alt='arrow-right' />
        </Link>

        {!isLoading && listings?.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>
            <ul className='listingsList'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
