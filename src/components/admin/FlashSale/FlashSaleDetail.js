import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSync, AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';

const FlashSaleDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [flashSale, setFlashSale] = useState(null); // Dữ liệu chương trình giảm giá
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    // Hàm lấy chi tiết chương trình giảm giá
    const fetchFlashSaleDetail = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get(`http://localhost:8080/admin/api/flashsales/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlashSale(response.data); // Lưu dữ liệu chương trình vào state
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết chương trình:', error);
        toast.error('Không thể tải chi tiết chương trình');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleDetail(); // Gọi API khi component được render
  }, [id]);

  // Hàm xóa hoạt động giảm giá
  const handleDeleteActivity = async (activityId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`http://localhost:8080/admin/api/flashsales/activity/${activityId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Sau khi xóa, cập nhật lại danh sách hoạt động
      setFlashSale({
        ...flashSale,
        activitySales: flashSale.activitySales.filter((activity) => activity.id !== activityId),
      });
      toast.success('Đã xóa hoạt động thành công');
    } catch (error) {
      console.error('Lỗi khi xóa hoạt động:', error);
      toast.error('Lỗi khi xóa hoạt động');
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (!flashSale) {
    return <p>Không tìm thấy chương trình</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Chi Tiết Chương Trình Giảm Giá</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-semibold text-blue-500">{flashSale.name_FS}</h3>
        <div className="border-t border-gray-200 py-4">
          <h4 className="text-lg font-semibold text-gray-700">Thông Tin Hoạt Động</h4>
          <ul className="mt-4 space-y-4">
            {flashSale.activitySales.map((activity) => (
              <li key={activity.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">
                      <strong>Mã :</strong> {activity.id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Giảm giá:</strong> {activity.discountPercent}%
                    </p>
                    <p className="text-gray-700">
                      <strong>Sản phẩm:</strong> {activity.variantProductName} (Màu:
                      <span className="inline-flex items-center space-x-1">
                        <span
                          className="w-4 h-4 rounded-full inline-block"
                          style={{ backgroundColor: activity.color }}
                        ></span>
                        <span>{activity.color}</span>
                      </span>, Kích cỡ: {activity.size})
                    </p>

                    <p className="text-gray-700">
                      <strong>Ngày bắt đầu:</strong>{' '}
                      {new Date(activity.createdDate).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </p>
                    <p className="text-gray-700">
                      <strong>Ngày kết thúc:</strong>{' '}
                      {new Date(activity.expirationDate).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </p>

                    {/* Hiển thị ảnh sản phẩm */}
                    {activity.imageUrl && (
                      <div className="mt-4 ">
                        <img
                          src={activity.imageUrl}
                          alt={activity.variantProductName}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition flex"
                  >
                    <AiOutlineDelete className="w-5 h-5 mr-2" /> Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>

      <button
        onClick={() => history.push('/admin/flash')}
        className="mt-6 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
      >
        Quay lại
      </button>
    </div>
  );
};

export default FlashSaleDetail;
