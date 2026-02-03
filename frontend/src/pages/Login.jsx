import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'

import cartimg2 from '../assets/cartimg2.jpg'
import { loginUser } from '../redux/slices/authSlice'
import { mergeCarts, fetchCart } from '../redux/slices/cartSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, guestId } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)

  const redirect =
    new URLSearchParams(location.search).get('redirect') || '/'
  const isCheckoutRedirect = redirect.includes('checkout')

  /* ================= AFTER LOGIN ================= */
  useEffect(() => {
    if (!user) return

    dispatch(fetchCart({ userId: user._id }))

    if (cartItems?.products?.length > 0 && guestId) {
      dispatch(mergeCarts({ userId: user._id, guestId }))
        .then(() => navigate(isCheckoutRedirect ? '/checkout' : '/'))
        .catch((err) => console.log('MERGE ERROR', err))
    } else {
      navigate(isCheckoutRedirect ? '/checkout' : '/')
    }
  }, [user])

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    dispatch(loginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Login Successful 🎉', {
          description: 'Welcome back to Aura 👋',
          duration: 2500
        })
      } else {
        toast.error(res.payload || 'Login failed')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden flex">

        {/* ================= LEFT IMAGE ================= */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={cartimg2}
            alt="Shopping"
            className="w-full h-full object-cover brightness-95 contrast-90"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* ================= LOGIN FORM ================= */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 lg:px-14">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg"
          >
            {/* HEADER */}
            <div className="mb-10 text-center">
              <h2 className="text-xl sm:text-3xl font-semibold">
                Aura
              </h2>
              <h3 className="text-l sm:text-2xl font-bold mt-3">
                Welcome Back!
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Please login to your account
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full px-3 py-2
                  border rounded-md
                  focus:outline-none
                  focus:ring-2 focus:ring-primary
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <label className="block font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-3 py-2
                  border rounded-md
                  focus:outline-none
                  focus:ring-2 focus:ring-primary
                "
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full bg-primary text-white
                py-2.5 mt-2
                rounded-lg
                font-medium
                hover:bg-secondary
                transition-colors duration-300
              "
            >
              Login
            </button>

            {/* REGISTER */}
            <p className="text-base text-center mt-6">
              Don&apos;t have an account?{' '}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="ml-1 font-semibold text-primary hover:text-secondary hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
