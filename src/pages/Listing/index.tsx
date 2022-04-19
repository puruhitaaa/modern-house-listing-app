import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Spinner } from '../../components'
import { auth, db } from '../../firebase.config'
import shareIcon from '../../assets/svg/shareIcon.svg'
import { IListing } from '../../types/listing'
import { priceFormat } from '../../helpers/priceFormat'

export default function Listing() {
  const [listing, setListing] = useState<IListing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId!)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params])

  return !isLoading ? (
    <main>
      {/* SLIDER */}
      <div
        className='shareIconDiv'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)

          setTimeout(() => setShareLinkCopied(false), 2000)
        }}
      >
        <img src={shareIcon} alt='share-icon' />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing?.name} - $
          {listing?.offer
            ? priceFormat(listing.discountedPrice!)
            : priceFormat(listing?.regularPrice!)}
        </p>

        <p className='listingLocation'>{listing?.location}</p>
        <p className='listingType'>For {listing?.type}</p>
        {listing?.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice! - listing.discountedPrice!} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing?.bedrooms! > 1
              ? `${listing?.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing?.bathrooms! > 1
              ? `${listing?.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing?.parking && 'Parking Spot'}</li>
          <li>{listing?.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>

        <div id='map' className='leafletContainer'>
          <MapContainer
            center={[listing?.geolocation?.lat!, listing?.geolocation?.lng!]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[
                listing?.geolocation?.lat!,
                listing?.geolocation?.lng!,
              ]}
            >
              <Popup>{listing?.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing?.userRef && (
          <Link
            className='primaryButton'
            to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  ) : (
    <Spinner />
  )
}
