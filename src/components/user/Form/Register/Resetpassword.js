import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [message, setMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from the URL
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast("Không tìm thấy người dùng. Vui lòng kiểm tra mail", {
        type: 'info',
        position: 'top-right',
        duration: 3000,
        closeButton: true,
        richColors: true
      })
      history.push("/forgot");
    }
  }, [location, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast("Xác nhận mật khẩu không khớp!", {
        type: 'error',
        position: 'top-right',
        duration: 3000,
        closeButton: true,
        richColors: true
      })
      return;
    }

    try {
      // Call the reset-password API
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", {
        token: token, // pass the token from the URL
        newPassword: newPassword,
        confirmPassword: confirmPassword
      });

      if (response && response.data) {
        toast(response.data, {
          type: 'success',
          position: 'top-right',
          duration: 3000,
          closeButton: true,
          richColors: true
        })

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);

      // Handle any errors returned from the server
      if (error.response) {
        if (error.response.data) {
          toast((error.response.data.message || error.response.data), {
            type: 'error',
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            richColors: true
          })
        } else {
          toast(error.response.status, {
            type: 'error',
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            richColors: true
          })
        }
      } else if (error.request) {
        toast("Không có phản hồi từ server, hãy thử lại sau!", {
          type: 'error',
          position: 'top-right',
          duration: 3000,
          closeButton: true,
          richColors: true
        })
      } else {
        toast(error.message, {
          type: 'error',
          position: 'top-right',
          duration: 3000,
          closeButton: true,
          richColors: true
        })
      }
    }
  };

  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Thiết lập lại mật khẩu mới</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>Nhập mật khẩu mới bên dưới</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="password"
                  className="peer block w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  className="peer block w-full rounded border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-3 rounded bg-blue-600 text-white font-bold"
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
