// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import { useHistory, useParams } from 'react-router-dom';
// import { toast, Toaster } from 'sonner';
// import 'react-toastify/dist/ReactToastify.css';
// const AdminOrderManagement = () => {
//   const history = useHistory();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrderId, setExpandedOrderId] = useState(null);
//   const [orderDetails, setOrderDetails] = useState({});
//   const [activeTab, setActiveTab] = useState('Tất cả');
//   const [orderStatusOptions, setOrderStatusOptions] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [orderToUpdate, setOrderToUpdate] = useState(null);
//   const [statusToUpdate, setStatusToUpdate] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 5;
//   const [cancelReason, setCancelReason] = useState('');
//   const [orderToCancel, setOrderToCancel] = useState(null);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [otherReason, setOtherReason] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem('jwtToken');
//       try {
//         const response = await axios.get('http://localhost:8080/admin/api/orders', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         const reversedOrders = response.data.reverse();
//         setOrders(reversedOrders);


//         // Lấy thông tin chi tiết của tất cả đơn hàng ngay sau khi tải danh sách đơn hàng
//         const orderIds = response.data.map(order => order.orderId);
//         const orderDetailsPromises = orderIds.map(orderId =>
//           axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         );

//         const orderDetailsResponses = await Promise.all(orderDetailsPromises);
//         const newOrderDetails = orderDetailsResponses.reduce((acc, response) => {
//           acc[response.data.orderId] = response.data;
//           return acc;
//         }, {});

//         setOrderDetails(newOrderDetails); // Lưu thông tin chi tiết 
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching orders or order details:', error);
//         setLoading(false);
//       }
//     };

//     const fetchOrderStatusOptions = async () => {
//       try {
//         const token = localStorage.getItem('jwtToken');
//         const response = await axios.get('http://localhost:8080/admin/api/states', {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         setOrderStatusOptions(response.data);
//       } catch (error) {
//         console.error('Error fetching order status options:', error);
//       }
//     };

//     fetchOrders();
//     fetchOrderStatusOptions();
//   }, []);



//   const handleStatusChange = (order, status) => {
//     const validStatuses = getValidStatuses(order.orderStatus);

//     if (!validStatuses.includes(status)) {
//       alert(`Không thể chuyển từ trạng thái "${order.orderStatus}" sang trạng thái "${status}"`);
//       return;
//     }

//     // Nếu trạng thái là "Đã hủy", hiện modal và lưu thông tin đơn hàng cần hủy
//     if (status === "Đã hủy") {
//       setOrderToCancel(order);
//       setStatusToUpdate(status);
//       setShowCancelModal(true);
//     } else {
//       // Với các trạng thái khác
//       setOrderToUpdate(order);
//       setStatusToUpdate(status);
//       setShowModal(true);
//     }
//   };


//   const confirmStatusUpdate = async () => {
//     if (orderToUpdate && statusToUpdate) {
//       const token = localStorage.getItem('jwtToken');


//       const selectedState = orderStatusOptions.find(
//         (status) => status.name_status_order === statusToUpdate
//       );

//       if (!selectedState) {
//         alert("Trạng thái không hợp lệ");
//         return;
//       }

//       const payload = {
//         state: {
//           id: selectedState.id,
//         },
//       };

//       console.log("Sending payload:", payload); // Để kiểm tra dữ liệu trước khi gửi

//       try {
//         const response = await axios.put(
//           `http://localhost:8080/admin/api/orders/${orderToUpdate.orderId}`,
//           payload, // Gửi dữ liệu payload với stateId
//           { headers: { Authorization: `Bearer ${token}` } }
//         );


//         //phan gui thong bao day -------------------------------------------------------------------
//         const tokenDevice = await axios.post('http://localhost:8080/admin/api/sendtoken/device',
//           { order: orderToUpdate.orderId }, { headers: { Authorization: `Bearer ${token}` } })
//         console.log("thiet bi token la: ", tokenDevice)
//         // Lấy token admin từ sessionStorage
//         const adminToken = sessionStorage.getItem('FCMToken');

//         if (adminToken) {
//           const messageData = {
//             token: tokenDevice.data,
//             title: "Thông báo mới",
//             body: `Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`,
//           };

//           axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//           )
//             .then((response) => {
//               if (response) {
//                 //create notify to admin 
//                 axios.post('http://localhost:8080/user/api/notify/createNotifyToUser', { mess: `Thông báo mới! Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`, idOrder: orderToUpdate.orderId }, {
//                   headers: {
//                     'Authorization': `Bearer ${token}`
//                   }
//                 }).then((response) => {
//                   console.log("da tao moi thong bao den admin")
//                 })
//               }
//             })
//             .catch((error) => {
//               console.log("Error sending message:", error);
//             });
//         }
//         //-------------------------------------------------------------------


//         console.log("API response:", response.data);
//         toast.success('Cập nhật trạng thái thành công');
//         setTimeout(() => {
//           history.push('/admin/orders');
//         }, 1500);


//         // Cập nhật danh sách đơn hàng trong giao diện
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order.orderId === orderToUpdate.orderId
//               ? { ...order, orderStatus: statusToUpdate }
//               : order
//           )
//         );
//       } catch (error) {
//         console.error("Error updating order status:", error.response ? error.response.data : error.message);
//         toast.error('Cập nhật trạng thái thất bại');
//       }

//       setShowModal(false);
//       setOrderToUpdate(null);
//       setStatusToUpdate("");
//     }
//   };



//   const getValidStatuses = (currentStatus) => {
//     switch (currentStatus) {
//       case "Đang chờ xử lý":
//         return ["Đã hủy", "Đã xác nhận"];
//       case "Đã xác nhận":
//         return ["Đã đóng gói", "Đang giao hàng"];
//       case "Đã đóng gói":
//         return ["Đang giao hàng"];
//       case "Đang giao hàng":
//         return ["Đã giao", "Đã trả lại"];
//       case "Đã giao":
//         return [];
//       case "Đã trả lại":
//         return ["Đã hoàn tiền"];
//       default:
//         return [];
//     }
//   };


//   const toggleDetails = async (orderId) => {
//     if (expandedOrderId === orderId) {
//       setExpandedOrderId(null);
//     } else {
//       if (!orderDetails[orderId]) {
//         const token = localStorage.getItem('jwtToken');
//         try {
//           const response = await axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           });
//           setOrderDetails(prevDetails => ({ ...prevDetails, [orderId]: response.data }));
//         } catch (error) {
//           console.error('Error fetching order details:', error);
//         }
//       }
//       setExpandedOrderId(orderId);
//     }
//   };


//   const confirmCancelOrder = async () => {
//     console.log("Order to cancel:", orderToCancel);
//     console.log("Cancel reason:", cancelReason);
//     console.log("Confirm cancel order triggered");

//     if (orderToCancel && cancelReason) {
//       const token = localStorage.getItem('jwtToken');

//       // Đóng modal và reset trạng thái trước khi gửi yêu cầu
//       setShowCancelModal(false);
//       setCancelReason('');
//       setOrderToCancel(null);

//       try {
//         const response = await axios.post(
//           `http://localhost:8080/admin/api/orders/${orderToCancel.orderId}/cancel`,
//           { reason: cancelReason },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Thông báo hủy đơn hàng thành công và email sẽ được gửi sau

//         console.log('API Response:', response.data);

//         //phan gui thong bao day -------------------------------------------------------------------
//         const tokenDevice = await axios.post('http://localhost:8080/admin/api/sendtoken/device',
//           { order: orderToUpdate.orderId }, { headers: { Authorization: `Bearer ${token}` } })

//         // Lấy token admin từ sessionStorage
//         const adminToken = sessionStorage.getItem('FCMToken');

//         if (adminToken) {
//           const messageData = {
//             token: tokenDevice.data,
//             title: "Thông báo mới",
//             body: `Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`,
//           };
//           console.log(messageData)
//           axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//           )
//             .then((response) => {
//               console.log("Successfully sent message:", response.data);
//             })
//             .catch((error) => {
//               console.log("Error sending message:", error);
//             });
//         }
//         //-------------------------------------------------------------------

//         // Fetch lại dữ liệu đơn hàng ngay lập tức mà không chờ đợi việc gửi mail
//         fetchOrders();
//       } catch (error) {
//         // Thông báo hủy đơn hàng thành công và email sẽ được gửi sau
//         toast.success('Đã hủy đơn hàng và email sẽ được gửi sau ít phút ');


//         // Fetch lại dữ liệu đơn hàng ngay lập tức mà không chờ đợi việc gửi mail
//         fetchOrders();
//       }
//     } else {
//       console.log("Order or reason missing");
//     }
//   };




//   const fetchOrders = async () => {
//     const token = localStorage.getItem('jwtToken');
//     try {
//       const response = await axios.get('http://localhost:8080/admin/api/orders', {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const reversedOrders = response.data.reverse();
//       setOrders(reversedOrders);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);


//   const filteredOrders = activeTab === 'Tất cả'
//     ? orders
//     : orders.filter(order => order.orderStatus === activeTab);

//   // Phân trang dựa trên filteredOrders
//   const searchedOrders = filteredOrders.filter(order =>
//     order.orderId.toString().toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = searchedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalPages = Math.ceil(searchedOrders.length / ordersPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-2 text-gray-800">Quản lý đơn hàng</h2>
//       <input
//         type="text"
//         placeholder="Tìm theo mã đơn hàng..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="border mb-6 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       {/* Tab navigation for filtering orders by status */}
//       <div className="mb-4">
//         <ul className="flex space-x-4 text-sm">
//           <li
//             className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === 'Tất cả' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//             onClick={() => setActiveTab('Tất cả')}
//           >
//             Tất cả
//           </li>
//           {orderStatusOptions.map((status) => (
//             <li
//               key={status.id}
//               className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === status.name_status_order ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
//               onClick={() => setActiveTab(status.name_status_order)}
//             >
//               {status.name_status_order}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <Toaster position="top-right" />
//       {/* Display orders based on selected tab */}
//       <div className="overflow-x-auto">
//         {currentOrders.length > 0 ? (
//           <table className="min-w-full bg-white border">
//             <thead className="table-header">
//               <tr>
//                 <th className="px-4 py-3 border-b">Mã đơn hàng</th>
//                 <th className="px-4 py-3 border-b">Tên người đặt</th>
//                 <th className="px-4 py-3 border-b">Phí vận chuyển</th>
//                 <th className="px-4 py-3 border-b">Tổng tiền</th>
//                 <th className="px-4 py-3 border-b">Trạng thái</th>
//                 <th className="px-4 py-3 border-b">Thời gian đặt</th>
//                 <th className="px-4 py-3 border-b">Hành động</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentOrders.map((order, index) => (
//                 <React.Fragment key={order.orderId}>
//                   <tr key={order.orderId} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
//                     {/* Mã đơn hàng */}
//                     <td className="px-6 py-4 border-b">{order.orderId}</td>

//                     <td className="px-6 py-4 border-b">
//                       {orderDetails[order.orderId]?.userFullName || "N/A"}
//                     </td>

//                     {/* Phí vận chuyển */}
//                     <td className="px-6 py-4 border-b">{order.deliveryFee?.toLocaleString() || 'N/A'} VNĐ</td>

//                     {/* Tổng tiền */}
//                     <td className="px-6 py-4 border-b">{order.totalCash?.toLocaleString() || 'N/A'} VNĐ</td>

//                     {/* Trạng thái */}
//                     <td className="px-6 py-4 border-b">
//                       <div className="status-container">
//                         <select
//                           value={order.orderStatus}
//                           onChange={(e) => handleStatusChange(order, e.target.value)}
//                           className="select-status"
//                         >
//                           <option value={order.orderStatus}>{order.orderStatus}</option>
//                           {getValidStatuses(order.orderStatus).map((status) => (
//                             <option key={status} value={status}>
//                               {status}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </td>

//                     {/* Thời gian đặt từ orderDetails */}
//                     <td className="px-6 py-4 border-b">
//                       {orderDetails[order.orderId]?.createdDate
//                         ? (() => {
//                           const orderDate = new Date(orderDetails[order.orderId].createdDate);
//                           const now = new Date();
//                           const timeDifference = Math.floor((now - orderDate) / 1000);

//                           const days = Math.floor(timeDifference / (3600 * 24));
//                           const hours = Math.floor((timeDifference % (3600 * 24)) / 3600);
//                           const minutes = Math.floor((timeDifference % 3600) / 60);
//                           const seconds = timeDifference % 60;

//                           if (days > 0) {
//                             return `${days} ngày trước`;
//                           } else if (hours > 0) {
//                             return `${hours} giờ trước`;
//                           } else if (minutes > 0) {
//                             return `${minutes} phút trước`;
//                           } else {
//                             return `${seconds} giây trước`;
//                           }
//                         })()
//                         : "N/A"}
//                     </td>

//                     <td className="px-6 py-4 border-b">
//                       <button
//                         onClick={() => toggleDetails(order.orderId)}
//                         className="bg-blue-500 text-white px-3 py-2 text-xs font-medium rounded-lg shadow-sm hover:bg-blue-600 transition duration-300 ease-in-out"
//                       >
//                         {expandedOrderId === order.orderId ? 'Ẩn' : 'Chi tiết'}
//                       </button>
//                     </td>

//                   </tr>
//                   {expandedOrderId === order.orderId && orderDetails[order.orderId] && (
//                     <tr className="bg-gray-50 transition-all ease-out duration-500">
//                       <td colSpan="8" className="px-6 py-4">
//                         <div className="flex justify-between space-x-4">
//                           <div className="w-1/2">
//                             <table className="min-w-full bg-white border">
//                               <thead>
//                                 <tr>
//                                   <th colSpan="2" className="px-4 py-3 bg-gray-200 text-left font-bold">Chi tiết đơn hàng #{order.orderId}</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                               <tr>
//                                   <td className="px-4 py-2 border">Tên người đặt:</td>
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userFullName || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Email:</td>
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userEmail || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Số điện thoại:</td>
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userPhone || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Địa chỉ:</td>
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.shippingAddress || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Phương thức thanh toán:</td>
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.paymentMethod || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Mã giảm giá:</td>
//                                   {/* <td className="px-4 py-2 border">{orderDetails[order.orderId]?.discount_voucher || 'N/A'}%</td> */}
//                                   <td className="px-4 py-2 border">{orderDetails[order.orderId]?.name_voucher || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Phí vận chuyển:</td>
//                                   <td className="px-4 py-2 border">
//                                     {orderDetails[order.orderId]?.deliveryFee !== undefined
//                                       ? `${orderDetails[order.orderId]?.deliveryFee.toLocaleString('vi-VN')} ₫`
//                                       : 'N/A'}
//                                   </td>
//                                 </tr>
//                                 <tr>
//                                   <td className="px-4 py-2 border">Tổng tiền thanh toán:</td>
//                                   <td className="px-4 py-2 border">
//                                     {orderDetails[order.orderId]?.totalCash !== undefined
//                                       ? `${orderDetails[order.orderId]?.totalCash.toLocaleString('vi-VN')} ₫`
//                                       : 'N/A'}
//                                   </td>
//                                 </tr>

//                               </tbody>

//                             </table>
//                           </div>

//                           <div className="w-1/2">
//                             <table className="min-w-full bg-white border">
//                               <thead>
//                                 <tr>
//                                   <th className="px-4 py-3 bg-gray-200 text-left font-bold" colSpan="2">Sản phẩm đã mua</th>
//                                 </tr>
//                               </thead>
//                               <div className="overflow-y-auto max-h-96 border">
//                                 <table className="table-auto w-full border-collapse">
//                                   <tbody>
//                                     {orderDetails[order.orderId]?.orderDetails?.map((detail, index) => (
//                                       <React.Fragment key={index}>
//                                         <tr>
//                                           <td className="px-4 py-2 border">Tên sản phẩm:</td>
//                                           <td className="px-4 py-2 border">{detail.productName}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="px-4 py-2 border">Màu sắc:</td>
//                                           <td className="px-4 py-2 border">
//                                             <span
//                                               className="w-4 h-4 rounded-full inline-block"
//                                               style={{ backgroundColor: detail.variantName }}
//                                             ></span>
//                                             {detail.variantName}
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <td className="px-4 py-2 border">Kích thước:</td>
//                                           <td className="px-4 py-2 border">{detail.variantSize}</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="px-4 py-2 border">Đơn giá:</td>
//                                           <td className="px-4 py-2 border">{detail.price?.toLocaleString()} đ</td>
//                                         </tr>
//                                         <tr>
//                                           <td className="px-4 py-2 border">Số lượng:</td>
//                                           <td className="px-4 py-2 border">{detail.quantity}</td>
//                                         </tr>
//                                         {detail.discount_FS !== null && detail.discount_FS !== undefined && detail.discount_FS !== "" && (
//                                           <tr>
//                                             <td className="px-4 py-2 border">Giảm giá Flash Sale:</td>
//                                             <td className="px-4 py-2 border">{detail.discount_FS} %</td>
//                                           </tr>
//                                         )}

//                                         {detail.name_FS && (
//                                           <tr>
//                                             <td className="px-4 py-2 border">Tên Flash Sale:</td>
//                                             <td className="px-4 py-2 border">{detail.name_FS}</td>
//                                           </tr>
//                                         )}

//                                         <br></br>
//                                       </React.Fragment>
//                                     ))}
//                                   </tbody>
//                                 </table>
//                               </div>


//                             </table>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-center text-gray-500">Không có đơn hàng nào</p>
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredOrders.length > 0 && (
//         <div className="pagination-container">
//           <button
//             onClick={() => setCurrentPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
//           >
//             &lt;
//           </button>

//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => paginate(index + 1)}
//               className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
//             >
//               {index + 1}
//             </button>
//           ))}

//           <button
//             onClick={() => setCurrentPage(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
//           >
//             &gt;
//           </button>
//         </div>
//       )}

//       {/* Cancel Order Modal */}
//       {showCancelModal && (
//         <Modal
//           isOpen={showCancelModal}
//           onRequestClose={() => setShowCancelModal(false)}
//           contentLabel="Lý do hủy đơn hàng"
//           className="modal-content"
//           overlayClassName="modal-overlay"
//         >
//           <h2 className="text-lg font-bold mb-4">Chọn lý do hủy đơn hàng</h2>
//           <div>
//             <label className="block mb-2 font-medium">Lý do hủy:</label>
//             <select
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               className="w-full border border-gray-300 rounded px-4 py-2"
//             >
//               <option value="">Chọn lý do hủy</option>
//               <option value="Không liên lạc được với khách hàng">Không liên lạc được với khách hàng</option>
//               <option value="Khách hủy đơn">Khách hủy đơn</option>
//               <option value="Hết hàng">Hết hàng</option>
//               <option value="Sai thông tin đơn hàng">Sai thông tin đơn hàng</option>
//               <option value="Khách không đáp ứng điều kiện giao hàng">Khách không đáp ứng điều kiện giao hàng</option>
//               <option value="Không thể giao hàng đúng thời gian yêu cầu">Không thể giao hàng đúng thời gian yêu cầu</option>
//               <option value="Lý do vận hành nội bộ">Lý do vận hành nội bộ</option>
//               <option value="Lý do khác">Lý do khác</option>
//             </select>

//             {/* Hiển thị ô nhập nếu chọn "Lý do khác" */}
//             {cancelReason === "Lý do khác" && (
//               <textarea
//                 value={otherReason}
//                 onChange={(e) => setOtherReason(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-4 py-2 mt-4"
//                 placeholder="Nhập lý do khác..."
//               />
//             )}
//           </div>

//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={() => {
//                 const reason = cancelReason === "Lý do khác" ? otherReason : cancelReason;
//                 confirmCancelOrder(reason);
//               }}
//               disabled={!cancelReason || (cancelReason === "Lý do khác" && !otherReason)}
//               className="bg-red-500 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
//             >
//               Xác nhận hủy
//             </button>
//             <button
//               onClick={() => setShowCancelModal(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Hủy bỏ
//             </button>
//           </div>
//         </Modal>
//       )}


//       {/* Status Update Confirmation Modal */}
//       {showModal && (
//         <Modal
//           isOpen={showModal}
//           onRequestClose={() => setShowModal(false)}
//           contentLabel="Xác nhận cập nhật trạng thái"
//           className="modal-content"
//           overlayClassName="modal-overlay"
//         >
//           <h2 className="text-lg font-bold mb-4">Xác nhận cập nhật trạng thái</h2>
//           <p>Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #{orderToUpdate?.orderId} thành "{statusToUpdate}"?</p>
//           <div className="mt-4">
//             <button onClick={confirmStatusUpdate} className="bg-green-500 text-white px-4 py-2 rounded mr-4">
//               Xác nhận
//             </button>
//             <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
//               Hủy
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );

// };

