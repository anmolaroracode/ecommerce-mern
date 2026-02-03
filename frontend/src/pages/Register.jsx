import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { registerUser } from '../redux/slices/authSlice'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    dispatch(
      registerUser({
        username: name,
        email,
        password
      })
    ).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Registration successful 🎉')
        navigate('/')
      } else {
        toast.error(res.payload || 'Registration failed')
      }
    })
  }

  return (
    <section className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xl sm:text-3xl font-semibold text-gray-800">Aura</p>
          <h1 className="text-l sm:text-2xl font-bold mt-1">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                px-3 py-2
                border border-gray-200
                rounded-md
                focus:outline-none
                focus:border-primary
              "
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-3 py-2
                border border-gray-200
                rounded-md
                focus:outline-none
                focus:border-primary
              "
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                px-3 py-2
                border border-gray-200
                rounded-md
                focus:outline-none
                focus:border-primary
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full
              mt-2
              py-2.5
              rounded-lg
              bg-primary
              text-white
              font-medium
              hover:bg-secondary
              transition-colors
            "
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-5">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-semibold text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
