import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-gray-200'>
      <Topbar/>
      <Navbar/>
      {/* CartDrawer */}
      {/* Footer */}

    </header>
  )
}

export default Header
