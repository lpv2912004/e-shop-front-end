import React from 'react';
import { Link } from 'react-router-dom';

function FashionCategoryCard({ image, title, productCount }) {
  return (
    <div className="relative flex-shrink-0 w-full max-w-[300px] overflow-hidden rounded-sm bg-gray-200 shadow-md ">
      {/* Image section */}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-sm bg-gray-200 group-hover:opacity-75" style={{ backgroundImage: `url(${image})` }}>
        <img src={image} alt={title} className="object-cover object-center w-full h-full group-hover:opacity-75 cursor-pointer" />
      </div>

      {/* Overlay Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-10 p-1 text-white">
        <Link to="/search">
          <button className="text-white font-bold text-sm rounded hover:bg-opacity-50 transition w-full py-1">
            {title}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default FashionCategoryCard;
