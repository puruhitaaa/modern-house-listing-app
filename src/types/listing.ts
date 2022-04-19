import { FieldValue, Timestamp } from 'firebase/firestore'

export interface IListing {
  bathrooms?: number
  bedrooms?: number
  discountedPrice?: number
  furnished?: boolean
  geolocation?: {
    lat?: number
    lng?: number
  }
  imageUrls?: string[]
  location?: string
  name?: string
  offer?: boolean
  parking?: boolean
  regularPrice?: number
  timestamp?: Timestamp | FieldValue
  type?: string
  userRef?: string
}
