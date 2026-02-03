import React from 'react'
import MyOrdersPage from './MyOrdersPage'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/slices/cartSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const {user} = useSelector((state)=> state.auth);
  const userName = user?.username || '';
  const email = user?.email || '';

  const handleLogout = ()=>{
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate('/');
    
}

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
          <div className="flex flex-col items-center text-center">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 mb-4">
              A
            </div>
            <h2 className="text-xl font-bold mb-2">{userName}</h2>
            <p className="text-sm text-gray-600 mb-4 break-words">
             {email}
            </p>
            <button 
            onClick={handleLogout}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors duration-300">
              Logout
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-1 lg:col-span-3">
          <MyOrdersPage/>
        </div>
      </div>
    </div>
  )
}

export default Profile
