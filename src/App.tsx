import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Navbar } from './components'
import PrivateRoute from './helpers/PrivateRoute'
import {
  ExplorePage,
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
        </Routes>
        <Navbar />
      </Router>
    </>
  )
}
