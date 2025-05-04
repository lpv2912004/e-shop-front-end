import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import { Switch } from '@headlessui/react';

import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';

const FlashSaleManagement = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const history = useHistory();

  useEffect(() => {
    fetchFlashSales();
  }, [currentPage]);

  const fetchFlashSales = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast.error('Token không tồn tại! Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8080/admin/api/flashsales', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFlashSales(response.data || []); // Default to an empty array if no data is returned
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Lỗi khi tải danh sách Flash Sale!');
      });
  };
  const handleFlashSaleClick = (id) => {
    history.push(`/admin/flash-detail/${id}`); // Điều hướng đến trang chi tiết
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  const handleStatusToggle = (id, newStatus) => {
    const token = localStorage.getItem('jwtToken');

    axios
      .put(`http://localhost:8080/admin/api/flashsales/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        // Cập nhật lại trạng thái flashSale trong UI nếu thành công
        setFlashSales(prevFlashSales =>
          prevFlashSales.map(flashSale =>
            flashSale.id === id ? { ...flashSale, status: newStatus } : flashSale
          )
        );
        toast.success('Cập nhật trạng thái thành công!');
      })
      .catch((error) => {
        toast.error('Lỗi khi cập nhật trạng thái!');
        console.error(error);
      });
  };


  // Filter flash sales based on the active tab and search term
  const filteredFlashSales = (flashSales || [])
    .filter((flashSale) => {
      if (activeTab === 'Tất cả') return true;
      if (activeTab === 'Đã kích hoạt') return flashSale.status === true;
      if (activeTab === 'Chưa kích hoạt') return flashSale.status === false;
      return true;
    })
    .filter((flashSale) => {
      return flashSale?.name_FS?.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const totalPages = Math.ceil(filteredFlashSales.length / itemsPerPage);

  const displayedFlashSales = filteredFlashSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }




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
    <div className="p-6 bg-white shadow rounded-lg">
            <Toaster position="top-right"/>
      <h2 className="text-2xl font-bold mb-6">Danh sách khuyến mãi</h2>


      <div className="flex space-x-4 mb-6">
        <button
          className={` tab-button  px-4 py-2 ${activeTab === 'Tất cả' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleTabClick('Tất cả')}
        >
          Tất cả khuyến mãi
        </button>
        <button
          className={`tab-button  px-4 py-2 ${activeTab === 'Đã kích hoạt' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleTabClick('Đã kích hoạt')}
        >
          Đã kích hoạt
        </button>
        <button
          className={`tab-button  px-4 py-2 ${activeTab === 'Chưa kích hoạt' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleTabClick('Chưa kích hoạt')}
        >
          Chưa kích hoạt
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="text-center items-center space-x-4 flex">

          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

          />
        </div>
        <button onClick={() => history.push('/admin/flash-create')} className="bg-blue-500 text-white px-4 tab-button flex">
          <AiOutlinePlus className="w-5 h-5 mr-2" />
          Tạo khuyến mãi
        </button>
      </div>

      {/* bảng */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border ">
          <thead>
            <tr className='table-header'>
              <th className="px-4 py-2 border-b">Mã</th>
              <th className="px-4 py-2 border-b ">Khuyến mãi</th>
              <th className="px-4 py-2 border-b">Ngày bắt đầu</th>
              <th className="px-4 py-2 border-b">Ngày kết thúc</th>
              <th className="px-4 py-2 border-b">Giảm giá (%)</th>
              <th className="px-4 py-2 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {displayedFlashSales.map((flashSale) => (
              <tr className='px-4 py-2 border-b text-center' key={flashSale.id}>
                <td onClick={() => handleFlashSaleClick(flashSale.id)}
                  className="cursor-pointer   px-4 py-2 border-b text-blue-500 hover:underline">{flashSale.id}  </td>
                <td
                  key={flashSale.id}
                  onClick={() => handleFlashSaleClick(flashSale.id)}
                  className="cursor-pointer   px-4 py-2 border-b text-blue-500 hover:underline"
                >
                  {flashSale.name_FS}
                </td>

                <td className="px-4 py-2 border-b">
                  {flashSale.activitySales[0]?.createdDate
                    ? new Intl.DateTimeFormat('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    }).format(new Date(flashSale.activitySales[0].createdDate))
                    : '--'}
                </td>

                <td className="px-4 py-2 border-b">
                  {flashSale.activitySales[0]?.expirationDate
                    ? new Intl.DateTimeFormat('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Ho_Chi_Minh'
                    }).format(new Date(flashSale.activitySales[0].expirationDate))
                    : '--'}
                </td>



                <td className="px-4 py-2 border-b">
                  Giảm giá {flashSale.activitySales[0]?.discountPercent || '--'}% cho {flashSale.activitySales.length} sản phẩm
                </td>


                <td className="px-4 py-2 border-b">
                  <Switch
                    checked={flashSale.status}
                    onChange={() => handleStatusToggle(flashSale.id, flashSale.status ? 0 : 1)}
                    className={`${flashSale.status ? 'bg-green-500' : 'bg-gray-300'
                      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none`}
                  >
                    <span
                      className={`${flashSale.status ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
                    />
                  </Switch>


                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Hiển thị {displayedFlashSales.length} trong tổng số {filteredFlashSales.length} khuyến mãi
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

export default FlashSaleManagement;
