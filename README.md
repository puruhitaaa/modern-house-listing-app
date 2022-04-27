# Modern House Listing App

A house listing app made with TypeScript React, Firebase v9 and so many more!


## Screenshots

![App Screenshot](https://i.ibb.co/B4z5VLg/screencapture-modern-house-listing-8mwzi4zro-puruhitaaa-vercel-app-2022-04-28-05-24-24.png)


## Installation

clone my repo

```bash
  cd modern-house-listing-app
  npm install
  ## yarn install <= for yarn users
```
    
## Usage/Examples

Open up src/firebase.config.ts and change it to your own firebase settings:

```javascript
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    // paste your firebase config here
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
```

