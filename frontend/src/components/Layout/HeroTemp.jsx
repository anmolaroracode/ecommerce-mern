import React from 'react'
import { Link } from 'react-router-dom'
import winter2 from '../../assets/winter2.jpg'

const HeroTemp = () => {
  return (
    <section className="relative w-full h-[420px] sm:h-[520px] md:h-[650px] lg:h-[750px] overflow-hidden">
      
      {/* Background */}
      <img
        src={winter2}
        alt="Winter Sale"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-xl text-left text-white">

            {/* Badge */}
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 text-[10px] sm:text-xs tracking-widest uppercase">
              Winter Sale ❄️
            </span>

            {/* Heading */}
            <h1 className="
              text-[26px] 
              sm:text-5xl 
              md:text-6xl 
              lg:text-7xl 
              font-extrabold 
              leading-tight 
              mb-4 sm:mb-6
            ">
              Stay Warm.<br />
              Look Sharp.
            </h1>

            {/* Text */}
            <p className="text-white/90 text-[12px] sm:text-base md:text-lg mb-2 sm:mb-3">
              Winter essentials designed for cold days and cozy nights.
            </p>

            <p className="text-white/80 text-[11px] sm:text-base mb-5 sm:mb-8">
              Layer up with jackets, knits, and winter-ready outfits — limited stock available.
            </p>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-4">
              <Link
                to='/products?collections=Winter%20Wear'
                className="
                  bg-white text-black 
                  px-4 py-2 
                  sm:px-8 sm:py-3 
                  rounded-full 
                  font-semibold 
                  text-[12px] sm:text-sm
                  hover:bg-gray-100 
                  transition
                "
              >
                Shop Winter Wear
              </Link>

              <Link
                to='/products?collection=Winter&sortBy=newest'
                className="
                  border border-white/70 text-white 
                  px-4 py-2 
                  sm:px-8 sm:py-3 
                  rounded-full 
                  font-semibold 
                  text-[12px] sm:text-sm
                  hover:bg-white hover:text-black 
                  transition
                "
              >
                Explore Collection
              </Link>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroTemp
