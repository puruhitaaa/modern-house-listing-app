import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SwiperCore, { A11y, Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import { db } from '../../firebase.config'
import Spinner from '../Spinner'
import { toast } from 'react-toastify'
import { IListing } from '../../types/listing'
SwiperCore.use([A11y, Navigation, Pagination, Scrollbar])

type Listing = {
  id: string
  data: DocumentData | IListing
}

export default function Slider() {
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, orderBy('timestamp', 'desc'), limit(5))
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
      } catch (error) {
        toast.error('Could not fetch listings')
      }
    }

    fetchListings()
  }, [])

  return !isLoading ? (
    <>
      <h1 className='exploreHeading'>Recommended</h1>

      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listings?.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            <div
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiperSlideDiv'
            >
              <p className='swiperSlideText'>{data.name}</p>
              <p className='swiperSlidePrice'>
                ${data.discountedPrice ?? data.regularPrice}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  ) : (
    <Spinner />
  )
}
