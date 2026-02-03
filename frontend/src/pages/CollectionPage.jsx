import React from 'react'
import { FaFilter } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productsSlice';

const CollectionPage = () => {
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {collection} = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);

useEffect(() => {
  dispatch(fetchProducts({ collection, ...queryParams }));
}, [dispatch, collection, searchParams]);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarOpen(false);
        }

    };
    useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        // clean Event Listener
       return () => {
         document.removeEventListener('mousedown', handleClickOutside);
       }
    }, []);

  return (
    <div className='flex flex-col lg:flex-row'>
        {/* Mobile Filter */}
        <button
        onClick={handleSidebarToggle}
        className={`flex justify-center p-2 border-b rounded-md lg:hidden mb-4 ${isSidebarOpen ? 'hidden' : ''}`}>
            <FaFilter className='text-xl'/>
        </button>
        {/* Filter Sidebar Larger Screen */}
        <div 
        ref={sidebarRef}
        className={`fixed lg:sticky overflow-y-auto mb-1 mt-1 top-16 pb-10 h-screen left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
            <FilterSidebar/>
        </div>
        {/* Products List */}
        <div className='relative flex-grow p-4'>
          <h2 className='text-xl'>ALL COLLECTIONS</h2>
          <SortOptions/>
          <ProductGrid products={products} loading={loading.products} error={error.products} />
        </div>
    </div>
  )
}

export default CollectionPage
