// import React, { useEffect, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { withRouter } from "react-router-dom";
// import { FaBell, FaHeart } from 'react-icons/fa';
// import { jwtDecode } from "jwt-decode";
// import SearchBar from './SearchBar2';
// import CategoryDropdown from './CategoryDropdown';
// import { Collapse, Dropdown, Ripple, Carousel, Input, initTWE } from "tw-elements";
// import axios from 'axios';

// //-----------------------------------------------------------------------------------
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { Toaster, toast } from 'sonner';
// import { Notifications } from "react-push-notification";
// const config1 = {
//     apiKey: "AIzaSyB3r64mjDNh5avpeSBELfnb83KuOjl-9bw",
//     authDomain: "pushdemo-6b5fe.firebaseapp.com",
//     projectId: "pushdemo-6b5fe",
//     storageBucket: "pushdemo-6b5fe.appspot.com",
//     messagingSenderId: "1081310369615",
//     appId: "1:1081310369615:web:27674bba35312908bc973a",
//     measurementId: "G-K6DQHQKGKC"
// };

// // Khởi tạo ứng dụng Firebase với tên "pushApp"
// const pushApp = initializeApp(config1, "pushApp");
// const messaging = getMessaging(pushApp);

// navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//         const token = localStorage.getItem('jwtToken');
//         // Giả sử idUser đã được lưu trong localStorage

//     })
//     .catch((err) => {
//         console.log("Service Worker registration failed:", err);
//     });

// // Kiểm tra và yêu cầu quyền nếu cần
// Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {

//         // Lấy token FCM
//         getToken(
//             messaging,
//             {
//                 vapidKey:
//                     "BInxN2_AaAIjvSrsmvQ41da7QXVchQvYDyJxkwoZHFtvjhVvyLDyoXzn9LrIxLlIDoo4i_srSRZ30lvk-oHU2vc"
//             })
//             .then((currentToken) => {
//                 if (currentToken) {
//                     sessionStorage.setItem('FCMToken', currentToken);
//                 } else {
//                     console.log("No registration token available.");
//                 }
//             })
//             .catch((err) => {
//                 console.log("An error occurred while retrieving token. ", err);
//             });
//     } else {
//         console.log("Unable to get permission to notify.");
//     }
// });
// //-----------------------------------------------------------------------------------


// class Navbar extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             user: null,
//             categories: [], // State để lưu danh mục
//             prevScrollY: 0,
//             isNavbarVisible: true,
//             isAtTop: true,
//             showMarquee: true, // Quản lý trạng thái hiển thị của marquee
//             notifications: [],
//             is_reading: false,
//             displayedCount: 4,
//         }
//     }

//     // Method to fetch notifications
//     fetchNotifications = async () => {
//         try {
//             const token = localStorage.getItem('jwtToken');
//             const decoded = jwtDecode(token)
//             if (token) {
//                 const response = await axios.post('http://localhost:8080/user/api/notify/listNotificationUser', { id: decoded.id_user }, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 this.setState({ notifications: response.data });
//             }
//         } catch (error) {
//             console.error('Error fetching notifications:', error);
//         }
//     };

//     // Lifecycle method - componentWillUnmount
//     componentWillUnmount() {
//         document.removeEventListener('visibilitychange', this.handleVisibilityChange);
//         window.removeEventListener('scroll', this.handleScroll);
//     }

//     handleShowMore = () => {
//         this.setState((prevState) => ({
//           displayedCount: prevState.displayedCount + 4, // Tăng số lượng hiển thị thêm 4
//         }));
//       };

//     // Method to handle visibility changes
//     handleVisibilityChange = () => {
//         if (!document.hidden) {
//             this.setState({ notifications: [] }); // Clear notifications to avoid stacking
//             this.fetchNotifications(); // Refetch notifications
//         }
//     };

//     async requestPermissionAndToken() {
//         try {
//             const permission = await Notification.requestPermission();
//             if (permission === 'granted') {
//                 const token = await getToken(messaging, { vapidKey: "BInxN2_AaAIjvSrsmvQ41da7QXVchQvYDyJxkwoZHFtvjhVvyLDyoXzn9LrIxLlIDoo4i_srSRZ30lvk-oHU2vc" });
//                 if (token) {
//                     // Ghi lại token để gửi từ server
//                     sessionStorage.setItem('adminFCMToken', token);
//                 }
//             }
//         } catch (error) {
//             console.error("Error getting permission or token:", error);
//         }
//     }

//     async componentDidMount() {
//         initTWE({ Collapse, Dropdown, Ripple, Carousel, Input });
//         this.requestPermissionAndToken();

//         this.fetchNotifications();

//         // Handle visibility change
//         document.addEventListener('visibilitychange', this.handleVisibilityChange);

