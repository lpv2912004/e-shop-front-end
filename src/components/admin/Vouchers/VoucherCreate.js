import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { toast, Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSync, AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';

const VoucherCreate = () => {
  const history = useHistory();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseEnter2 = () => {
    setShowTooltip2(true);
  };

  const handleMouseLeave2 = () => {
    setShowTooltip2(false);
  };
  const [voucher, setVoucher] = useState({
    code: '',
    discount: '',
    description: '',
    created_date: '',
    expiration_date: '',
    quantity: '',
    status: 1,
    typeVoucher: '',
    condition: '',
    max_voucher_apply: '',
    displayOnWebsite: true,
  });

  const [voucherTypes, setVoucherTypes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios
      .get('http://localhost:8080/admin/api/typeVouchers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setVoucherTypes(response.data);
      })
      .catch(() => {
        toast.error('Lỗi khi tải loại voucher!');
      });
  }, []);

  const handleGoBack = () => {
    history.push('/admin/vouchers-main');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Chỉ cập nhật state với giá trị nhập vào mà không thay đổi định dạng
    setVoucher({ ...voucher, [name]: value });
  };

  const checkDuplicateCode = async (code) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get(`http://localhost:8080/admin/api/vouchers/check-code/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.exists; // Return true if the code exists
    } catch (error) {
      toast.error('Lỗi khi kiểm tra mã khuyến mãi!');
      return false; // Default to false if there's an error
    }
  };
  
  const validateForm = () => {
    if (!voucher.code) {
      toast.error('Mã Khuyến Mãi không được để trống!');
      return false;
    }
    if (!voucher.typeVoucher) {
      toast.error('Loại Khuyến Mãi không được để trống!');
      return false;
    }
    if (!voucher.created_date || !voucher.expiration_date) {
      toast.error('Thời Gian Hiệu Lực không được để trống!');
      return false;
    }
    if (new Date(voucher.created_date) > new Date(voucher.expiration_date)) {
      toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return false;
    }
    if (!voucher.discount) {
      toast.error('Giảm giá(%) không được để trống!');
      return false;
    }
    if (!voucher.max_voucher_apply) {
      toast.error('Giảm giá(%) không được để trống!');
      return false;
    }
    if (!voucher.condition) {
      toast.error('Giảm giá (VNĐ) không được để trống!');
      return false;
    }
    if (!voucher.discount || isNaN(voucher.discount) || voucher.discount <= 0 || voucher.discount > 100) {
      toast.error('Giảm giá (%) phải là số dương và không được lớn hơn 100!');
      return false;
    }
    if (!voucher.condition || isNaN(voucher.condition) || voucher.condition <= 0) {
      toast.error('Giảm giá (VNĐ) phải là số dương');
      return false;
    }
    if (!voucher.max_voucher_apply || isNaN(voucher.max_voucher_apply) || voucher.max_voucher_apply <= 0) {
      toast.error('Giảm giá (VNĐ) phải là số dương');
      return false;
    }
    if (!voucher.quantity || isNaN(voucher.quantity)) {
      toast.error('Số lượng phải là một số!');
      return false;
    }
    if (!voucher.quantity || isNaN(voucher.quantity) || voucher.quantity <= 0) {
      toast.error('Số lượng phải là một số dương!');
      return false;
    }
    return true;
  };
  

  const handleCreate = async  () => {
    const isCodeDuplicate = await checkDuplicateCode(voucher.code);
    if (isCodeDuplicate) {
      toast.error('Mã Khuyến Mãi đã tồn tại!');
      return;
    }
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('jwtToken');

    // Chuyển đổi thời gian nhập về đúng múi giờ GMT+7 (Việt Nam)
    const createdDateVietnam = new Date(voucher.created_date);
    createdDateVietnam.setHours(createdDateVietnam.getHours()); // Thêm 7 giờ để chuyển đổi về GMT+7

    const expirationDateVietnam = new Date(voucher.expiration_date);
    expirationDateVietnam.setHours(expirationDateVietnam.getHours()); // Thêm 7 giờ để chuyển đổi về GMT+7

    const voucherData = {
      ...voucher,
      created_date: createdDateVietnam.toISOString(), // Chuyển đổi sang định dạng ISO
      expiration_date: expirationDateVietnam.toISOString(), // Chuyển đổi sang định dạng ISO
      typeVoucher: {
        id: voucher.typeVoucher,
      },
    };

    axios
      .post('http://localhost:8080/admin/api/vouchers', voucherData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success('Tạo voucher thành công!');
        history.push('/admin/vouchers-main');
      })
      .catch(() => {
        toast.error('Lỗi khi tạo voucher!');
      });
  };


  const generateAutoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAutoGenerateCode = () => {
    const autoCode = generateAutoCode();
    setVoucher({ ...voucher, code: autoCode });
  };

  const handleSwitchChange = () => {
    setVoucher({ ...voucher, displayOnWebsite: !voucher.displayOnWebsite });
  };

  const handleStatusChange = () => {
    setVoucher({ ...voucher, status: voucher.status === 1 ? 0 : 1 });
  };
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '--';
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Đặt hour12 là false để sử dụng định dạng 24 giờ
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
      {/* <ToastContainer /> */}
      <Toaster richColors position="top-right" />
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold flex items-center text-blue-600">
          Tạo Voucher

        </h2>

        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleGoBack}
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 rounded-lg">
        {/* Form Section */}
        <div className="col-span-2">
          <form className="space-y-4">
            <div>
              <label className="block font-medium">Mã Khuyến Mãi</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="code"
                  className="border px-4 py-2 w-full"
                  value={voucher.code}
                  onChange={handleChange}
                  placeholder="Nhập mã khuyến mãi"
                />
                <button
                  type="button"
                  className="ml-4 text-blue-500 flex text-center"
                  onClick={handleAutoGenerateCode}
                >
                  <AiOutlineSync className="w-5 h-5 mr-2 flex" />
                  Mã
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium">Loại Khuyến Mãi</label>
              <select
                name="typeVoucher"
                value={voucher.typeVoucher}
                onChange={handleChange}
                className="border px-4 py-2 w-full"
              >
                <option value="">Chọn loại...</option>
                {voucherTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nameTypeVoucher}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block font-medium">Thời Gian Hiệu Lực</label>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="created_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={voucher.created_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="expiration_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={voucher.expiration_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div> */}
            <div>
              <label className="block font-medium">Thời Gian Hiệu Lực</label>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="created_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={voucher.created_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="expiration_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={voucher.expiration_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium">Giảm giá (%)</label>
              <input
                type="number"
                name="discount"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={voucher.discount}
                onChange={handleChange}
                placeholder="Nhập phần trăm giảm giá"
              />
            </div>
            <div>
              <label className="block font-medium">Đơn hàng tối thiểu (VNĐ)</label>
              <input
                type="number"
                name="condition"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={voucher.condition}
                onChange={handleChange}
                placeholder="Nhập số tiền để áp dụng voucher"
              />
            </div>

            <div>
              <label className="block font-medium">Giảm tối đa (VNĐ)</label>
              <input
                type="number"
                name="max_voucher_apply"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                value={voucher.max_voucher_apply}
                onChange={handleChange}
                placeholder="Nhập số tiền để áp dụng voucher"
              />
            </div>

            <div>
              <label className="block font-medium">Số lượng</label>
              <input
                type="number"
                name="quantity"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={voucher.quantity}
                onChange={handleChange}
                placeholder="Nhập số lượng"
              />
            </div>

            <div>
              <label className="block font-medium">Mô tả</label>
              <textarea
                name="description"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={voucher.description}
                onChange={handleChange}
                placeholder="Nhập mô tả"
              />
            </div>
          </form>
        </div>

        {/* Summary Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center mb-2">Tóm tắt</h3>

          <div className="relative inline-block">
            <span className="text-lg font-semibold mb-4">Hình thức:</span>
            <span
              className="ml-1 text-blue-500 cursor-pointer"
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
            >
              ?
            </span>
            {showTooltip2 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-blue-400 text-white text-xs p-2 rounded z-10 w-48 text-center">
                Chọn loại khuyến mãi. Ví dụ: 'FREESHIP' là giảm giá vận chuyển, 'ORDER' là giảm giá dựa trên tổng giá trị đơn hàng.
              </div>
            )}
          </div>

          <p>
            {voucherTypes.find((type) => type.id === Number(voucher.typeVoucher))?.nameTypeVoucher || '--'}
          </p>

          <p><strong>Thời hạn:</strong></p>
          <div>
            <p>
              {voucher.created_date ? `Có hiệu lực từ ${formatDateTime(voucher.created_date)}` : '--'}
              {voucher.expiration_date && ` đến ${formatDateTime(voucher.expiration_date)}`}
            </p>
          </div>
          <p><strong>Chi tiết:</strong></p>
          <p>
             Giảm {voucher.discount}%, 
             tối đa {Number(voucher.max_voucher_apply)?.toLocaleString("vi-VN") || "0"} Đồng, 
             đơn hàng tối thiểu {Number(voucher.condition)?.toLocaleString("vi-VN") || "0"} Đồng
          </p>

          <p>Số lượng voucher: {voucher.quantity}</p>
          <p>{voucher.description || '--'}</p>


          <div className="flex items-center mt-6">
            <Switch
              checked={voucher.status === 1}
              onChange={handleStatusChange}
              className={`${voucher.status === 1 ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className={`${voucher.status === 1 ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition`} />
            </Switch>
            <div className="relative inline-block">
              <span className="ml-2 text-gray-700">Hiển thị trên website</span>
              <span
                className="relative ml-1 inline-block cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-blue-500">?</span>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-blue-400 text-white text-xs p-2 rounded z-10 w-48 text-center">
                    Hiển thị trên website. Là hiển thị voucher này lên trang web và người dùng có thể sử dụng, có 2 trạng thái bật và tắt.
                  </div>
                )}
              </span>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          type="button"
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition flex"
        >
          <AiOutlinePlus className="w-5 h-5 mr-2" />
          Tạo Voucher
        </button>


      </div>
    </div>
  );
};

export default VoucherCreate;
