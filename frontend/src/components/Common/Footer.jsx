import React from 'react'
import { Link } from 'react-router-dom'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { FiPhoneCall } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='border-t py-12'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>

        {/* REPLACED SECTION */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Why Shop With Us</h3>
          <p className='text-gray-500 mb-4'>
            We focus on quality craftsmanship, timeless design, and comfort
            that fits seamlessly into your everyday life.
          </p>
          <ul className='text-gray-600 text-sm space-y-2'>
            <li>• Premium quality materials</li>
            <li>• Designed for daily wear</li>
            <li>• Easy returns & support</li>
          </ul>
        </div>

        {/* SHOP */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
          <ul className='text-gray-600 space-y-2'>
            <li><Link to='#' className='hover:text-secondary'>Men&apos;s Top Wear</Link></li>
            <li><Link to='#' className='hover:text-secondary'>Women&apos;s Top Wear</Link></li>
            <li><Link to='#' className='hover:text-secondary'>Men&apos;s Bottom Wear</Link></li>
            <li><Link to='#' className='hover:text-secondary'>Women&apos;s Bottom Wear</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
          <ul className='text-gray-600 space-y-2'>
            <li><Link to='#' className='hover:text-secondary'>Contact Us</Link></li>
            <li><Link to='#' className='hover:text-secondary'>About Us</Link></li>
            <li><Link to='#' className='hover:text-secondary'>FAQs</Link></li>
            <li><Link to='#' className='hover:text-secondary'>Features</Link></li>
          </ul>
        </div>

        {/* FOLLOW / CONTACT */}
        <div>
          <h3 className='text-lg text-gray-800 mb-4'>Follow us</h3>
          <div className='flex items-center space-x-4 mb-6'>
            <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-secondary'>
              <TbBrandMeta className='h-5 w-5'/>
            </a>
            <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-secondary'>
              <IoLogoInstagram className='h-5 w-5'/>
            </a>
            <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-secondary'>
              <RiTwitterXLine className='h-4 w-4'/>
            </a>
          </div>
          <p className='text-gray-600'>Call Us</p>
          <p>
            <FiPhoneCall className='inline-block mr-2'/>
            0123-456-789
          </p>
        </div>

      </div>

      <div className='container mx-auto mt-12 text-center text-gray-600 border-t border-gray-200 pt-6'>
        <p className='tracking-tighter text-sm'>
          &copy; 2025 All rights reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
