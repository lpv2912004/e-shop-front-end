import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import FashionCategoryCard from './FashionCategoryCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

function FashionCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/api/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: true, // Enable center mode
    centerPadding: '1px', // Space on the edges
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  if (loading) {
    return <div>Đang tải danh mục...</div>;
  }

  return (
    <div className="py-8">
      <h2 className="text-xl text-start font-bold mb-8 px-2 py-4 sm:px-2 sm:py-4">Thời trang MAOU</h2>
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div key={index} className='px-3'> 
            <FashionCategoryCard
              title={category.name_cate}
              productCount={category.products ? category.products.length : 0}
              image={category.cate_image}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default FashionCategories;
