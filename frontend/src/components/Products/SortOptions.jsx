import React from 'react'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const handleSortChange = (e) => {
  const sortBy = e.target.value;
  searchParam.set('sortBy', sortBy);
  setSearchParam(searchParam);
}

  return (
    <div className='mb-4 flex items-center justify-end'>
      <select 
      name="" 
      id="sort" 
      className='border p-1 rounded-md focus:outline-none'
      onChange={handleSortChange}
      value={searchParam.get('sortBy') || ""}
      >
        <option value="">Default</option>
        <option value="PriceAsc">Price: High to Low</option>
        <option value="PriceDes">Price: Low to High</option>
        <option value="Popularity">Popularity</option>
      </select>
      
    </div>
  )
}

export default SortOptions
