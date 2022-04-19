import { onAuthStateChanged } from 'firebase/auth'
import {
  addDoc,
  collection,
  FieldValue,
  serverTimestamp,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { Spinner } from '../../components'
import { auth, db } from '../../firebase.config'

interface Inputs {
  type?: string
  name?: string
  bedrooms?: number
  bathrooms?: number
  parking?: boolean
  furnished?: boolean
  address?: string
  offer?: boolean
  images?: File[] | null
  regularPrice?: number
  discountedPrice?: number
  latitude?: number
  longitude?: number
  userRef?: string
}

interface FormDataType extends Inputs {
  location?: string
  imageUrls: any
  geolocation?: Geolocation | null
  timestamp?: FieldValue | null
}

type Geolocation = {
  lat?: number
  lng?: number
}

export default function CreateListing() {
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Inputs>({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    userRef: '',
  })
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    images,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    userRef,
  } = formData

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    if (regularPrice! >= discountedPrice!) {
      setIsLoading(false)
      toast.error('Discouted price needs to be less than regular price.')
      return
    }

    if (images!.length > 6) {
      setIsLoading(false)
      toast.error('Max 6 images.')
      return
    }

    let geolocation: Geolocation = {}
    let location

    geolocation.lat = latitude
    geolocation.lng = longitude
    location = address

    const storeImage = async (image: File) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, `images/${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              case 'success':
                toast.success('Image has been uploaded.')
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imageUrls = await Promise.all(
      [...images!].map((image) => storeImage(image))
    ).catch(() => {
      setIsLoading(false)
      toast.error('Images not uploaded.')
      return
    })

    const formDataCopy: FormDataType = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }

    delete formDataCopy.images
    delete formDataCopy.address
    delete formDataCopy.latitude
    delete formDataCopy.longitude
    location && (formDataCopy.location = location)
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    console.log(formDataCopy)

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

    setIsLoading(false)

    toast.success('Listing saved.')

    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e: React.ChangeEvent<any>) => {
    let boolean: boolean | null = null

    if (e.target.value === 'yes') {
      boolean = true
    }

    if (e.target.value === 'no') {
      boolean = false
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, navigate])

  return isLoading ? (
    <Spinner />
  ) : (
    <div className='profile'>
      <header>
        <h1 className='pageHeader'>Create a Listing</h1>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              id='type'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              type='button'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>

            <button
              id='type'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              type='button'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            id='name'
            type='text'
            className='formInputName'
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                id='bedrooms'
                type='number'
                className='formInputSmall'
                value={bedrooms}
                onChange={onMutate}
                max={50}
                min={1}
                required
              />
            </div>

            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                id='bathrooms'
                type='number'
                className='formInputSmall'
                value={bathrooms}
                onChange={onMutate}
                max={50}
                min={1}
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              id='parking'
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              value='yes'
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              id='parking'
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              value='no'
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              id='furnished'
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              value='yes'
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              id='furnished'
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              value='no'
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            id='address'
            className='formInputAddress'
            onChange={onMutate}
            value={address}
            required
          />

          <div className='formLatLng flex'>
            <div>
              <label className='formLabel'>Latitude</label>
              <input
                id='latitude'
                type='number'
                className='formInputSmall'
                onChange={onMutate}
                value={latitude}
                required
              />
            </div>

            <div>
              <label className='formLabel'>Longitude</label>
              <input
                id='longitude'
                type='number'
                className='formInputSmall'
                onChange={onMutate}
                value={longitude}
                required
              />
            </div>
          </div>

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              id='offer'
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              value='yes'
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              id='offer'
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              value='no'
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              id='regularPrice'
              type='number'
              className='formInputSmall'
              onChange={onMutate}
              value={regularPrice}
              min={50}
              max={750000000}
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ /month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                id='discountedPrice'
                type='number'
                className='formInputSmall'
                onChange={onMutate}
                value={discountedPrice}
                min={50}
                max={750000000}
                required
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            id='images'
            className='formInputFile'
            onChange={onMutate}
            max={6}
            accept='.jpg,.png,.jpeg'
            type='file'
            multiple
            required
          />

          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}
