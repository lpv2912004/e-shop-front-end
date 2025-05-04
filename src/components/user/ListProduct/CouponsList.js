import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import CouponCard from './CouponCard';
import { useHistory } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function CouponsList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  // Fetch vouchers when the component mounts
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/api/voucher/available');
        console.log("coupon: ", response.data);
        setCoupons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy mã giảm giá:', error);
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Luôn giữ 4 mục hiển thị
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4, // Giữ nguyên 4
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3, // Giữ nguyên 4
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // Giữ nguyên 4
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div>Đang tải mã giảm giá...</div>;
  }

  return (
    <div className="py-8 relative px-2 sm:px-2 sm:py-4">
      {/* Header with title and "Hiện Thêm" button */}
      <div className="flex justify-between items-center relative mb-4 ">
        <h2 className="text-xl font-bold text-start">Ưu đãi nổi bật</h2>
        <button
          onClick={() => history.push('/vouchers')}
          className="text-sm text-cyan-600 px-4 py-2 rounded hover:shadow-sm transition"
        >
          Thêm..
        </button>
      </div>

      {/* Slider Section */}
      <Slider {...settings}>
        {coupons.map((coupon, index) => (
          <div
            key={index}
            className="flex justify-center items-center px-2"
            style={{ maxWidth: '100%', padding: '5px' }}
          >
            <CouponCard
              code={coupon.code}
              discount={coupon.discount}
              date={coupon.expirationDate}
              description={coupon.description}
              condition={coupon.condition}
              typeVoucherName={coupon.typeVoucherName}
              max_voucher_apply={coupon.max_voucher_apply}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CouponsList;
