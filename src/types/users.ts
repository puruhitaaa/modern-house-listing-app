import { FieldValue, Timestamp } from 'firebase/firestore'

export interface IUser {
  id?: string
  email?: string
  name?: string
  timestamp?: Timestamp | FieldValue
}
