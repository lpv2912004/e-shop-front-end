import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newVoucher, setNewVoucher] = useState({
    id: null,
    code: '',
    discount: '',
    created_date: '',
    expiration_date: '',
    quantity: '',
    status: 1
  });


  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, [currentPage]);

  const fetchVouchers = () => {
    const token = localStorage.getItem('jwtToken');
    axios
      .get('http://localhost:8080/admin/api/vouchers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setVouchers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error('Lỗi khi tải danh sách voucher!');
        setLoading(false);
      });
  };


  const validateForm = () => {
    let isValid = true;

    if (!newVoucher.code) {
      toast.error('Mã voucher là bắt buộc');
      isValid = false;
    }
    if (!newVoucher.discount || newVoucher.discount <= 0) {
      toast.error('Giảm giá phải lớn hơn 0');
      isValid = false;
    }
    if (!newVoucher.discount || newVoucher.discount > 100) {
      toast.error('Giảm giá phải nhỏ hơn 100');
      isValid = false;
    }
    if (!newVoucher.created_date) {
      toast.error('Ngày tạo là bắt buộc');
      isValid = false;
    }
    if (!newVoucher.expiration_date) {
      toast.error('Ngày hết hạn là bắt buộc');
      isValid = false;
    }
    if (newVoucher.created_date && newVoucher.expiration_date) {
      const createdDate = new Date(newVoucher.created_date);
      const expirationDate = new Date(newVoucher.expiration_date);

      if (expirationDate < createdDate) {
        toast.error('Ngày hết hạn không được nhỏ hơn ngày tạo');
        isValid = false;
      }
    }
    if (!newVoucher.quantity || newVoucher.quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      isValid = false;
    }

    return isValid;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {

      setNewVoucher({ ...newVoucher, [name]: value === "1" });
    } else {
      setNewVoucher({ ...newVoucher, [name]: value });
    }
  };



  const createVoucher = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('jwtToken');

    const formatDateToISO = (dateString) => {
      return dateString ? `${dateString}T00:00:00` : null;
    };

    const voucherData = {
      ...newVoucher,
      created_date: formatDateToISO(newVoucher.created_date),
      expiration_date: formatDateToISO(newVoucher.expiration_date),
      status: 0,
    };

    axios
      .post('http://localhost:8080/admin/api/vouchers', voucherData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success('Tạo voucher thành công!');
        fetchVouchers();
        resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error('Lỗi từ phía máy chủ: ' + error.response.data.message);
        } else {
          toast.error('Lỗi khi tạo voucher!');
        }
      });
  };

  const updateVoucher = () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('jwtToken');

    const formatDateToISO = (dateString) => {
      return dateString ? `${dateString}T00:00:00` : null;
    };

    const voucherData = {
      ...newVoucher,
      created_date: formatDateToISO(newVoucher.created_date),
      expiration_date: formatDateToISO(newVoucher.expiration_date),
      status: newVoucher.status,
    };

    axios
      .put(`http://localhost:8080/admin/api/vouchers/${newVoucher.id}`, voucherData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success('Chỉnh sửa voucher thành công!');
        console.log('Dữ liệu Flash Sale trước khi cập nhật:', voucherData);
        fetchVouchers();
        resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error('Lỗi từ phía máy chủ: ' + error.response.data.message);
        } else {
          toast.error('Lỗi khi chỉnh sửa voucher!');
        }
      });
  };

  // const deleteVoucher = (id) => {
  //   const token = localStorage.getItem('jwtToken');
  //   axios
  //     .delete(`http://localhost:8080/admin/api/vouchers/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then(() => {
  //       toast.success('Xóa voucher thành công!');
  //       fetchVouchers();
  //     })
  //     .catch(() => {
  //       toast.error('Lỗi khi xóa voucher!');
  //     });
  // };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const resetForm = () => {
    setNewVoucher({
      id: null,
      code: '',
      discount: '',
      created_date: '',
      expiration_date: '',
      quantity: '',
      status: 1,
    });
    setIsEditing(false);

  };

  const handleSave = async () => {
    if (isEditing) {
      await updateVoucher();
    } else {
      await createVoucher();
    }
  };

  const editVoucher = (voucher) => {
    setNewVoucher({
      id: voucher.id,
      code: voucher.code,
      discount: voucher.discount,
      created_date: voucher.created_date.split('T')[0],
      expiration_date: voucher.expiration_date.split('T')[0],
      quantity: voucher.quantity,
      status: voucher.status,
    });
    setIsEditing(true);
  };

  const totalPages = Math.ceil(vouchers.length / itemsPerPage);
  const currentVouchers = vouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* <ToastContainer /> */}
      <Toaster richColors position="top-right" />
      <h2 className="text-2xl font-bold mb-6">Quản lý Voucher</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Chỉnh sửa Voucher' : 'Tạo mới Voucher'}</h3>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              name="code"
              placeholder="Mã Voucher"
              className={`border px-4 py-2 w-full `}
              value={newVoucher.code}
              onChange={handleChange}
            />

          </div>
          <div>
            <input
              type="number"
              name="discount"
              placeholder="Giảm giá"
              className={`border px-4 py-2 w-full`}
              value={newVoucher.discount}
              onChange={handleChange}
            />

          </div>
          <div>
            <input
              type="date"
              name="created_date"
              className={`border px-4 py-2 w-full`}
              value={newVoucher.created_date}
              onChange={handleChange}
            />

          </div>
          <div>
            <input
              type="date"
              name="expiration_date"
              className={`border px-4 py-2 w-full `}
              value={newVoucher.expiration_date}
              onChange={handleChange}
            />

          </div>
          <div>
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              className={`border px-4 py-2 w-full `}
              value={newVoucher.quantity}
              onChange={handleChange}
            />

          </div>
          <div>
            <select
              name="status"
              value={newVoucher.status ? "1" : "0"}
              onChange={handleChange}
              className="border px-4 py-2 mb-2"
            >
              <option value="0">Không hoạt động</option>
              <option value="1">Hoạt động</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleSave}
            >
              {isEditing ? 'Lưu thay đổi' : 'Tạo Voucher'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
                onClick={resetForm}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-3 border-b">Mã</th>
                <th className="px-4 py-3 border-b">Giảm giá</th>
                <th className="px-4 py-3 border-b">Ngày tạo</th>
                <th className="px-4 py-3 border-b">Ngày hết hạn</th>
                <th className="px-4 py-3 border-b">Số lượng</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentVouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td className="px-4 py-2 border-b">{voucher.code}</td>
                  <td className="px-4 py-2 border-b">{voucher.discount}%</td>
                  <td className="px-4 py-2 border-b">{formatDate(voucher.created_date)}</td>
                  <td className="px-4 py-2 border-b">{formatDate(voucher.expiration_date)}</td>
                  <td className="px-4 py-2 border-b">{voucher.quantity}</td>
                  <td className="px-4 py-2 border-b">{voucher.status === true ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => editVoucher(voucher)}
                    >
                      Sửa
                    </button>
                    {/* <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => deleteVoucher(voucher.id)}
                    >
                      Xóa
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              Trang trước
            </button>
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => setCurrentPage(num + 1)}
                className={`px-4 py-2 ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {num + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherManagement;