//         // Gọi API lấy danh mục
//         try {
//             const response = await axios.get('http://localhost:8080/user/api/products1/categories');
//             this.setState({ categories: response.data });
//         } catch (error) {
//             console.error('Lỗi khi lấy danh mục:', error);
//         }

//         // Kiểm tra token
//         const token = localStorage.getItem('jwtToken');
//         if (token) {
//             const decoded = jwtDecode(token);
//             const currentTime = Date.now() / 1000;

//             if (decoded.exp < currentTime) {
//                 this.handleLogout();
//             } else {
//                 this.setState({ user: decoded });
//             }
//         }

//         // Thêm sự kiện cuộn trang
//         window.addEventListener('scroll', this.handleScroll);
//     }

//     handleDeleteNotification = async () => {
//         const token = localStorage.getItem('jwtToken');
//         const decoded = jwtDecode(token);

//         await axios.post("http://localhost:8080/user/api/notify/deleteNotification", { idUser: decoded.id_user },
//             { headers: { Authorization: `Bearer ${token}` } }
//         ).then(response => {
//             if (response.status === 200) {
//                 this.fetchNotifications()
//             }
//         })
//     }
//     handleGoToOrder = () => {
//         window.location.href = '/myprofile?tab=order';
//     }

//     handleScroll = () => {
//         const { prevScrollY } = this.state;
//         const currentScrollY = window.scrollY;

//         // Kiểm tra xem có đang ở trên cùng không
//         if (currentScrollY === 0) {
//             this.setState({ isNavbarVisible: true, isAtTop: true, showMarquee: true });
//         } else if (currentScrollY > prevScrollY) {
//             // Cuộn xuống
//             this.setState({ isNavbarVisible: false, isAtTop: false, showMarquee: false });
//         } else {
//             // Cuộn lên
//             this.setState({ isNavbarVisible: true, isAtTop: false });
//         }

//         this.setState({ prevScrollY: currentScrollY });
//     }

//     handleGoToFavorite = () => {
//         this.props.history.push('/myFavorite');
//     }

//     handleLogout = () => {
//         this.setState({ user: null });
//         localStorage.removeItem('jwtToken');
//         sessionStorage.removeItem('name_prod');
//         localStorage.removeItem('messages');
//         window.location.href = '/login'
//         // this.props.history.push('/login');
//     }

//     handleCart = () => {
//         const token = localStorage.getItem('jwtToken');
//         if (token) {
//             this.props.history.push('/mycart');
//         } else {
//             this.props.history.push('/login');
//         }
//     }

//     handleUpdateReading = async () => {
//         const token = localStorage.getItem('jwtToken');
//         const decoded = jwtDecode(token);

//         try {
//             // Gọi API để cập nhật trạng thái đọc
//             await axios.post('http://localhost:8080/user/api/notify/updateReading',
//                 { idUser: decoded.id_user },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             // Gọi lại fetchNotifications sau khi cập nhật thành công
//             await this.fetchNotifications();
//         } catch (error) {
//             console.error('Error updating reading status:', error);
//         }
//     };

//     checkReading = async () => {
//         this.setState({
//             is_reading: true
//         })
//     }

//     render() {
//         const { is_reading, user, categories, isNavbarVisible, isAtTop, showMarquee, notifications, displayedCount } = this.state;

//          // Lấy danh sách thông báo cần hiển thị
//     const visibleNotifications = notifications.slice(0, displayedCount);

//         return (
//             <>
//                 <Toaster position="top-right" />
//                 {/* Phần chữ chạy */}
//                 {showMarquee && (
//                     <div className="fixed top-0 w-full z-50 " style={{ background: 'linear-gradient(to right, rgba(191, 219, 254, 0.6), rgba(251, 207, 232, 0.6))' }}>
//                         <marquee
//                             className="text-blue-950"
//                             style={{ fontFamily: 'Dancing Script, cursive' }}>
//                             Miễn phí vận chuyển với đơn hàng trên 300K, Hãy nhanh tay đặt hàng ngay hôm nay để nhận ưu đãi!
//                         </marquee>
//                     </div>
//                 )}

//                 {/* Thanh điều hướng */}
//                 <nav
//                     className={`fixed top-0  w-full z-40 p-4  transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
//                         } ${isAtTop ? '' : 'bg-white shadow-lg'}`}
//                     style={{ marginTop: showMarquee ? '30px' : '0', background: 'linear-gradient(to right, rgba(191, 219, 254, 0.6), rgba(251, 207, 232, 0.6))' }}>

//                     <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4">
//                         <button
//                             className="text-2xl mb-1 font-semibold"
//                             onClick={() => window.location.href = "/"}
//                             style={{
//                                 background: "none",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 fontFamily: 'Georgia, serif',
//                                 color: '#A3C1E0',
//                                 transition: 'color 0.3s',
//                             }}
//                             onMouseOver={(e) => e.currentTarget.style.color = '#abcfdb'}
//                             onMouseOut={(e) => e.currentTarget.style.color = '#A3C1E0'}
//                         >
//                             MAOU
//                         </button>

