import React from 'react'
import { Link } from 'react-router-dom'
import bottomFeatured from '../../assets/bottomFeatured.jpg'

const FeaturedCollections = () => {
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-[2.5rem]
        bg-gradient-to-br from-primary/10 via-white to-primary/5">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative h-[300px] sm:h-[420px] lg:h-auto">
            <img
              src={bottomFeatured}
              alt="Everyday fashion collection"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="px-6 sm:px-10 lg:px-14 py-12 lg:py-16 text-center lg:text-left">

            {/* Tag */}
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              Designed for Daily Wear
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
              Clothes that move<br className="hidden sm:block" />
              with your lifestyle
            </h2>

            {/* Description */}
            <p className="max-w-xl mx-auto lg:mx-0 text-secondary text-sm sm:text-base leading-relaxed mb-8">
              Thoughtfully crafted pieces made to keep up with long days,
              busy schedules, and everything in between — without
              compromising on how you look or feel.
            </p>

            {/* CTA */}
            <Link to="/products">
              <button className="inline-flex items-center gap-2 rounded-full
                bg-primary px-8 py-3 text-sm font-semibold text-white
                transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02]">
                View the Collection
                <span className="text-lg">→</span>
              </button>
            </Link>

          </div>

        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections
