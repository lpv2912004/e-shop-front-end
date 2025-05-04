// OrderDetails.js
import React from 'react';

const OrderDetails = ({ orderId, details }) => {
  return (
    <div className="flex justify-between space-x-4">
      <div className="w-1/2">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th colSpan="2" className="px-4 py-3 bg-gray-200 text-left font-bold">
                Chi tiết đơn hàng #{orderId}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">Tên người đặt:</td>
              <td className="px-4 py-2 border">{details.userFullName || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Email:</td>
              <td className="px-4 py-2 border">{details.userEmail || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Số điện thoại:</td>
              <td className="px-4 py-2 border">{details.userPhone || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Địa chỉ:</td>
              <td className="px-4 py-2 border">{details.shippingAddress || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Phương thức thanh toán:</td>
              <td className="px-4 py-2 border">{details.paymentMethod || 'N/A'}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Phí vận chuyển:</td>
              <td className="px-4 py-2 border">{details.deliveryFee?.toLocaleString() || 'N/A'} VNĐ</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">Tổng tiền thanh toán:</td>
              <td className="px-4 py-2 border">{details.totalCash?.toLocaleString() || 'N/A'} VNĐ</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <div className="w-1/2">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-200 text-left font-bold" colSpan="2">
                Sản phẩm đã mua
              </th>
            </tr>
          </thead>
          <tbody>
            {details.orderDetails?.map((detail, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="px-4 py-2 border">Tên sản phẩm:</td>
                  <td className="px-4 py-2 border">{detail.productName}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Màu sắc:</td>
                  <td className="px-4 py-2 border flex items-center space-x-2">
                    <span
                      className="w-4 h-4 rounded-full inline-block"
                      style={{ backgroundColor: detail.variantName }}
                    ></span>
                    <span>{detail.variantName}</span>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-2 border">Kích thước:</td>
                  <td className="px-4 py-2 border">{detail.variantSize}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Đơn giá:</td>
                  <td className="px-4 py-2 border">{detail.price?.toLocaleString()} VNĐ</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Số lượng:</td>
                  <td className="px-4 py-2 border">{detail.quantity}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Giảm giá Flash Sale:</td>
                  <td className="px-4 py-2 border">{detail.discount_FS || 'không có'} %</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Giảm giá voucher:</td>
                  <td className="px-4 py-2 border">{detail.discount_voucher || 'không có'} %</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Tên Flash Sale:</td>
                  <td className="px-4 py-2 border">{detail.name_FS || 'không có'}</td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div> */}

      <div className="w-1/2">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-200 text-left font-bold" colSpan="2">
                  Sản phẩm đã mua
                </th>
              </tr>
            </thead>
            <tbody>
              {details.orderDetails?.map((detail, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="px-4 py-2 border">Tên sản phẩm:</td>
                    <td className="px-4 py-2 border">{detail.productName}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Màu sắc:</td>
                    <td className="px-4 py-2 border flex items-center space-x-2">
                      <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: detail.variantName }}
                      ></span>
                      <span>{detail.variantName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Kích thước:</td>
                    <td className="px-4 py-2 border">{detail.variantSize}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Đơn giá:</td>
                    <td className="px-4 py-2 border">{detail.price?.toLocaleString()} VNĐ</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Số lượng:</td>
                    <td className="px-4 py-2 border">{detail.quantity}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Giảm giá Flash Sale:</td>
                    <td className="px-4 py-2 border">{detail.discount_FS || 'không có'} %</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Giảm giá voucher:</td>
                    <td className="px-4 py-2 border">{detail.discount_voucher || 'không có'} %</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Tên Flash Sale:</td>
                    <td className="px-4 py-2 border">{detail.name_FS || 'không có'}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default OrderDetails;
