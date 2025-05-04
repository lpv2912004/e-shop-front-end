import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOrderId, setFilterOrderId] = useState(''); // Bộ lọc theo mã đơn hàng
  const [currentPage, setCurrentPage] = useState(1); // Phân trang
  const transactionsPerPage = 5;

  // Lấy token từ localStorage
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Gọi API và truyền token vào header
        const response = await axios.get('http://localhost:8080/admin/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào header
          },
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  // Lọc giao dịch theo mã đơn hàng
  const filteredTransactions = transactions.filter((transaction) =>
    filterOrderId ? transaction.order?.id.toString().includes(filterOrderId) : true
  );

  // Phân trang
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý Trạng thái Thanh toán</h2>

      {/* Bộ lọc theo mã đơn hàng */}
      <div className="mb-4">
        <label className="block mb-2">Lọc theo Mã đơn hàng:</label>
        <input
          type="text"
          value={filterOrderId}
          onChange={(e) => setFilterOrderId(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          placeholder="Nhập mã đơn hàng"
        />
      </div>

      {/* Kiểm tra nếu không có dữ liệu, hiển thị thông báo */}
      {filteredTransactions.length === 0 ? (
        <p>Không có dữ liệu.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className='table-header'>
              <tr>
                <th className="text-left px-6 py-3">Mã giao dịch</th>
                <th className="text-left px-6 py-3">ID Đơn hàng</th>
                <th className="text-left px-6 py-3">Tổng tiền</th>
                <th className="text-left px-6 py-3">Trạng thái</th>
                <th className="text-left px-6 py-3">Mã code</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr key={transaction.id} className={`border-t ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                  <td className="px-6 py-4">{transaction.id}</td>
                  <td className="px-6 py-4">{transaction.order?.id}</td>
                  <td className="px-6 py-4">{transaction.total.toLocaleString()} VNĐ</td>
                  <td className="px-6 py-4">{transaction.status}</td>
                  <td className="px-6 py-4">{transaction.transactionCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
        >
          &lt;
        </button>

        {Array.from({ length: Math.ceil(filteredTransactions.length / transactionsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}
          className={`pagination-button ${currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage) ? 'disabled' : ''}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AdminTransactionManagement;
