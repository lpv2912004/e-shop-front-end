

import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2"; // Thêm Bar cho biểu đồ cột
import axios from "axios";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FaUserFriends } from "react-icons/fa"; // Icon for users
import { FaTshirt } from "react-icons/fa"; // Icon for products
import { FaShoppingCart } from "react-icons/fa"; // Icon for orders
import { MdBarChart } from "react-icons/md"; // Icon for revenue

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardMain() {
  const [usersToday, setUsersToday] = useState(0);
  const [productsToday, setProductsToday] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [revenueToday, setRevenueToday] = useState(0);
  const [weeklySalesData, setWeeklySalesData] = useState([]); // Dữ liệu doanh số tuần

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        toast.error("Token không tồn tại!");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch dữ liệu tổng hợp
      const userRes = await axios.get(
        "http://localhost:8080/admin/api/dashboard/users-today",
        config
      );
      setUsersToday(userRes.data.length || 0);

      const productRes = await axios.get(
        "http://localhost:8080/admin/api/dashboard/products-today",
        config
      );
      setProductsToday(productRes.data.length || 0);

      const todayRes = await axios.get(
        "http://localhost:8080/admin/api/dashboard/today",
        config
      );
      setOrdersToday(todayRes.data.orders.length || 0);
      setRevenueToday(todayRes.data.totalRevenue || 0);

      // Fetch doanh số theo tuần
      const weeklySalesRes = await axios.get(
        "http://localhost:8080/admin/api/dashboard/weekly-sales",
        config
      );
      setWeeklySalesData(weeklySalesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Cấu hình dữ liệu biểu đồ doanh số theo tuần
  const weeklySalesChartData = {
    labels: weeklySalesData.map((item) => item.day), // Tên ngày trong tuần
    datasets: [
      {
        label: "Doanh số (VND)",
        data: weeklySalesData.map((item) => item.total), // Tổng doanh số theo ngày
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình dữ liệu biểu đồ doanh thu
  const revenueData = {
    labels: ["12.04", "12.05", "12.06", "12.07", "12.08"], // Các ngày
    datasets: [
      {
        label: "Revenue",
        data: [30, 40, 45, 50, 70], // Dữ liệu mẫu
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 container">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <FaUserFriends className="text-green-500 text-3xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-700">{usersToday}</h3>
          <p className="text-sm text-gray-500">Tổng người dùng mới hôm nay</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <FaTshirt className="text-blue-500 text-3xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-700">{productsToday}</h3>
          <p className="text-sm text-gray-500">Tổng sản phẩm mới hôm nay</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <FaShoppingCart className="text-orange-500 text-3xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-700">{ordersToday}</h3>
          <p className="text-sm text-gray-500">Tổng đơn hàng hôm nay</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <MdBarChart className="text-purple-500 text-3xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-700">
            {new Intl.NumberFormat("vi-VN").format(revenueToday)} VND
          </h3>
          <p className="text-sm text-gray-500">Tổng doanh thu hôm nay</p>
        </div>
      </div>

      {/* Weekly Sales Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Doanh số theo tuần
        </h3>
        <div className="mt-4">
          <Bar
            data={weeklySalesChartData}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
