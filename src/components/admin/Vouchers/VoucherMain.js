import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import { useHistory } from 'react-router-dom';
import { toast, Toaster} from 'sonner';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';


const VoucherList = () => {
  const [state, setState] = useState({ toggle: false });
  const [vouchers, setVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả voucher');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);


  const history = useHistory();

  useEffect(() => {
    fetchVouchers();
  }, [currentPage]);

  const fetchVouchers = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://localhost:8080/admin/api/vouchers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const voucherData = response.data;
      const sortedVouchers = voucherData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setVouchers(sortedVouchers); // Update state with sorted data
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setLoading(false);
    }
  };
  const handleStatusToggle = async (voucher) => {
    const token = localStorage.getItem('jwtToken');
    const updatedVoucher = { ...voucher, status: !voucher.status }; // Chuyển đổi trạng thái

    try {

      await axios.put(`http://localhost:8080/admin/api/vouchers/${voucher.id}`, updatedVoucher, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVouchers(vouchers.map(v => v.id === voucher.id ? updatedVoucher : v));
      toast.success('cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating voucher status:', error);
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }


  const filteredVouchers = vouchers
    .filter((voucher) => {
      if (activeTab === 'Tất cả voucher') return true;
      if (activeTab === 'Đã kích hoạt') return voucher.status === true;
      if (activeTab === 'Chưa kích hoạt') return voucher.status === false;
      return false;
    })
    .filter((voucher) =>
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const currentVouchers = filteredVouchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);


  const renderPagination = () => {
    const pages = [];
    const pageRange = 2;


    pages.push(
      <button key={1} onClick={() => handlePageChange(1)} className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}>
        1
      </button>
    );

    if (currentPage > pageRange + 2) {
      pages.push(<span key="dots-prev" className="pagination-dots">...</span>);
    }


    for (let i = Math.max(2, currentPage - pageRange); i <= Math.min(totalPages - 1, currentPage + pageRange); i++) {
      pages.push(
        <button key={i} onClick={() => handlePageChange(i)} className={`pagination-button ${currentPage === i ? 'active' : ''}`}>
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - pageRange - 1) {
      pages.push(<span key="dots-next" className="pagination-dots">...</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
      {/* <useToastContainer />
      <ToastContainer
        enableMultiContainer={false}
        limit={3}
      /> */}
      <Toaster richColors   position="top-right"/>
      <h2 className="text-xl font-bold flex items-center text-blue-600">Danh sách Voucher</h2>


      <div className="flex space-x-4 mb-6">
        <button
          className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md  ${activeTab === 'Tất cả voucher' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
          onClick={() => setActiveTab('Tất cả voucher')}
        >
          Tất cả voucher
        </button>
        <button
          className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md  ${activeTab === 'Đã kích hoạt' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
          onClick={() => setActiveTab('Đã kích hoạt')}
        >
          Đã kích hoạt
        </button>
        <button
          className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md  ${activeTab === 'Chưa kích hoạt' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
          onClick={() => setActiveTab('Chưa kích hoạt')}
        >
          Chưa kích hoạt
        </button>
      </div>


      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm mã voucher.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

          />
        </div>
        <button onClick={() => history.push('/admin/vouchers-create')} className="bg-blue-500 text-white px-4 py-2 tab-button flex">
          <AiOutlinePlus className="w-5 h-5 mr-2" />
          Tạo Voucher</button>
      </div>


      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border ">
          <thead>
            <tr className='table-header'>
              <th className="px-4 py-2 text-center border-b">Mã Voucher</th>
              <th className="px-4 py-2  text-center border-b">Giảm giá (%)</th>
              <th className="px-4 py-2  text-center border-b">Đơn tối thiểu</th>
              <th className="px-4 py-2  text-center border-b">Giảm tối đa</th>
              <th className="px-4 py-2  text-center border-b">Ngày, giờ tạo</th>
              <th className="px-4 py-2  text-center border-b">Ngày hết hạn</th>
              <th className="px-4 py-2  text-center border-b">Số lượng</th>
              <th className="px-4 py-2  text-center border-b">Trạng thái</th>
              <th className="px-4 py-2  text-center border-b">Hình thức</th>
            </tr>
          </thead>
          <tbody>
            {currentVouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td className="px-4 py-2  text-center border-b">{voucher.code}</td>
                <td className="px-4 py-2 text-center border-b">
                  <span className="text-green-500 font-bold text-xl">{voucher.discount}%</span>
                </td>

                <td className="px-4 py-2  text-center border-b">{voucher.condition.toLocaleString()}đ</td>
                <td className="px-4 py-2  text-center border-b">{voucher.max_voucher_apply.toLocaleString()}đ</td>
                <td className="px-4 py-2 text-center border-b">
                  {voucher.created_date
                    ? new Intl.DateTimeFormat('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    }).format(new Date(voucher.created_date))
                    : '--'}
                </td>

                <td className="px-4 py-2 text-center border-b">
                  {voucher.expiration_date
                    ? new Intl.DateTimeFormat('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    }).format(new Date(voucher.expiration_date))
                    : '--'}
                </td>

                <td className="px-4 py-2  text-center border-b">{voucher.quantity}</td>
                <td className="px-4 py-2 text-center border-b">
                  <Switch
                    checked={voucher.status}
                    onChange={() => handleStatusToggle(voucher)}
                    className={`${voucher.status ? 'bg-green-500' : 'bg-yellow-500'} relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className={`${voucher.status ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition`} />
                  </Switch>
                </td>
                <td className="px-4 py-2 border-b">
                  {voucher.typeVoucher ? voucher.typeVoucher.nameTypeVoucher : 'Không có'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="flex justify-between items-center mt-4">
        <div>
          Hiển thị {currentVouchers.length} trong tổng số {filteredVouchers.length} vouchers
        </div>

        <div className="pagination-container">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            &lt;
          </button>
          {renderPagination()}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherList;
