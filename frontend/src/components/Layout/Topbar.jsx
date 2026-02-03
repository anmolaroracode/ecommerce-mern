import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

const Topbar = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-primary text-white h-6">
      {/* h-10 keeps height FIXED (no increase) */}
      <div className="container mx-auto h-full flex items-center px-4 relative">

        {/* CENTER TEXT */}
        <p className="text-xs md:text-sm font-medium mx-auto">
          Free Shipping On Orders Above ₹299
        </p>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 text-white/80 hover:text-white transition"
          aria-label="Close top bar"
        >
          <IoClose className="w-5 h-5" />
        </button>

      </div>
    </div>
  )
}

export default Topbar