// export default AdminOrderManagement;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useHistory, useParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
const AdminOrderManagement = () => {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [orderStatusOptions, setOrderStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [cancelReason, setCancelReason] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [otherReason, setOtherReason] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('http://localhost:8080/admin/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const reversedOrders = response.data.reverse();
        setOrders(reversedOrders);


        // Lấy thông tin chi tiết của tất cả đơn hàng ngay sau khi tải danh sách đơn hàng
        const orderIds = response.data.map(order => order.orderId);
        const orderDetailsPromises = orderIds.map(orderId =>
          axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        );

        const orderDetailsResponses = await Promise.all(orderDetailsPromises);
        const newOrderDetails = orderDetailsResponses.reduce((acc, response) => {
          acc[response.data.orderId] = response.data;
          return acc;
        }, {});

        setOrderDetails(newOrderDetails); // Lưu thông tin chi tiết 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders or order details:', error);
        setLoading(false);
      }
    };

    const fetchOrderStatusOptions = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/admin/api/states', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setOrderStatusOptions(response.data);
      } catch (error) {
        console.error('Error fetching order status options:', error);
      }
    };

    fetchOrders();
    fetchOrderStatusOptions();
  }, []);



  const handleStatusChange = (order, status) => {
    const validStatuses = getValidStatuses(order.orderStatus);

    if (!validStatuses.includes(status)) {
      alert(`Không thể chuyển từ trạng thái "${order.orderStatus}" sang trạng thái "${status}"`);
      return;
    }

    // Nếu trạng thái là "Đã hủy", hiện modal và lưu thông tin đơn hàng cần hủy
    if (status === "Đã hủy") {
      setOrderToCancel(order);
      setStatusToUpdate(status);
      setShowCancelModal(true);
    } else {
      // Với các trạng thái khác
      setOrderToUpdate(order);
      setStatusToUpdate(status);
      setShowModal(true);
    }
  };


  const confirmStatusUpdate = async () => {
    if (orderToUpdate && statusToUpdate) {
      const token = localStorage.getItem('jwtToken');


      const selectedState = orderStatusOptions.find(
        (status) => status.name_status_order === statusToUpdate
      );

      if (!selectedState) {
        alert("Trạng thái không hợp lệ");
        return;
      }

      const payload = {
        state: {
          id: selectedState.id,
        },
      };

      console.log("Sending payload:", payload); // Để kiểm tra dữ liệu trước khi gửi

      try {
        const response = await axios.put(
          `http://localhost:8080/admin/api/orders/${orderToUpdate.orderId}`,
          payload, // Gửi dữ liệu payload với stateId
          { headers: { Authorization: `Bearer ${token}` } }
        );


        //phan gui thong bao day -------------------------------------------------------------------
        const tokenDevice = await axios.post('http://localhost:8080/admin/api/sendtoken/device',
          { order: orderToUpdate.orderId }, { headers: { Authorization: `Bearer ${token}` } })
        console.log("thiet bi token la: ", tokenDevice)
        // Lấy token admin từ sessionStorage
        const adminToken = sessionStorage.getItem('FCMToken');

        if (adminToken) {
          const messageData = {
            token: tokenDevice.data,
            title: "Thông báo mới",
            body: `Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`,
          };

          axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
          )
            .then((response) => {
              if (response) {
                //create notify to admin 
                axios.post('http://localhost:8080/user/api/notify/createNotifyToUser', { mess: `Thông báo mới! Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`, idOrder: orderToUpdate.orderId }, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }).then((response) => {
                  console.log("da tao moi thong bao den admin")
                })
              }
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }
        //-------------------------------------------------------------------


        console.log("API response:", response.data);
        toast.success('Cập nhật trạng thái thành công');
        setTimeout(() => {
          history.push('/admin/orders');
        }, 1500);


        // Cập nhật danh sách đơn hàng trong giao diện
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderToUpdate.orderId
              ? { ...order, orderStatus: statusToUpdate }
              : order
          )
        );
      } catch (error) {
        console.error("Error updating order status:", error.response ? error.response.data : error.message);
        toast.error('Cập nhật trạng thái thất bại');
      }

      setShowModal(false);
      setOrderToUpdate(null);
      setStatusToUpdate("");
    }
  };



  const getValidStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Đang chờ xử lý":
        return ["Đã hủy", "Đã xác nhận"];
      case "Đã xác nhận":
        return ["Đã đóng gói", "Đang giao hàng"];
      case "Đã đóng gói":
        return ["Đang giao hàng"];
      case "Đang giao hàng":
        return ["Đã giao", "Đã trả lại"];
      case "Đã giao":
        return [];
      case "Đã trả lại":
        return ["Đã hoàn tiền"];
      default:
        return [];
    }
  };


  const toggleDetails = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      if (!orderDetails[orderId]) {
        const token = localStorage.getItem('jwtToken');
        try {
          const response = await axios.get(`http://localhost:8080/admin/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setOrderDetails(prevDetails => ({ ...prevDetails, [orderId]: response.data }));
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      }
      setExpandedOrderId(orderId);
    }
  };


  const confirmCancelOrder = async () => {
    console.log("Order to cancel:", orderToCancel);
    console.log("Cancel reason:", cancelReason);
    console.log("Confirm cancel order triggered");

    if (orderToCancel && cancelReason) {
      const token = localStorage.getItem('jwtToken');

      // Đóng modal và reset trạng thái trước khi gửi yêu cầu
      setShowCancelModal(false);
      setCancelReason('');
      setOrderToCancel(null);

      try {
        const response = await axios.post(
          `http://localhost:8080/admin/api/orders/${orderToCancel.orderId}/cancel`,
          { reason: cancelReason },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Thông báo hủy đơn hàng thành công và email sẽ được gửi sau

        console.log('API Response:', response.data);

        //phan gui thong bao day -------------------------------------------------------------------
        const tokenDevice = await axios.post('http://localhost:8080/admin/api/sendtoken/device',
          { order: orderToUpdate.orderId }, { headers: { Authorization: `Bearer ${token}` } })

        // Lấy token admin từ sessionStorage
        const adminToken = sessionStorage.getItem('FCMToken');

        if (adminToken) {
          const messageData = {
            token: tokenDevice.data,
            title: "Thông báo mới",
            body: `Đơn hàng #${orderToUpdate.orderId} của bạn ${statusToUpdate}`,
          };
          console.log(messageData)
          axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
          )
            .then((response) => {
              console.log("Successfully sent message:", response.data);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }
        //-------------------------------------------------------------------

        // Fetch lại dữ liệu đơn hàng ngay lập tức mà không chờ đợi việc gửi mail
        fetchOrders();
      } catch (error) {
        // Thông báo hủy đơn hàng thành công và email sẽ được gửi sau
        toast.success('Đã hủy đơn hàng và email sẽ được gửi sau ít phút ');


        // Fetch lại dữ liệu đơn hàng ngay lập tức mà không chờ đợi việc gửi mail
        fetchOrders();
      }
    } else {
      console.log("Order or reason missing");
    }
  };




  const fetchOrders = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://localhost:8080/admin/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const reversedOrders = response.data.reverse();
      setOrders(reversedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const filteredOrders = activeTab === 'Tất cả'
    ? orders
    : orders.filter(order => order.orderStatus === activeTab);

  // Phân trang dựa trên filteredOrders
  const searchedOrders = filteredOrders.filter(order =>
    order.orderId.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = searchedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(searchedOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Quản lý đơn hàng</h2>
      <input
        type="text"
        placeholder="Tìm theo mã đơn hàng..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border mb-6 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Tab navigation for filtering orders by status */}
      <div className="mb-4">
        <ul className="flex space-x-4 text-sm">
          <li
            className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === 'Tất cả' ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('Tất cả')}
          >
            Tất cả
          </li>
          {orderStatusOptions.map((status) => (
            <li
              key={status.id}
              className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${activeTab === status.name_status_order ? 'bg-blue-500 text-white font-bold shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-slate-500'}`}
              onClick={() => setActiveTab(status.name_status_order)}
            >
              {status.name_status_order}
            </li>
          ))}
        </ul>
      </div>
      <Toaster position="top-right" />
      {/* Display orders based on selected tab */}
      <div className="overflow-x-auto">
        {currentOrders.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead className="table-header">
              <tr>
                <th className="px-4 py-3 border-b">Mã đơn hàng</th>
                <th className="px-4 py-3 border-b">Tên người đặt</th>
                <th className="px-4 py-3 border-b">Phí vận chuyển</th>
                <th className="px-4 py-3 border-b">Tổng tiền</th>
                <th className="px-4 py-3 border-b">Trạng thái</th>
                <th className="px-4 py-3 border-b">Thời gian đặt</th>
                <th className="px-4 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <React.Fragment key={order.orderId}>
                  <tr key={order.orderId} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                    {/* Mã đơn hàng */}
                    <td className="px-6 py-4 border-b">{order.orderId}</td>

                    <td className="px-6 py-4 border-b">
                      {orderDetails[order.orderId]?.userFullName || "N/A"}
                    </td>

                    {/* Phí vận chuyển */}
                    <td className="px-6 py-4 border-b">{order.deliveryFee?.toLocaleString() || 'N/A'} VNĐ</td>

                    {/* Tổng tiền */}
                    <td className="px-6 py-4 border-b">{order.totalCash?.toLocaleString() || 'N/A'} VNĐ</td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 border-b">
                      <div className="status-container">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          className="select-status"
                        >
                          <option value={order.orderStatus}>{order.orderStatus}</option>
                          {getValidStatuses(order.orderStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Thời gian đặt từ orderDetails */}
                    <td className="px-6 py-4 border-b">
                      {orderDetails[order.orderId]?.createdDate
                        ? (() => {
                          const orderDate = new Date(orderDetails[order.orderId].createdDate);
                          const now = new Date();
                          const timeDifference = Math.floor((now - orderDate) / 1000);

                          const days = Math.floor(timeDifference / (3600 * 24));
                          const hours = Math.floor((timeDifference % (3600 * 24)) / 3600);
                          const minutes = Math.floor((timeDifference % 3600) / 60);
                          const seconds = timeDifference % 60;

                          if (days > 0) {
                            return `${days} ngày trước`;
                          } else if (hours > 0) {
                            return `${hours} giờ trước`;
                          } else if (minutes > 0) {
                            return `${minutes} phút trước`;
                          } else {
                            return `${seconds} giây trước`;
                          }
                        })()
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => toggleDetails(order.orderId)}
                        className="bg-blue-500 text-white px-3 py-2 text-xs font-medium rounded-lg shadow-sm hover:bg-blue-600 transition duration-300 ease-in-out"
                      >
                        {expandedOrderId === order.orderId ? 'Ẩn' : 'Chi tiết'}
                      </button>
                    </td>

                  </tr>
                  {expandedOrderId === order.orderId && orderDetails[order.orderId] && (
                    <tr className="bg-gray-50 transition-all ease-out duration-500">
                      <td colSpan="8" className="px-6 py-4">
                        <div className="flex justify-between space-x-4">
                          <div className="w-1/2">
                            <table className="min-w-full bg-white border">
                              <thead>
                                <tr>
                                  <th colSpan="2" className="px-4 py-3 bg-gray-200 text-left font-bold">Chi tiết đơn hàng #{order.orderId}</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-4 py-2 border">Thời gian:</td>
                                  <td className="px-4 py-2 border">
                                    {orderDetails[order.orderId]?.createdDate
                                      ? new Intl.DateTimeFormat('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }).format(new Date(orderDetails[order.orderId]?.createdDate))
                                      : 'N/A'}
                                  </td>
                                </tr>


                                <tr>
                                  <td className="px-4 py-2 border">Tên người đặt:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userFullName || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Email:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userEmail || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Số điện thoại:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.userPhone || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Địa chỉ:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.shippingAddress || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Phương thức thanh toán:</td>
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.paymentMethod || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Mã giảm giá:</td>
                                  {/* <td className="px-4 py-2 border">{orderDetails[order.orderId]?.discount_voucher || 'N/A'}%</td> */}
                                  <td className="px-4 py-2 border">{orderDetails[order.orderId]?.name_voucher || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Phí vận chuyển:</td>
                                  <td className="px-4 py-2 border">
                                    {orderDetails[order.orderId]?.deliveryFee !== undefined
                                      ? `${orderDetails[order.orderId]?.deliveryFee.toLocaleString('vi-VN')} ₫`
                                      : 'N/A'}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-2 border">Tổng tiền thanh toán:</td>
                                  <td className="px-4 py-2 border">
                                    {orderDetails[order.orderId]?.totalCash !== undefined
                                      ? `${orderDetails[order.orderId]?.totalCash.toLocaleString('vi-VN')} ₫`
                                      : 'N/A'}
                                  </td>
                                </tr>

                              </tbody>

                            </table>
                          </div>

                          <div className="w-1/2">
                            <table className="min-w-full bg-white border">
                              <thead>
                                <tr>
                                  <th className="px-4 py-3 bg-gray-200 text-left font-bold" colSpan="2">Sản phẩm đã mua</th>
                                </tr>
                              </thead>
                              <div className="overflow-y-auto max-h-96 border">
                                <table className="table-auto w-full border-collapse">
                                  <tbody>
                                    {orderDetails[order.orderId]?.orderDetails?.map((detail, index) => (
                                      <React.Fragment key={index}>
                                        <tr>
                                          <td className="px-4 py-2 border">Tên sản phẩm:</td>
                                          <td className="px-4 py-2 border">{detail.productName}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Màu sắc:</td>
                                          <td className="px-4 py-2 border">
                                            <span
                                              className="w-4 h-4 rounded-full inline-block"
                                              style={{ backgroundColor: detail.variantName }}
                                            ></span>
                                            {detail.variantName}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Kích thước:</td>
                                          <td className="px-4 py-2 border">{detail.variantSize}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Đơn giá:</td>
                                          <td className="px-4 py-2 border">{detail.price?.toLocaleString()} đ</td>
                                        </tr>
                                        <tr>
                                          <td className="px-4 py-2 border">Số lượng:</td>
                                          <td className="px-4 py-2 border">{detail.quantity}</td>
                                        </tr>
                                        {detail.discount_FS !== null && detail.discount_FS !== undefined && detail.discount_FS !== "" && (
                                          <tr>
                                            <td className="px-4 py-2 border">Chương trình giảm giá</td>
                                            <td className="px-4 py-2 border">{detail.discount_FS} %</td>
                                          </tr>
                                        )}

                                        {detail.name_FS && (
                                          <tr>
                                            <td className="px-4 py-2 border">Tên Flash Sale:</td>
                                            <td className="px-4 py-2 border">{detail.name_FS}</td>
                                          </tr>
                                        )}

                                        <br></br>
                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>


                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">Không có đơn hàng nào</p>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
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
            disabled={currentPage === totalPages}
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            &gt;
          </button>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <Modal
          isOpen={showCancelModal}
          onRequestClose={() => setShowCancelModal(false)}
          contentLabel="Lý do hủy đơn hàng"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2 className="text-lg font-bold mb-4">Chọn lý do hủy đơn hàng</h2>
          <div>
            <label className="block mb-2 font-medium">Lý do hủy:</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            >
              <option value="">Chọn lý do hủy</option>
              <option value="Không liên lạc được với khách hàng">Không liên lạc được với khách hàng</option>
              <option value="Khách hủy đơn">Khách hủy đơn</option>
              <option value="Hết hàng">Hết hàng</option>
              <option value="Sai thông tin đơn hàng">Sai thông tin đơn hàng</option>
              <option value="Khách không đáp ứng điều kiện giao hàng">Khách không đáp ứng điều kiện giao hàng</option>
              <option value="Không thể giao hàng đúng thời gian yêu cầu">Không thể giao hàng đúng thời gian yêu cầu</option>
              <option value="Lý do vận hành nội bộ">Lý do vận hành nội bộ</option>
              <option value="Lý do khác">Lý do khác</option>
            </select>

            {/* Hiển thị ô nhập nếu chọn "Lý do khác" */}
            {cancelReason === "Lý do khác" && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 mt-4"
                placeholder="Nhập lý do khác..."
              />
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const reason = cancelReason === "Lý do khác" ? otherReason : cancelReason;
                confirmCancelOrder(reason);
              }}
              disabled={!cancelReason || (cancelReason === "Lý do khác" && !otherReason)}
              className="bg-red-500 text-white px-4 py-2 rounded mr-4 disabled:opacity-50"
            >
              Xác nhận hủy
            </button>
            <button
              onClick={() => setShowCancelModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Hủy bỏ
            </button>
          </div>
        </Modal>
      )}


      {/* Status Update Confirmation Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Xác nhận cập nhật trạng thái"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2 className="text-lg font-bold mb-4">Xác nhận cập nhật trạng thái</h2>
          <p>Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #{orderToUpdate?.orderId} thành "{statusToUpdate}"?</p>
          <div className="mt-4">
            <button onClick={confirmStatusUpdate} className="bg-green-500 text-white px-4 py-2 rounded mr-4">
              Xác nhận
            </button>
            <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
              Hủy
            </button>
          </div>
        </Modal>
      )}
    </div>
  );

};

export default AdminOrderManagement;