//                         {/* Các thành phần khác của navbar */}
//                         <ul className="list-none flex space-x-8 items-center justify-center flex-1">
//                             <li className="relative group">
//                                 <CategoryDropdown categories={categories} />
//                             </li>
//                             <li className="relative group">
//                                 <NavLink to="/vouchers" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
//                                     VOUCHER
//                                 </NavLink>
//                                 <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
//                             </li>
//                             <li className="relative group">
//                                 <NavLink to="/support" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
//                                     LIÊN HỆ
//                                 </NavLink>
//                                 <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
//                             </li>
//                             <li className="relative group">
//                                 <NavLink to="/blog" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
//                                     TIN TỨC
//                                 </NavLink>
//                                 <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
//                             </li>
//                         </ul>

//                         {/* Phần còn lại của navbar */}
//                         <SearchBar />

//                         <div
//                             className="relative"
//                             data-twe-dropdown-ref
//                             data-twe-dropdown-alignment="end">
//                             <button
//                                 onClick={this.handleUpdateReading}
//                                 className="me-4 flex items-center text-neutral-600 dark:text-white"
//                                 id="dropdownMenuButton1"
//                                 data-twe-dropdown-toggle-ref
//                                 aria-expanded="false"
//                                 style={{ background: "none", border: "none", cursor: "pointer" }}
//                             >
//                                 <FaBell className="w-5 h-5" />
//                                 {notifications.some(notification => !notification.is_reading) && (
//                                     <span

//                                         className="absolute -mt-2.5 ml-2 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white"
//                                     >
//                                         {
//                                             notifications.filter((notification) => !notification.is_reading).length
//                                         }
//                                     </span>

//                                 )}
//                             </button>

//                             {/* <ul
//                                 className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
//                                 aria-labelledby="dropdownMenuButton1"
//                                 data-twe-dropdown-menu-ref>
//                                 {notifications.length > 0 ?
//                                     notifications.map((notification, index) => {
//                                         return (
//                                             <div key={notification.id}>
                                               
//                                                     <li
//                                                     onClick={this.handleGoToOrder}
//                                                      className="flex cursor-pointer items-start px-4 py-3 border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
//                                                         <div className="mr-3">
//                                                             <img src="https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg" alt="icon" className="w-8 h-8 rounded-full" />
//                                                         </div>
//                                                         <div>
//                                                             <p className="font-semibold text-neutral-900 dark:text-white">Thông báo của bạn 🎉</p>
//                                                             <p className="text-sm text-neutral-700 dark:text-neutral-300">
//                                                                 {notification.name_notifi}
//                                                             </p>
//                                                         </div>
//                                                     </li>
                                                
//                                             </div>
//                                         )
//                                     }) :
//                                     <li className="text-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800">
//                                         <div className="text-blue-500 font-semibold">Không có thông báo nào!</div>
//                                     </li>
//                                 }
//                                 {notifications.length > 0 && (

//                                     <button
//                                         onClick={this.handleDeleteNotification}
//                                         type="button"
//                                         className="inline-block rounded-full bg-info px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-info-3 transition duration-150 ease-in-out hover:bg-info-accent-300 hover:shadow-info-2 focus:bg-info-accent-300 focus:shadow-info-2 focus:outline-none focus:ring-0 active:bg-info-600 active:shadow-info-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong my-3 mx-2">
//                                         Xóa tất cả
//                                     </button>
//                                 )}
//                             </ul> */}
//                             <ul
//         className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark max-h-screen overflow-y-auto"
//         aria-labelledby="dropdownMenuButton1"
//         data-twe-dropdown-menu-ref
//       >
//         {visibleNotifications.length > 0 ? (
//           visibleNotifications.map((notification, index) => (
//             <div key={notification.id}>
//               <li
//                 onClick={this.handleGoToOrder}
//                 className="flex cursor-pointer items-start px-4 py-3 border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
//               >
//                 <div className="mr-3">
//                   <img
//                     src="https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg"
//                     alt="icon"
//                     className="w-8 h-8 rounded-full"
//                   />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-neutral-900 dark:text-white">
//                     Thông báo của bạn 🎉
//                   </p>
//                   <p className="text-sm text-neutral-700 dark:text-neutral-300">
//                     {notification.name_notifi}
//                   </p>
//                 </div>
//               </li>
//             </div>
//           ))
//         ) : (
//           <li className="text-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800">
//             <div className="text-blue-500 font-semibold">
//               Không có thông báo nào!
//             </div>
//           </li>
//         )}
//         {notifications.length > displayedCount && (
//           <button
//             onClick={this.handleShowMore}
//             type="button"
//             className="inline-block rounded-full bg-info px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-info-3 transition duration-150 ease-in-out hover:bg-info-accent-300 hover:shadow-info-2 focus:bg-info-accent-300 focus:shadow-info-2 focus:outline-none focus:ring-0 active:bg-info-600 active:shadow-info-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong my-3 mx-2"
//           >
//             Xem thêm
//           </button>
//         )}
//         {notifications.length > 0 && (
//           <button
//             onClick={this.handleDeleteNotification}
//             type="button"
//             className="inline-block rounded-full bg-info px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-info-3 transition duration-150 ease-in-out hover:bg-info-accent-300 hover:shadow-info-2 focus:bg-info-accent-300 focus:shadow-info-2 focus:outline-none focus:ring-0 active:bg-info-600 active:shadow-info-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong my-3 mx-2"
//           >
//             Xóa tất cả
//           </button>
//         )}
//       </ul>
//                         </div>

