import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Collapse, Dropdown, Ripple, Carousel, Input, initTWE } from "tw-elements";
//-----------------------------------------------------------------------------------
import { toast, Toaster } from 'sonner';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
    // Giả sử idUser đã được lưu trong localStorage
  })
  .catch((err) => {
    console.log("Service Worker registration failed:", err);
  });

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


const AdminHeader = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    initTWE({ Collapse, Dropdown, Ripple, Carousel, Input });
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);

      axios.get(`http://localhost:8080/admin/api/users/${decoded.id_user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setUserImage(response.data.image_user);
        })
        .catch(error => {
          console.error('Error fetching user image:', error);
        });
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login'
    // props.history.push('/login');
  };


  // thông báo
  // Hàm fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const decoded = jwtDecode(token);

      if (token) {
        const response = await axios.get(
          "http://localhost:8080/user/api/notify/listNotificationAdmin",

          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Hàm cập nhật trạng thái đọc
  const handleUpdateReading = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const decoded = jwtDecode(token);

      // Gọi API để cập nhật trạng thái đọc
      await axios.post(
        "http://localhost:8080/user/api/notify/updateReading",
        { idUser: decoded.id_user },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Gọi lại fetchNotifications sau khi cập nhật thành công
      await fetchNotifications();
      setIsReading(true);
    } catch (error) {
      console.error("Error updating reading status:", error);
    }
  };

  // Gọi fetchNotifications khi component được render lần đầu
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      setNotifications([]); // Xóa thông báo để tránh chồng chất
      fetchNotifications(); // Refetch thông báo
    }
  };

  useEffect(() => {
    // Thêm event listener khi component được mount
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Xóa event listener khi component unmount
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Chỉ chạy một lần khi component mount



  return (
    <header className="bg-gradient-to-r to-[#abcfdb] from-[#FFFF] p-2 shadow flex justify-between items-center">
      {/* <Toaster position="top-left" /> */}

      <div className="flex items-center"></div>
      <div className="flex items-center space-x-4">
        {/* <button className="text-gray-600">
          <FaBell />
        </button> */}

        <div
          className="relative"
          data-twe-dropdown-ref
          data-twe-dropdown-alignment="end"
        >
          <button
            onClick={handleUpdateReading}
            className="me-4 flex items-center text-neutral-600 dark:text-white"
            id="dropdownMenuButton1"
            data-twe-dropdown-toggle-ref
            aria-expanded="false"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FaBell className="w-5 h-5" />
            {notifications.some((notification) => !notification.is_reading) && (
              <span className="absolute -mt-2.5 ml-2 rounded-full bg-danger px-1.5 py-0.5 text-xs text-white">
                {
                  notifications.filter((notification) => !notification.is_reading)
                    .length
                }
              </span>
            )}
          </button>

          <ul
            className="absolute z-[1000] float-left m-3 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-surface-dark"
            aria-labelledby="dropdownMenuButton1"
            data-twe-dropdown-menu-ref
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id}>
                  <li className="flex container items-start px-4 py-3 border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                    <div className="mr-3">
                      <img
                        src="https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg"
                        alt="icon"
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        Thông báo của bạn 🎉
                      </p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {notification.name_notifi}
                      </p>
                    </div>
                  </li>
                </div>
              ))
            ) : (
              <li className="text-center px-2 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800">
                <div className="text-blue-500 font-semibold">
                  Không có thông báo nào!
                </div>
              </li>
            )}
          </ul>
        </div>


        <div className="relative">
          <button
            className="w-10 h-10 rounded-full overflow-hidden"
            onClick={toggleDropdown}
          >
            <img
              src={userImage || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </button>



          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 text-sm">
              <button
                className="block w-full text-left px-3 py-1.5 text-gray-800 hover:bg-gray-100"
                onClick={() => props.history.push('/admin/profile')}
              >
                Thông tin
              </button>
              <button
                className="block w-full text-left px-3 py-1.5 text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default withRouter(AdminHeader);