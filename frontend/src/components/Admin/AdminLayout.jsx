import React from 'react'
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';


const AdminLayout = () => {
    const[isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
       {/* MobileToggleButton */}
       <div className='flex items-center p-4 md:hidden bg-gray-900 text-white z-20'>
        <button onClick={toggleSidebar}>
            <FaBars size={24}/>
        </button>
        <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
       </div>
       {/* Overlay For Mobile Sidebar */}
         {isSidebarOpen && (
            <div 
            className='fixed inset-0 bg-black opacity-50 z-10 md:hidden'
            onClick={toggleSidebar}>
            </div>
         )}
         {/* Sidebar */}
         <div className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 block md:static z-20`}>
            {/* Sidebar Componets */}
            <AdminSidebar/>
         </div>
          <main className="flex-1 p-6">
              <Outlet /> {/* renders AdminHomepage or other admin pages */}
          </main>
    </div>
  )
}

export default AdminLayout