//                         <button
//                             onClick={this.handleGoToFavorite}
//                             className="me-4 flex items-center text-neutral-600 dark:text-white"
//                         >
//                             <FaHeart className="w-5 h-5" />
//                         </button>

//                         <button onClick={() => this.handleCart()} className="me-4 flex items-center  text-neutral-600 dark:text-white">
//                             <span className="[&>svg]:w-5">
//                                 <img
//                                     src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1Ljk5OTYgOEMxNS45OTk2IDkuMDYwODcgMTUuNTc4MiAxMC4wNzgzIDE0LjgyOCAxMC44Mjg0QzE0LjA3NzkgMTEuNTc4NiAxMy4wNjA1IDEyIDExLjk5OTYgMTJDMTAuOTM4NyAxMiA5LjkyMTMxIDExLjU3ODYgOS4xNzExNiAxMC44Mjg0QzguNDIxMDIgMTAuMDc4MyA3Ljk5OTU5IDkuMDYwODcgNy45OTk1OSA4TTMuNjMyODEgNy40MDEzOEwyLjkzMjgxIDE1LjgwMTRDMi43ODI0MyAxNy42MDU5IDIuNzA3MjQgMTguNTA4MiAzLjAxMjI3IDE5LjIwNDJDMy4yODAyNyAxOS44MTU3IDMuNzQ0NjIgMjAuMzIwNCA0LjMzMTc3IDIwLjYzODJDNS4wMDAwNiAyMSA1LjkwNTQ1IDIxIDcuNzE2MjMgMjFIMTYuMjgzQzE4LjA5MzcgMjEgMTguOTk5MSAyMSAxOS42Njc0IDIwLjYzODJDMjAuMjU0NiAyMC4zMjA0IDIwLjcxODkgMTkuODE1NyAyMC45ODY5IDE5LjIwNDJDMjEuMjkxOSAxOC41MDgyIDIxLjIxNjcgMTcuNjA1OSAyMS4wNjY0IDE1LjgwMTRMMjAuMzY2NCA3LjQwMTM4QzIwLjIzNyA1Ljg0ODc1IDIwLjE3MjMgNS4wNzI0MyAxOS44Mjg1IDQuNDg0ODZDMTkuNTI1NyAzLjk2NzQ0IDE5LjA3NDggMy41NTI2IDE4LjUzNDEgMy4yOTM4NUMxNy45MiAzIDE3LjE0MSAzIDE1LjU4MyAzTDguNDE2MjMgM0M2Ljg1ODIxIDMgNi4wNzkyMSAzIDUuNDY1MSAzLjI5Mzg0QzQuOTI0MzMgMy41NTI2IDQuNDczNDkgMy45Njc0NCA0LjE3MDcxIDQuNDg0ODZDMy44MjY4OSA1LjA3MjQzIDMuNzYyMTkgNS44NDg3NSAzLjYzMjgxIDcuNDAxMzhaIiBzdHJva2U9IiMzMzNGNDgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=="
//                                     alt="Giỏ hàng"
//                                     style={{ height: '24px', width: '24px' }}
//                                 />
//                             </span>
//                         </button>

