import React from 'react'
import { Link } from 'react-router-dom'
import WomenCol from '../../assets/womens-collection.webp'
import MenCol from '../../assets/mens-collection.webp'
import women from '../../assets/women.jpg'
import men from '../../assets/men.jpg';

const GenderCollSection = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Women */}
        <div className="group relative overflow-hidden h-[420px] sm:h-[480px] lg:h-[520px] bg-gray-100 cursor-pointer">
          <img
            src={women}
            alt="Women's Collection"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-6 left-6 right-6 bg-white p-5 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Women&apos;s Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="inline-block text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Shop now
            </Link>
          </div>
        </div>

        {/* Men */}
        <div className="group relative overflow-hidden h-[420px] sm:h-[480px] lg:h-[520px] bg-gray-100 cursor-pointer">
          <img
            src={men}
            alt="Men's Collection"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-6 left-6 right-6 bg-white p-5 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Men&apos;s Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="inline-block text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Shop now
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default GenderCollSection
