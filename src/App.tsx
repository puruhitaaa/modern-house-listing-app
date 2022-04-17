import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components'
import { ExplorePage, OffersPage, SignInPage, SignUpPage } from './pages'
import ForgotPassword from './pages/ForgotPassword'

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<ExplorePage />} />
          <Route path='/offers' element={<OffersPage />} />
          <Route path='/profile' element={<SignInPage />} />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  )
}
