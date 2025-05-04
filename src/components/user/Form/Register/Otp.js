import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // Use useHistory for navigation

function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory(); // Use useHistory hook

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      history.push("/forgot"); // Redirect to signup if no email is found
    }
  }, [history]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value) || value === "") return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) document.getElementById(`otp-${index - 1}`).focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join(""); 
  
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-otp", {
        emailRQ: email,  // Combine both email and otp into a single object
        otpRQ: enteredOtp
      });
  
      if (response && response.data) {
        setMessage("Verification successful!");
        
        setTimeout(() => {
          history.push("/resetpass"); // Navigate to reset password page
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("OTP verification failed. Please try again.");
    }
  };

  // Function to handle resend OTP
  const resendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", { emailRQ: email });
      
      if (response && response.data) {
        setMessage("OTP đã được gửi lại tới email của bạn.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Xác thực Email</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>Chúng tôi đã gửi mã OTP đến Email: {email} của bạn</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
              {otp.map((data, index) => (
                <div key={index} className="w-16 h-16">
                  <input
                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    id={`otp-${index}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-5 mt-6">
              <button
                className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                type="submit"
              >
               Xác thực tài khoản
              </button>

              <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                <p>Không nhận được mã?</p>
                <button
                  className="flex flex-row items-center text-blue-600 cursor-pointer"
                  onClick={resendOtp}
                >
                  Gửi lại mã
                </button>
              </div>
            </div>
          </form>
          {message && <p className="text-red-500 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;




