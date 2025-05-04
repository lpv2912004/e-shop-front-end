import React from 'react';

const ProductCard = ({ product }) => (
    <div className="border rounded-lg p-4 m-2 shadow-lg w-full md:w-1/5">
      <div className="relative h-64">
        <img
          src={product.imageUrl || product.image}
          alt={product.productName || product.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-1 px-4 rounded-full">
          MUA LÀ CÓ QUÀ
        </button>
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">KHÁC</p>
        <h2 className="text-lg font-bold truncate">{product.productName || product.title}</h2>
        <p className="text-blue-500 text-lg font-bold">{product.discountedPrice || product.price}</p>
        <p className="text-gray-500 line-through text-sm">{product.originalPrice || product.oldPrice}</p>
        <p className="text-red-500 text-sm font-bold">{product.discountPercent ? `${product.discountPercent}% OFF` : product.discount}</p>
        <div className="flex items-center mt-2">
          {product.colors && product.colors.map((color, index) => (
            <div key={index} className="w-4 h-4 rounded-full bg-gray-300 mr-1"></div>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <span className="bg-yellow-500 text-white py-1 px-2 rounded-full text-xs">{product.status || 'SALE'}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="bg-blue-500 text-white py-1 px-2 rounded-full text-xs">{product.sold || 'Đã bán'}</span>
        </div>
        <div className="flex items-center mt-2">
          <i className={`fa${product.isFavorite ? 's' : 'r'} fa-heart text-red-500`}></i>
        </div>
      </div>
    </div>
  );
  

export default ProductCard;
