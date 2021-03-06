import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Navbar } from './components'
import PrivateRoute from './helpers/PrivateRoute'
import {
  CategoryPage,
  ContactPage,
  CreateListingPage,
  EditListingPage,
  ExplorePage,
  ListingPage,
  OffersPage,
  ProfilePage,
  SignInPage,
  SignUpPage,
} from './pages'
import ForgotPassword from './pages/ForgotPassword'

export default function App() {
  return (
    <>
      <Router>
        <ToastContainer />

        <Routes>
          <Route path='/' element={<ExplorePage />} />
          <Route path='/offers' element={<OffersPage />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/create-listing' element={<CreateListingPage />} />
          <Route
            path='/edit-listing/:listingId'
            element={<EditListingPage />}
          />
          <Route path='/category/:categoryName' element={<CategoryPage />} />
          <Route
            path='/category/:categoryName/:listingId'
            element={<ListingPage />}
          />
          <Route path='/contact/:landlordId' element={<ContactPage />} />
        </Routes>

        <Navbar />
      </Router>
    </>
  )
}