//                         {/* TÀI KHOẢN- */}
//                         <div
//                             className="relative"
//                             data-twe-dropdown-ref
//                             data-twe-dropdown-alignment="end">
//                             <button
//                                 className="flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
//                                 id="dropdownMenuButton2"
//                                 data-twe-dropdown-toggle-ref
//                                 aria-expanded="false"
//                                 style={{ background: "none", border: "none", cursor: "pointer" }}
//                             >
//                                 <img
//                                     src={user != null ? user.image : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuODE2MyAxOS40Mzg0QzYuNDI0NjIgMTguMDA1MiA3Ljg0NDkyIDE3IDkuNSAxN0gxNS41QzE3LjE1NTEgMTcgMTguNTc1NCAxOC4wMDUyIDE5LjE4MzcgMTkuNDM4NE0xNi41IDkuNUMxNi41IDExLjcwOTEgMTQuNzA5MSAxMy41IDEyLjUgMTMuNUMxMC4yOTA5IDEzLjUgOC41IDExLjcwOTEgOC41IDkuNUM4LjUgNy4yOTA4NiAxMC4yOTA5IDUuNSAxMi41IDUuNUMxNC43MDkxIDUuNSAxNi41IDcuMjkwODYgMTYuNSA5LjVaTTIyLjUgMTJDMjIuNSAxNy41MjI4IDE4LjAyMjggMjIgMTIuNSAyMkM2Ljk3NzE1IDIyIDIuNSAxNy41MjI4IDIuNSAxMkMyLjUgNi40NzcxNSA2Ljk3NzE1IDIgMTIuNSAyQzE4LjAyMjggMiAyMi41IDYuNDc3MTUgMjIuNSAxMloiIHN0cm9rZT0iIzMzM0Y0OCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'}
//                                     className="rounded-full"
//                                     style={{ height: "30px", width: "27px" }}
//                                     alt=""
//                                     loading="lazy" />
//                                 {/* <label style={{ marginLeft: "20px", background: "none", border: "none", cursor: "pointer" }}> {user != null ? user.username : ''}</label> */}
//                             </button>
//                             <ul
//                                 className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
//                                 aria-labelledby="dropdownMenuButton2"
//                                 data-twe-dropdown-menu-ref>
//                                 {
//                                     user ?
//                                         <>
//                                             <li>
//                                                 <NavLink to="/myprofile"
//                                                     className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
//                                                     onClick={() => window.location.href = "#"}
//                                                     style={{ background: "none", border: "none", cursor: "pointer" }}
//                                                 >Tài khoản</NavLink>
//                                             </li>

//                                             <li>
//                                                 <button
//                                                     className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
//                                                     onClick={() => this.handleLogout()}
//                                                     style={{ background: "none", border: "none", cursor: "pointer" }}
//                                                 >Đăng xuất</button>
//                                             </li>
//                                         </>
//                                         :
//                                         <>
//                                             <li>
//                                                 <NavLink to="/login"
//                                                     className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
//                                                     onClick={() => window.location.href = "#"}
//                                                     style={{ background: "none", border: "none", cursor: "pointer" }}
//                                                 >Đăng nhập</NavLink>
//                                             </li>

//                                             <li>
//                                                 <NavLink to="/register"
//                                                     className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
//                                                     onClick={() => window.location.href = "#"}
//                                                     style={{ background: "none", border: "none", cursor: "pointer" }}
//                                                 >Đăng ký</NavLink>
//                                             </li>
//                                         </>
//                                 }
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>
//             </>
//         );
//     }
// }

// export default withRouter(Navbar);
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { FaBell, FaHeart } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import SearchBar from './SearchBar2';
import CategoryDropdown from './CategoryDropdown';
import { Collapse, Dropdown, Ripple, Carousel, Input, initTWE } from "tw-elements";
import axios from 'axios';

//-----------------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Toaster, toast } from 'sonner';
import { Notifications } from "react-push-notification";
const config1 = {
    apiKey: "AIzaSyB3r64mjDNh5avpeSBELfnb83KuOjl-9bw",
    authDomain: "pushdemo-6b5fe.firebaseapp.com",
    projectId: "pushdemo-6b5fe",
    storageBucket: "pushdemo-6b5fe.appspot.com",
    messagingSenderId: "1081310369615",
    appId: "1:1081310369615:web:27674bba35312908bc973a",
    measurementId: "G-K6DQHQKGKC"
};

// Khởi tạo ứng dụng Firebase với tên "pushApp"
const pushApp = initializeApp(config1, "pushApp");
const messaging = getMessaging(pushApp);

navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
        const token = localStorage.getItem('jwtToken');
        // Giả sử idUser đã được lưu trong localStorage

    })
    .catch((err) => {
        console.log("Service Worker registration failed:", err);
    });

// Kiểm tra và yêu cầu quyền nếu cần
Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {

        // Lấy token FCM
        getToken(
            messaging,
            {
                vapidKey:
                    "BInxN2_AaAIjvSrsmvQ41da7QXVchQvYDyJxkwoZHFtvjhVvyLDyoXzn9LrIxLlIDoo4i_srSRZ30lvk-oHU2vc"
            })
            .then((currentToken) => {
                if (currentToken) {
                    sessionStorage.setItem('FCMToken', currentToken);
                } else {
                    console.log("No registration token available.");
                }
            })
            .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
            });
    } else {
        console.log("Unable to get permission to notify.");
    }
});
//-----------------------------------------------------------------------------------


