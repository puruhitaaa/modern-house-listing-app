import { Link } from 'react-router-dom'
import rentCategoryImage from '../../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../../assets/jpg/sellCategoryImage.jpg'
import { Slider } from '../../components'

export default function Explore() {
  return (
    <div className='explore'>
      <header>
        <h1 className='pageHeader'>Explore</h1>
      </header>

      <main>
        <Slider />

        <h5 className='exploreCategoryHeading'>Categories</h5>
        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img
              className='exploreCategoryImg'
              src={rentCategoryImage}
              alt='rent'
            />
            <p className='exploreCategoryName'>Places for rent</p>
          </Link>

          <Link to='/category/sell'>
            <img
              className='exploreCategoryImg'
              src={sellCategoryImage}
              alt='sell'
            />
            <p className='exploreCategoryName'>Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
