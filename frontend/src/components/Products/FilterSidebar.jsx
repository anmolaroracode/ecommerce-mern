import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FilterSidebar = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    category: '',
    gender: '',
    color: [],
    size: [],
    brand: [],
    material: [],
    minPrice: '0',
    maxPrice: '100'
  })
  const[price, setPrice] = useState([0, 100]);
  const[category, setCategory] = useState(['Top Wear', 'Bottom Wear']);
  const[gender, setGender] = useState(['Male', 'Female']);
  const[color, setColor] = useState([
    'Red',
    'Blue',
    'Green',
    'Black',
    'White',
    'Yellow',
    'Pink',
    'Purple'
  ]);
  const[size, setSize] = useState([
    'XS',
    'S',
    'M', 
    'L',
    'XL', 
    'XXL'
  ]);
  const[brand, setBrand] = useState([
    'Nike',
    'Adidas',
    'Puma',
    'Reebok',
    'Under Armour',
    'New Balance'
  ]);
  const[material, setMaterial] = useState([
    'Cotton',
    'Polyester',
    'Wool',
    'Leather',
    'Denim'
  ]);

  useEffect(() => {
    const params  = Object.fromEntries([...searchParam]);
    setFilter({
      category: params.category || '',
      gender: params.gender || '',
      color: params.color ? params.color.split(',') : [],
      size: params.size ? params.size.split(',') : [],
      brand: params.brand ? params.brand.split(',') : [],
      material: params.material ? params.material.split(',') : [],
      minPrice: params.minprice || '0',
      maxPrice: params.maxprice || '100'
    });
  }, [searchParam]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilter = { ...filter };
    if(type==='checkbox'){
      if(checked) {
        newFilter[name] = [...(newFilter[name] || []), value];
      } else {
        newFilter[name] = newFilter[name].filter(item => item !== value);
      }
      } else {
        newFilter[name] = value;
      }
    setFilter(newFilter);
    updateUrlParams(newFilter);
}

  const toggleColor = (col) => {
  setFilter((prev) => {
    let newColors;
    if (prev.color.includes(col)) {
      newColors = prev.color.filter((c) => c !== col);
    } else {
      newColors = [...prev.color, col];
    }
    const updated =  { ...prev, color: newColors };
    updateUrlParams(updated);
    return updated;
  });
};

  const updateUrlParams = (newFilter) => {
    const params = new URLSearchParams();
    Object.keys(newFilter).forEach(key => {
      if (Array.isArray(newFilter[key]) && newFilter[key].length > 0) {
        params.append(key, newFilter[key].join(','));
      }
      else if(newFilter[key]){
        params.append(key, newFilter[key]);
      }
    });
    setSearchParam(params);
    navigate(`?${params.toString()}`);
  }

  const handlePriceChange = (e) => {
   const newValue = e.target.value;
   const updated = { ...filter, maxPrice: newValue };
   setFilter(updated);
   updateUrlParams(updated);
  }

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>
        <div className='mb-6'>
        <label className='block font-medium text-gray-600 mb-2'>Gender</label>
        {gender.map((gen) => (
          <div key={gen} className='flex items-center mb-1'>
            <input 
              type='radio'
              name='gender'
              className='mr-2 h-4 w-4 text-blue-500 accent-black border-gray-300'
              value={gen}
              checked={filter.gender === gen}
              onChange={handleFilterChange}
            />
            <span className='text-gray-700 text-sm'>{gen}</span>
          </div>

        ))}

      </div>
      
      <div className='mb-6'>
        <label className='block font-medium text-gray-600 mb-2'>Category</label>
        {category.map((cat) => (
          <div key={cat} className='flex items-center mb-1'>
            <input 
              type='radio'
              name='category'
              value={cat}
              checked={filter.category === cat}
              onChange={handleFilterChange}
              className='mr-2 h-4 w-4 text-blue-500 accent-black border-gray-300'
            />
            <span className='text-gray-700 text-sm'>{cat}</span>
          </div>
        ))}
      </div>

      <div className='mb-6'>
  <label className='block font-medium text-gray-600 mb-2'>Color</label>
  {color.map((col) => {
    const isSelected = filter.color.includes(col);
    return (
      <button
        key={col}
        type="button"
        onClick={() => toggleColor(col)}
        className={`h-6 w-6 border border-gray-300 rounded-full mr-2 cursor-pointer transition hover:scale-125 ${
          isSelected ? 'ring-2 ring-black' : ''
        }`}
        style={{ backgroundColor: col.toLowerCase() }}
      />
    );
  })}
</div>


      <div className='mb-6'>
        <label className='block font-medium text-gray-600 mb-2'>Size</label>
        {size.map((sz) => (
          <div key={sz} className='flex items-center mb-1'>
            <input
              className='mr-2 h-4 w-4 text-blue-500 accent-black border-gray-300'
              onChange={handleFilterChange}
              type='checkbox'
              name='size'
              value={sz}
              checked={filter.size.includes(sz)}
            />
            <span className='text-gray-700 text-sm'>{sz}</span>
          </div>
        ))}
      </div>

      <div className='mb-6'>
        <label className='block font-medium text-gray-600 mb-2'>Brand</label>
        {brand.map((br) => (
          <div key={br} className='flex items-center mb-1'>
            <input
            name='brand'
            className='mr-2 h-4 w-4 text-blue-500 accent-black border-gray-300'
            onChange={handleFilterChange}
            value={br}
            checked={filter.brand.includes(br)}
            type='checkbox'
            />
            <span className='text-gray-700 text-sm'>{br}</span>
          </div>
        ))}
      </div>

      <div className='mb-6'>
        <label className='block font-medium text-gray-600 mb-2'>Material</label>
        {material.map((mat) => (
          <div key={mat} className='flex items-center mb-1'>
            <input
            name='material'
            className='mr-2 h-4 w-4 text-blue-500 accent-black border-gray-300'
            type='checkbox'
            value={mat}
            checked={filter.material.includes(mat)}
            onChange={handleFilterChange}
            />
            <span className='text-gray-700 text-sm'>{mat}</span>
          </div>
        ))}
      </div>
</div>
  )
}

export default FilterSidebar
