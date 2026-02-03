import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight
} from 'react-icons/hi2'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'

const navLinks = [
  { name: 'Men', query: 'gender=Men' },
  { name: 'Women', query: 'gender=Women' },
  { name: 'Top Wear', query: 'category=Top Wear' },
  { name: 'Bottom Wear', query: 'category=Bottom Wear' }
]

const Navbar = () => {
  const [openCart, setOpenCart] = useState(false)
  const [mobileDrawer, setMobileDrawer] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)

  const isAdmin = user && user.role === 'admin'

  const cartItemCount =
    cartItems?.products?.reduce((t, i) => t + i.quantity, 0) || 0

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 md:px-6 h-12 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Aura
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav
            className={`
              hidden md:flex items-center gap-8
              transition-all duration-300 ease-out
              ${searchOpen
                ? 'opacity-0 translate-y-1 pointer-events-none'
                : 'opacity-100 translate-y-0'}
            `}
          >
            {navLinks.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={`/collections/all?${item.query}`}
                  className="text-sm font-medium uppercase text-gray-700 hover:text-black transition"
                >
                  {item.name}
                </Link>
                <span className="absolute left-0 -bottom-1 h-[2px] bg-black w-0 group-hover:w-full transition-all duration-300" />
              </div>
            ))}

            {/* ADMIN (DESKTOP) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="
                  ml-2
                  px-3 py-1.5
                  text-xs font-semibold uppercase
                  text-white
                  bg-black
                  border border-black
                  rounded-md
                  hover:bg-white hover:text-black
                  transition-colors
                "
              >
                Admin
              </Link>
            )}
          </nav>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-3 md:gap-4 ml-2">

            {/* SEARCH */}
            <SearchBar isOpen={searchOpen} setIsOpen={setSearchOpen} />

            {/* USER */}
            <div
              className={`
                flex items-center gap-3 md:gap-4
                transition-opacity duration-200
                ${searchOpen ? 'hidden md:flex' : 'flex'}
              `}
            >
              <Link to={user ? '/profile' : '/login'}>
                <HiOutlineUser className="w-6 h-6 text-gray-700 hover:text-black transition" />
              </Link>

              <button
                onClick={() => setOpenCart(true)}
                className="relative"
              >
                <HiOutlineShoppingBag className="w-6 h-6 text-gray-700 hover:text-black transition" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className={`md:hidden ml-1 ${
                searchOpen ? 'hidden' : 'block'
              }`}
              onClick={() => setMobileDrawer(true)}
            >
              <HiBars3BottomRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          mobileDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMobileDrawer(false)}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          mobileDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <IoMdClose
            onClick={() => setMobileDrawer(false)}
            className="w-6 h-6 cursor-pointer"
          />
        </div>

        <nav className="flex flex-col p-6 gap-4 text-sm font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={`/collections/all?${item.query}`}
              onClick={() => setMobileDrawer(false)}
              className="text-gray-700 hover:text-black transition"
            >
              {item.name}
            </Link>
          ))}

          {/* ADMIN (MOBILE) */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileDrawer(false)}
              className="
                mt-6
                py-2
                text-center
                font-semibold
                uppercase
                text-white
                bg-black
                border border-black
                rounded-md
                hover:bg-white hover:text-black
                transition-colors
              "
            >
              Admin Dashboard
            </Link>
          )}
        </nav>
      </aside>

      {/* ================= CART DRAWER ================= */}
      <CartDrawer
        openCart={openCart}
        handleCart={() => setOpenCart(false)}
      />
    </>
  )
}

export default Navbar