class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            categories: [], // State để lưu danh mục
            prevScrollY: 0,
            isNavbarVisible: true,
            isAtTop: true,
            showMarquee: true, // Quản lý trạng thái hiển thị của marquee
            notifications: [],
            is_reading: false
        }
    }

    // Method to fetch notifications
    fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const decoded = jwtDecode(token)
            if (token) {
                const response = await axios.post('http://localhost:8080/user/api/notify/listNotificationUser', { id: decoded.id_user }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.setState({ notifications: response.data });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Lifecycle method - componentWillUnmount
    componentWillUnmount() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('scroll', this.handleScroll);
    }

    // Method to handle visibility changes
    handleVisibilityChange = () => {
        if (!document.hidden) {
            this.setState({ notifications: [] }); // Clear notifications to avoid stacking
            this.fetchNotifications(); // Refetch notifications
        }
    };

    async requestPermissionAndToken() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, { vapidKey: "BInxN2_AaAIjvSrsmvQ41da7QXVchQvYDyJxkwoZHFtvjhVvyLDyoXzn9LrIxLlIDoo4i_srSRZ30lvk-oHU2vc" });
                if (token) {
                    // Ghi lại token để gửi từ server
                    sessionStorage.setItem('adminFCMToken', token);
                }
            }
        } catch (error) {
            console.error("Error getting permission or token:", error);
        }
    }

    async componentDidMount() {
        initTWE({ Collapse, Dropdown, Ripple, Carousel, Input });
        this.requestPermissionAndToken();

        this.fetchNotifications();

        // Handle visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Gọi API lấy danh mục
        try {
            const response = await axios.get('http://localhost:8080/user/api/products1/categories');
            this.setState({ categories: response.data });
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
        }

        // Kiểm tra token
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                this.handleLogout();
            } else {
                this.setState({ user: decoded });
            }
        }

        // Thêm sự kiện cuộn trang
        window.addEventListener('scroll', this.handleScroll);
    }

    handleDeleteNotification = async () => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);

        await axios.post("http://localhost:8080/user/api/notify/deleteNotification", { idUser: decoded.id_user },
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(response => {
            if (response.status === 200) {
                this.fetchNotifications()
            }
        })
    }

    handleScroll = () => {
        const { prevScrollY } = this.state;
        const currentScrollY = window.scrollY;

        // Kiểm tra xem có đang ở trên cùng không
        if (currentScrollY === 0) {
            this.setState({ isNavbarVisible: true, isAtTop: true, showMarquee: true });
        } else if (currentScrollY > prevScrollY) {
            // Cuộn xuống
            this.setState({ isNavbarVisible: false, isAtTop: false, showMarquee: false });
        } else {
            // Cuộn lên
            this.setState({ isNavbarVisible: true, isAtTop: false });
        }

        this.setState({ prevScrollY: currentScrollY });
    }

    handleGoToFavorite = () => {
        this.props.history.push('/myFavorite');
    }

    handleLogout = () => {
        this.setState({ user: null });
        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('name_prod');
        localStorage.removeItem('messages');
        window.location.href = '/login'
        // this.props.history.push('/login');
    }

    handleCart = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            this.props.history.push('/mycart');
        } else {
            this.props.history.push('/login');
        }
    }

    handleUpdateReading = async () => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);

        try {
            // Gọi API để cập nhật trạng thái đọc
            await axios.post('http://localhost:8080/user/api/notify/updateReading',
                { idUser: decoded.id_user },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Gọi lại fetchNotifications sau khi cập nhật thành công
            await this.fetchNotifications();
        } catch (error) {
            console.error('Error updating reading status:', error);
        }
    };

    checkReading = async () => {
        this.setState({
            is_reading: true
        })
    }

    render() {
        const { is_reading, user, categories, isNavbarVisible, isAtTop, showMarquee, notifications } = this.state;

        return (
            <>
                <Toaster position="top-right" />
                {/* Phần chữ chạy */}
                {showMarquee && (
                    <div className="fixed top-0 w-full z-50 bg-white " style={{ background: 'while' }}>
                        <marquee 
                            className="text-blue-950"
                            style={{ fontFamily: 'Dancing Script, cursive' }}>
                            Miễn phí vận chuyển với đơn hàng trên 300K, Hãy nhanh tay đặt hàng ngay hôm nay để nhận ưu đãi!
                        </marquee>
                    </div>
                )}

                {/* Thanh điều hướng */}
                <nav
                    className={`fixed top-0  w-full z-40 p-2 bg-white  transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
                        } ${isAtTop ? '' : 'bg-white shadow-lg'}`}
                    style={{ marginTop: showMarquee ? '30px' : '0', background: 'while' }}>

                    <div className="w-full max-w-7xl mx-auto  flex items-center justify-between md:grid-cols-4 gap-x-2  px-1  sm:px-2  ">
                        <button
                            className="text-2xl mb-1 font-semibold"
                            onClick={() => window.location.href = "/"}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: 'Georgia, serif',
                                color: '#A3C1E0',
                                transition: 'color 0.3s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#abcfdb'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#A3C1E0'}
                        >
                            MAOU
                        </button>

                        {/* Các thành phần khác của navbar */}
                        <ul className="list-none flex space-x-8 items-center justify-center flex-1">
                            <li className="relative group">
                                <CategoryDropdown categories={categories} />
                            </li>
                            <li className="relative group">
                                <NavLink to="/vouchers" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    VOUCHER
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                            <li className="relative group">
                                <NavLink to="/support" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    LIÊN HỆ
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                            <li className="relative group">
                                <NavLink to="/blog" className="font-bold text-black/60 hover:text-black/80 transition duration-200">
                                    TIN TỨC
                                </NavLink>
                                <span className="block h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                            </li>
                        </ul>

                        {/* Phần còn lại của navbar */}
                        <SearchBar />

                        <div
                            className="relative"
                            data-twe-dropdown-ref
                            data-twe-dropdown-alignment="end">
                            <button
                                onClick={this.handleUpdateReading}
                                className="me-4 flex items-center text-neutral-600 dark:text-white"
                                id="dropdownMenuButton1"
                                data-twe-dropdown-toggle-ref
                                aria-expanded="false"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <FaBell className="w-5 h-5" />
                                {notifications.some(notification => !notification.is_reading) && (
                                    <span
                                        className="absolute -mt-2.5 ml-2 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white"
                                    >
                                        {
                                            notifications.filter((notification) => !notification.is_reading).length
                                        }
                                    </span>
                                )}
                            </button>

                            <ul
                                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                                aria-labelledby="dropdownMenuButton1"
                                data-twe-dropdown-menu-ref>
                                {notifications.length > 0 ?
                                    notifications.map((notification, index) => {
                                        return (
                                            <div key={notification.id}>
                                                <li className="flex items-start px-4 py-3 border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                                                    <div className="mr-3">
                                                        <img src="https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg" alt="icon" className="w-8 h-8 rounded-full" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 dark:text-white">Thông báo của bạn 🎉</p>
                                                        <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                            {notification.name_notifi}
                                                        </p>
                                                    </div>
                                                </li>
                                            </div>
                                        )
                                    }) :
                                    <li className="text-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800">
                                        <div className="text-blue-500 font-semibold">Không có thông báo nào!</div>
                                    </li>
                                }
                                {notifications.length > 0 && (

                                    <button
                                        onClick={this.handleDeleteNotification}
                                        type="button"
                                        className="inline-block rounded-full bg-info px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-info-3 transition duration-150 ease-in-out hover:bg-info-accent-300 hover:shadow-info-2 focus:bg-info-accent-300 focus:shadow-info-2 focus:outline-none focus:ring-0 active:bg-info-600 active:shadow-info-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong my-3 mx-2">
                                        Xóa tất cả
                                    </button>
                                )}
                            </ul>
                        </div>

                        <button
                            onClick={this.handleGoToFavorite}
                            className="me-4 flex items-center text-neutral-600 dark:text-white"
                        >
                            <FaHeart className="w-5 h-5" />
                        </button>

                        <button onClick={() => this.handleCart()} className="me-4 flex items-center  text-neutral-600 dark:text-white">
                            <span className="[&>svg]:w-5">
                                <img
                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1Ljk5OTYgOEMxNS45OTk2IDkuMDYwODcgMTUuNTc4MiAxMC4wNzgzIDE0LjgyOCAxMC44Mjg0QzE0LjA3NzkgMTEuNTc4NiAxMy4wNjA1IDEyIDExLjk5OTYgMTJDMTAuOTM4NyAxMiA5LjkyMTMxIDExLjU3ODYgOS4xNzExNiAxMC44Mjg0QzguNDIxMDIgMTAuMDc4MyA3Ljk5OTU5IDkuMDYwODcgNy45OTk1OSA4TTMuNjMyODEgNy40MDEzOEwyLjkzMjgxIDE1LjgwMTRDMi43ODI0MyAxNy42MDU5IDIuNzA3MjQgMTguNTA4MiAzLjAxMjI3IDE5LjIwNDJDMy4yODAyNyAxOS44MTU3IDMuNzQ0NjIgMjAuMzIwNCA0LjMzMTc3IDIwLjYzODJDNS4wMDAwNiAyMSA1LjkwNTQ1IDIxIDcuNzE2MjMgMjFIMTYuMjgzQzE4LjA5MzcgMjEgMTguOTk5MSAyMSAxOS42Njc0IDIwLjYzODJDMjAuMjU0NiAyMC4zMjA0IDIwLjcxODkgMTkuODE1NyAyMC45ODY5IDE5LjIwNDJDMjEuMjkxOSAxOC41MDgyIDIxLjIxNjcgMTcuNjA1OSAyMS4wNjY0IDE1LjgwMTRMMjAuMzY2NCA3LjQwMTM4QzIwLjIzNyA1Ljg0ODc1IDIwLjE3MjMgNS4wNzI0MyAxOS44Mjg1IDQuNDg0ODZDMTkuNTI1NyAzLjk2NzQ0IDE5LjA3NDggMy41NTI2IDE4LjUzNDEgMy4yOTM4NUMxNy45MiAzIDE3LjE0MSAzIDE1LjU4MyAzTDguNDE2MjMgM0M2Ljg1ODIxIDMgNi4wNzkyMSAzIDUuNDY1MSAzLjI5Mzg0QzQuOTI0MzMgMy41NTI2IDQuNDczNDkgMy45Njc0NCA0LjE3MDcxIDQuNDg0ODZDMy44MjY4OSA1LjA3MjQzIDMuNzYyMTkgNS44NDg3NSAzLjYzMjgxIDcuNDAxMzhaIiBzdHJva2U9IiMzMzNGNDgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=="
                                    alt="Giỏ hàng"
                                    style={{ height: '24px', width: '24px' }}
                                />
                            </span>
                        </button>

                        {/* TÀI KHOẢN- */}
                        <div
                            className="relative"
                            data-twe-dropdown-ref
                            data-twe-dropdown-alignment="end">
                            <button
                                className="flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
                                id="dropdownMenuButton2"
                                data-twe-dropdown-toggle-ref
                                aria-expanded="false"
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <img
                                    src={user != null ? user.image : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuODE2MyAxOS40Mzg0QzYuNDI0NjIgMTguMDA1MiA3Ljg0NDkyIDE3IDkuNSAxN0gxNS41QzE3LjE1NTEgMTcgMTguNTc1NCAxOC4wMDUyIDE5LjE4MzcgMTkuNDM4NE0xNi41IDkuNUMxNi41IDExLjcwOTEgMTQuNzA5MSAxMy41IDEyLjUgMTMuNUMxMC4yOTA5IDEzLjUgOC41IDExLjcwOTEgOC41IDkuNUM4LjUgNy4yOTA4NiAxMC4yOTA5IDUuNSAxMi41IDUuNUMxNC43MDkxIDUuNSAxNi41IDcuMjkwODYgMTYuNSA5LjVaTTIyLjUgMTJDMjIuNSAxNy41MjI4IDE4LjAyMjggMjIgMTIuNSAyMkM2Ljk3NzE1IDIyIDIuNSAxNy41MjI4IDIuNSAxMkMyLjUgNi40NzcxNSA2Ljk3NzE1IDIgMTIuNSAyQzE4LjAyMjggMiAyMi41IDYuNDc3MTUgMjIuNSAxMloiIHN0cm9rZT0iIzMzM0Y0OCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'}
                                    className="rounded-full"
                                    style={{ height: "30px", width: "27px" }}
                                    alt=""
                                    loading="lazy" />
                                {/* <label style={{ marginLeft: "20px", background: "none", border: "none", cursor: "pointer" }}> {user != null ? user.username : ''}</label> */}
                            </button>
                            <ul
                                className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
                                aria-labelledby="dropdownMenuButton2"
                                data-twe-dropdown-menu-ref>
                                {
                                    user ?
                                        <>
                                            <li>
                                                <NavLink to="/myprofile"
                                                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                    onClick={() => window.location.href = "#"}
                                                    style={{ background: "none", border: "none", cursor: "pointer" }}
                                                >Tài khoản</NavLink>
                                            </li>

                                            <li>
                                                <button
                                                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                    onClick={() => this.handleLogout()}
                                                    style={{ background: "none", border: "none", cursor: "pointer" }}
                                                >Đăng xuất</button>
                                            </li>
                                        </>
                                        :
                                        <>
                                            <li>
                                                <NavLink to="/login"
                                                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                    onClick={() => window.location.href = "#"}
                                                    style={{ background: "none", border: "none", cursor: "pointer" }}
                                                >Đăng nhập</NavLink>
                                            </li>

                                            <li>
                                                <NavLink to="/register"
                                                    className="block w-full whitespace-nowrap bg-white px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-zinc-200/60 focus:bg-zinc-200/60 focus:outline-none active:bg-zinc-200/60 dark:bg-surface-dark dark:text-white dark:hover:bg-neutral-800/25 dark:focus:bg-neutral-800/25 dark:active:bg-neutral-800/25"
                                                    onClick={() => window.location.href = "#"}
                                                    style={{ background: "none", border: "none", cursor: "pointer" }}
                                                >Đăng ký</NavLink>
                                            </li>
                                        </>
                                }
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default withRouter(Navbar);
    
