import React, { useState } from 'react';

function CategoryDropdown({ categories }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <button className="text-blue-500">Danh mục</button> */}
      <button to="/header" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
        DANH MỤC
        <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      </button>
      {showDropdown && (
        <div
          className="absolute z-50 top-full left-0 mt-0 w-[390px] h-auto bg-white shadow-lg rounded-lg transform scale-100 transition-all duration-500 ease-out overflow-y-auto"
        >
          <div className="grid grid-cols-3 gap-x-4 p-4 ">
            {categories.length > 0 ? (
              categories.map((category) => (
                <ul key={category.id} className="divide-y divide-gray-200 text-sm">
                  <li className="p-2 hover:bg-gray-100 cursor-pointer">{category.name_cate}</li>
                </ul>
              ))
            ) : (
              <p>Đang tải danh mục...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
