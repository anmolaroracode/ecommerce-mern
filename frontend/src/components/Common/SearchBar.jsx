import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchProductDetails,
  setFilters
} from '../../redux/slices/productsSlice'

const SearchBar = ({isOpen, setIsOpen}) => {
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!search.trim()) return

    dispatch(setFilters({ search }))
    dispatch(fetchProductDetails({ search }))
    navigate(`/collections/all?search=${search}`)

    setSearch('')
    setIsOpen(false)
  }

  return (
    <div className="relative flex items-center">
      {/* SEARCH INPUT */}
      <form
        onSubmit={handleSubmit}
        className={`
          flex items-center
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'}
          overflow-hidden
        `}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="
            w-full
            bg-gray-100
            text-sm
            px-3 py-1.5
            rounded-md
            focus:outline-none
            placeholder:text-gray-500
          "
          autoFocus={isOpen}
        />

        {/* CLOSE */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="ml-1 text-gray-500 hover:text-black transition"
          aria-label="Close search"
        >
          <HiMiniXMark className="w-4 h-4" />
        </button>
      </form>

      {/* SEARCH ICON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-700 hover:text-black transition"
          aria-label="Open search"
        >
          <HiMagnifyingGlass className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
