import React from 'react'
import {
  HiShoppingBag,
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard
} from 'react-icons/hi2'

const features = [
  {
    icon: HiShoppingBag,
    title: 'All Over India Shipping',
    desc: 'On all orders over $99.00'
  },
  {
    icon: HiArrowPathRoundedSquare,
    title: '15 DAYS RETURN',
    desc: 'Money-back guarantee'
  },
  {
    icon: HiOutlineCreditCard,
    title: 'SECURED CHECKOUT',
    desc: '100% secured checkout process'
  }
]

const FeatureSection = () => {
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {features.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary transition-colors duration-300">
                <Icon className="text-xl text-gray-700 group-hover:text-white" />
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold tracking-tight mb-1">
                {item.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-500 tracking-tight">
                {item.desc}
              </p>
            </div>
          )
        })}

      </div>
    </section>
  )
}

export default FeatureSection
