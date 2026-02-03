import React, { useEffect, useState, useRef } from 'react'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import {Link} from 'react-router-dom'
import axios from 'axios';

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  useEffect(()=>{
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } 
      }
    fetchNewArrivals();
  },[])
  
const handleMouseDown = (e) => {
  setDragging(true);
  setStartX(e.pageX - scrollRef.current.offsetLeft);
  setScrollLeft(scrollRef.current.scrollLeft);
}

const handleMouseMove = (e) => {
  if(!isDragging) return;
  const x = e.pageX - scrollRef.current.offsetLeft;
  const walk = (x - startX) * 2; //scroll-fast
  scrollRef.current.scrollLeft = scrollLeft - walk;
}

const handleMouseUpOrLeave = (e) => {
  setDragging(false);

}

const scroll = (direction) => {
  const scrollAmount = direction === 'left' ? -300 : 300;
  scrollRef.current.scrollBy({left: scrollAmount, behavior: 'smooth'});
}

// Update Scroll Buttons
const updateScrollButtons = ()=>{
  const container = scrollRef.current;
  if(container){
    const leftScroll = container.scrollLeft;
    const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;  
    setCanScrollLeft(leftScroll > 0);
    setCanScrollRight(rightScrollable);
  }
}

useEffect(()=>{
  const container = scrollRef.current;
  if(container){
    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
    return ()=> container.removeEventListener('scroll', updateScrollButtons);
  }

}, [newArrivals]);
  return (
    <div className='pb-14 px-4 lg:px-0'>
        <div className='continer mx-auto text-center mb-10'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-2'>New Arrivals</h1>
        <p className='font-medium text-gray-600 px-24'>Explore new added styles from trending articles don't think so much explore it before stock go out</p>
        <div className='relative'>
            <button
            onClick={()=>scroll("left")} 
            disabled={!canScrollLeft}
            className={`absolute top-[-30px] right-10 bg-white text-gray-700 font-medium  rounded border shadow-md mr-3 p-1 ${canScrollLeft ? 'hover:bg-gray-100 bg-white text-gray-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <FiChevronLeft 
              className='text-2xl'/>
            </button>
        {/* Scrollable content */}
        </div>
        <div className='relative'>
            <button 
            onClick={()=>scroll("right")}
            disabled={!canScrollRight}
            className={`absolute top-[-30px] right-0 bg-white text-gray-700 font-medium   rounded border shadow-md hover:bg-gray-100 mr-3 p-1 ${canScrollRight ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <FiChevronRight className='text-2xl'/>
            </button>
        </div>

        {/* Scrollable Content */}
        <div 
        ref={scrollRef}
        className={`container mx-auto flex overflow-x-scroll space-x-6 relative mt-3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        >
           {newArrivals.map((item)=>(
           <div className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative' key={item._id} >
            <img 
            className='w-full h-[500px] rounded-lg object-cover'
            src={item.images?.[0]?.url || ""}
            alt={item.name} />
            draggable(false)
            <div className='absolute bottom-0 left-0 right-0 p-4 rounded-b-lg bg-opacity-50 backdrop-blur-md text-white'>
              <Link to={`/product/${item._id}`} className='text-start'>
              <h4 className='font-medium'>{item.name}</h4>
              <p className='mt-1'>{item.price}</p>
              </Link>

            </div>

           </div>
           ))}

        </div>

        </div>

    </div>
  )
}

export default NewArrivals
