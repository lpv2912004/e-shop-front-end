import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LazyLoad from 'react-lazyload'; 
const BestSellingProducts = ({ onProductClick }) => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/api/products1/best-selling');
        setBestSellingProducts(response.data);
      } catch (error) {
        console.error('Error fetching best-selling products:', error);
      }
    };

    fetchBestSellingProducts();
  }, []);

  return (
    <div className="best-selling-products-section mt-2 mb-2 ">
      <h2 className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mx-auto max-w-7xl   px-2 py-4 sm:px-2 sm:py-4 text-xl font-bold text-start mb-4">Sản Phẩm Bán Chạy</h2>
      <LazyLoad height={200} offset={100} once>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mx-auto max-w-7xl  px-2 py-4 sm:px-2 sm:py-4">
        {bestSellingProducts.length > 0 ? (
          bestSellingProducts.map((product, index) => (
            <div className="relative group cursor-pointer" key={index}>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.image_prod}
                  alt={product.name_prod}
                  className="object-cover object-center w-full h-full cursor-pointer"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-gray-700 text-sm">{product.name_prod}</h3>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm bán chạy</p>
        )}
      </div>
      </LazyLoad>
    </div>
  );
};

export default BestSellingProducts;
