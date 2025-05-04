import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBox,
  FaTags,
  FaListAlt,
  FaUsers,
  FaPalette,
  FaRulerCombined,
  FaHistory,
  FaShoppingCart,
  FaCreditCard,
  FaStar,
  FaWallet,
  FaImage,
  FaCog,
  FaClone,
  FaChartBar,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen overflow-y-auto bg-gradient-to-r from-[#7ec8e0] to-[#FFFF] shadow-lg rounded-none">
      <div className="flex items-center justify-center h-16 text-while text-2xl font-bold mb-8">
        MAOU
      </div>
      <ul className="space-y-4">
        {/* Trang chủ */}
        <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/dashboard') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
          <FaHome className={`mr-3 ${isActive('/admin/dashboard') ? '#464341' : '#464341'}`} />
          <Link to="/admin/dashboard" className="flex-1">Trang chủ</Link>
        </li>

         {/* Thống kê */}
         <div className="border-t border-gray-200 mt-4 pt-4">
          <li className="text-while text-xs uppercase font-bold pl-4">Thống kê</li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/statistics') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaChartBar className={`mr-3 ${isActive('/admin/statistics') ? '#464341' : '#464341'}`} />
            <Link to="/admin/statistics" className="flex-1">Thống kê</Link>
          </li>
        </div>

        {/* Quản lý sản phẩm */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <li className="text-while text-xs uppercase font-bold pl-4">Quản lý sản phẩm</li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/products') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaBox className={`mr-3 ${isActive('/admin/products') ? '#464341' : '#464341'}`} />
            <Link to="/admin/products" className="flex-1">Sản phẩm</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/brands') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaTags className={`mr-3 ${isActive('/admin/brands') ? '#464341' : '#464341'}`} />
            <Link to="/admin/brands" className="flex-1">Thương hiệu</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/categories') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaListAlt className={`mr-3 ${isActive('/admin/categories') ? '#464341' : '#464341'}`} />
            <Link to="/admin/categories" className="flex-1">Danh mục</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/colors') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaPalette className={`mr-3 ${isActive('/admin/colors') ? '#464341' : '#464341'}`} />
            <Link to="/admin/colors" className="flex-1">Màu sắc</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/sizes') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaRulerCombined className={`mr-3 ${isActive('/admin/sizes') ? '#464341' : '#464341'}`} />
            <Link to="/admin/sizes" className="flex-1">Kích thước</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/vouchers-main') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaClone className={`mr-3 ${isActive('/admin/vouchers-main') ? '#464341' : '#464341'}`} />
            <Link to="/admin/vouchers-main" className="flex-1">Voucher</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/flash') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaClone className={`mr-3 ${isActive('/admin/flash') ? '#464341' : '#464341'}`} />
            <Link to="/admin/flash" className="flex-1">Chương trình giảm giá</Link>
          </li>
        </div>

        {/* Quản lý đơn hàng */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <li className="text-while text-xs uppercase font-bold pl-4">Quản lý đơn hàng</li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/orders') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaShoppingCart className={`mr-3 ${isActive('/admin/orders') ? '#464341' : '#464341'}`} />
            <Link to="/admin/orders" className="flex-1">Đơn hàng</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/payment-status') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaCreditCard className={`mr-3 ${isActive('/admin/payment-status') ? '#464341' : '#464341'}`} />
            <Link to="/admin/transactions" className="flex-1">Trạng thái thanh toán</Link>
          </li>
        </div>
        {/* Quản lý người dùng */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <li className="text-while text-xs uppercase font-bold pl-4">Quản lý người dùng & đánh giá</li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/users') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaUsers className={`mr-3 ${isActive('/admin/users') ? '#464341' : '#464341'}`} />
            <Link to="/admin/users" className="flex-1">Người dùng</Link>
          </li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/feedbacks') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaStar className={`mr-3 ${isActive('/admin/feedbacks') ? '#464341' : '#464341'}`} />
            <Link to="/admin/feedbacks" className="flex-1">Đánh giá sản phẩm</Link>
          </li>

          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/background') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaImage className={`mr-3 ${isActive('/admin/slide') ? '#464341' : '#464341'}`} />
            <Link to="/admin/slide" className="flex-1">Quản lý Banner</Link>
          </li>
        </div>

        {/* Quản lý lịch sử & background */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          {/* <li className="text-while text-xs uppercase font-bold pl-4">Quản lý lịch sử & background</li> */}
          {/* <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/update-history') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaHistory className={`mr-3 ${isActive('/admin/update-history') ? '#464341' : '#464341'}`} />
            <Link to="/admin/update-history" className="flex-1">Lịch sử cập nhật</Link>
          </li> */}
          {/* <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/payment-history') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
    <FaWallet className={`mr-3 ${isActive('/admin/payment-history') ? '#464341' : '#464341'}`} />
    <Link to="/admin/payment-history" className="flex-1">Lịch sử thanh toán online</Link>
  </li> */}
          
        </div>

        {/* Hệ thống */}
        {/* <div className="border-t border-gray-200 mt-4 pt-4">
          <li className="text-while text-xs uppercase font-bold pl-4">Hệ thống</li>
          <li className={`flex items-center py-2 px-4 rounded-lg hover:bg-[#8e8b89] transition duration-300 ease-in-out ${isActive('/admin/settings') ? 'bg-[#cec7c3] text-while shadow-lg' : 'text-while'}`}>
            <FaCog className={`mr-3 ${isActive('/admin/settings') ? '#464341' : '#464341'}`} />
            <Link to="/admin/settings" className="flex-1">Cài đặt</Link>
          </li>
        </div> */}

      </ul>
    </div>
  );

};

export default Sidebar;
