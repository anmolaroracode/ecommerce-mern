import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading products: {error}</p>
  }

  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No products found.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product._id} to={`/product/${product._id}`}>
            {/* Image */}
            <div className="relative h-[260px] bg-gray-100 overflow-hidden">
              <img
                src={product.images?.[0]?.url}
                alt={product.images?.[0]?.alt || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-gray-800">
                ₹{product.price}
              </p>
            </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid
