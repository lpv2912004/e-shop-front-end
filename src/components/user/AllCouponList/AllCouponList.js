// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import CouponCard from './CouponCard';

// function AllCouponsList() {
//     const [coupons, setCoupons] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch all vouchers when the component mounts
//     useEffect(() => {
//         const fetchAllVouchers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/user/api/voucher/available'); // Replace with the correct API endpoint
//                 setCoupons(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
//                 setLoading(false);
//             }
//         };
//         fetchAllVouchers();
//     }, []);

//     if (loading) {
//         return <div>Đang tải danh sách mã giảm giá...</div>;
//     }

//     return (
//         <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
//             <div className="banner-section mx-auto max-w-7xl  px-4  sm:px-6">
//                 <img
//                     src="https://media.canifa.com/Simiconnector/1.MacNha_blockhomepage_desktop-30Sep.webp"
//                     alt="Áo Phông Đa Sắc Màu"
//                 />
//             </div>

//             <h2 className="text-3xl text-center mb-8 mt-10">TẤT CẢ MÃ GIẢM GIÁ</h2>
//             {coupons.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
//                     {coupons.map((coupon, index) => (
//                         <CouponCard
//                             key={index}
//                             code={coupon.code}
//                             discount={coupon.discount}
//                             date={coupon.expirationDate}
//                             description={coupon.description}
//                             condition={coupon.condition}
//                         />
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-500">Hiện không có mã giảm giá nào.</p>
//             )}
//         </div>
//     );
// }

// export default AllCouponsList;
