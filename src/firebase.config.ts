import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCx2jAyileho4kxF8ywZmMXl79UFucRijA',
  authDomain: 'house-listing-app-939ed.firebaseapp.com',
  projectId: 'house-listing-app-939ed',
  storageBucket: 'house-listing-app-939ed.appspot.com',
  messagingSenderId: '966632076027',
  appId: '1:966632076027:web:9c2753c86adb63df68b65e',
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
