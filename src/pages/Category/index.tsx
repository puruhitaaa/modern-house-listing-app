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
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ListingItem, Spinner } from '../../components'
import { db } from '../../firebase.config'

type Listing = {
  id: string
  data: DocumentData
}

export default function Category() {
  const navigate = useNavigate()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState<Listing | null>(
    null
  )

  const params = useParams()

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings')

      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      )

      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      const listings: Listing[] = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings((prevState) => [...prevState, ...listings])
      setIsLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
    }
  }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings')

        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        )

        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

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
  }, [params])

  return (
    <div className='category'>
      <header>
        <h1 className='pageHeader'>
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
        </h1>
      </header>

      {isLoading ? (
        <Spinner />
      ) : listings!.length ? (
        <>
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

          <br />
          <br />

          {lastFetchedListing && (
            <button className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </button>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  )
}
