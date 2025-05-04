import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FaTrashAlt, FaEdit, FaSearch, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPowerOff, FaCheckCircle } from 'react-icons/fa';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Để hiển thị loader
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;
  const history = useHistory();
  const [loadingButtonId, setLoadingButtonId] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem('jwtToken');
    axios
      .get('http://localhost:8080/admin/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const filtered = response.data.filter(user => user.role?.id === 2);
        setUsers(filtered);
        setFilteredUsers(filtered);
      })
      .catch(() => setErrorMessage('Có lỗi xảy ra khi tải danh sách người dùng!'))
      .finally(() => setLoading(false)); // Tắt loader khi hoàn thành
  };

  const handleStatusChange = (userId, currentStatus) => {
    setLoadingButtonId(userId); // Đặt ID nút đang xử lý
    const token = localStorage.getItem('jwtToken');

    axios
      .put(
        `http://localhost:8080/admin/api/users/status/${userId}`,
        { status_user: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(response => {
        const updatedUser = response.data;
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status_user: updatedUser.status_user } : user
        ));
        toast.success(`Đã ${updatedUser.status_user ? 'kích hoạt' : 'vô hiệu hóa'} người dùng`);
      })
      .catch(error => {
        console.error('Error updating status:', error);
        setErrorMessage('Có lỗi xảy ra khi cập nhật trạng thái!');
      })
      .finally(() => setLoadingButtonId(null)); // Đặt lại loadingButtonId
  };


  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-700">Quản Lý Khách Hàng</h2>

      </div>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          className="pl-10 border border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-none"
          placeholder="Tìm kiếm người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="px-4 py-3 text-center font-semibold">STT</th>
              <th className="px-6 py-3 font-semibold">Ảnh</th>
              <th className="px-6 py-3 font-semibold">Tên tài khoản</th>
              <th className="px-6 py-3 font-semibold">Họ và tên</th>
              <th className="px-6 py-3 font-semibold">Trạng thái</th>
              <th className="px-6 py-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100 transition border-b">
                <td className="px-4 py-4 text-center font-medium text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4">
                  <img
                    src={user.image_user || 'default-image-url.jpg'}
                    alt={user.username}
                    className="h-16 w-16 object-cover rounded-full border"
                  />
                </td>
                <td className="px-6 py-4 ">
                  {user.username}
                </td>
                <td className="px-6 py-4">{user.fullName}</td>
                <td className="px-6 py-4">
                  {user.status_user ? 'Hoạt động' : 'Không hoạt động'}
                </td>
                <td className="px-6 py-4 text-center">
                  {/* Nút hành động */}
                  <button
                    onClick={() => handleStatusChange(user.id, user.status_user)}
                    className={`px-4 py-2 rounded-full text-white ${user.status_user ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      } flex items-center justify-center`}
                    disabled={loadingButtonId === user.id} // Vô hiệu hóa nút đang xử lý
                  >
                    {loadingButtonId === user.id ? (
                      <ReactLoading type="spin" color="#fff" height={20} width={20} />
                    ) : (
                      <>
                        {user.status_user ? (
                          <FaPowerOff className="mr-2" />
                        ) : (
                          <FaCheckCircle className="mr-2" />
                        )}
                        {user.status_user ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      </>
                    )}
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-8 space-x-3 w-full">
        <div className="flex-grow text-left">
          Hiển thị {currentUsers.length} trong tổng số {filteredUsers.length} khách hàng
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-full shadow-md ${currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 transform transition'
              }`}
          >
            <FaArrowLeft className="mr-2" />
            Trang trước
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => handlePageChange(num + 1)}
              className={`px-4 py-2 rounded-full ${currentPage === num + 1
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
                }`}
            >
              {num + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-full shadow-md ${currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 transform transition'
              }`}
          >
            Trang sau
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;
