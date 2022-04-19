import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ListingItem, Spinner } from '../../components'
import { db } from '../../firebase.config'

type Listing = {
  id: string
  data: DocumentData
}

export default function Offers() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings')

        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        const querySnap = await getDocs(q)

        const listings: Listing[] = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setListings(listings)
        setIsLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

    fetchListings()
  }, [])

  return (
    <div className='category'>
      <header>
        <h1 className='pageHeader'>Offers</h1>
      </header>

      {isLoading ? (
        <Spinner />
      ) : listings!.length > 0 ? (
        <main>
          <ul className='categoryListings'>
            {listings?.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </main>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}
