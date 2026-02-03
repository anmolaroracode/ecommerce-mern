import React, { useEffect, useState } from 'react'
import {IoMdClose} from 'react-icons/io'
import CartContents from '../Cart/CartContents'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({ handleCart, openCart }) => {
  const navigate = useNavigate();
  const {user, guestId} = useSelector((state)=> state.auth);
  const {cartItems} = useSelector((state)=> state.cart);
  const userId = user?._id || null;

  const handleCheckout = () => {
    if(!user){
      navigate('/login?redirect=checkout');
    }
    else{
      navigate('/checkout');
    }
    handleCart();
  }

  return (
    <div className={`fixed top-0 right-0 h-full sm:w-[20rem] md:w-[30rem] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
      openCart ? 'translate-x-0' : 'translate-x-full'
    } flex flex-col`}>
      
      <div className='flex justify-end p-4'>
        <button onClick={handleCart}>
          <IoMdClose className='h-6 w-6 text-gray-600' />
        </button>
      </div>

      <div className='flex-grow p-4 overflow-y-auto'>
        <h2 className='text-xl mb-4 font-semibold'>Your cart</h2>

        <CartContents 
          cartItems={cartItems} 
          userId={userId} 
          guestId={guestId}
        />

      </div>

      <div className='sticky bottom-0 p-4 bg-white'>
        {cartItems.products && cartItems.products.length > 0 && (
          <>
            <button 
              className='w-full bg-black hover:bg-gray-700 text-white py-2 rounded-lg transition'
              onClick={handleCheckout}
            >
              Checkout now
            </button>

            <p className='text-center text-sm tracking-tighter text-gray-500 mt-1'>
              Excluded taxes and shipping charges
            </p>
          </>
        )}
      </div>

    </div>
  )
}

export default CartDrawer;
