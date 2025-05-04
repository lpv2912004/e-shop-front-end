import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const RegistrationForm = () => {
  // State to store form inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    birthday: "",
    phone: "",
    gender: "male", // Default to "Nam"
  });

  const history = useHistory();

  // Fetch email from localStorage
  useEffect(() => {
    const registrationStep = sessionStorage.getItem("registrationStep");
    if (registrationStep !== "otpVerified") {
      history.push("/otpregis"); // Redirect if not verified
    }
    const storedEmail = sessionStorage.getItem("tempEmail");
    if (storedEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: storedEmail,
      }));
    } else {
      history.push("/otpregis"); // Redirect if no email is found
    }

    // Cleanup logic when user tries to leave the page
    const handleBeforeUnload = (event) => {
        // Remove the items from storage
        localStorage.removeItem("emailRG");
        sessionStorage.removeItem("otpVerified");
        sessionStorage.removeItem("tempEmail");
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    
  }, [history]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send the form data without any additional wrapping
      const response = await axios.post(
        "http://localhost:8080/api/auth/create-account",
        {
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          email: formData.email,
          birthday: formData.birthday,
          phone: formData.phone,
          gender: formData.gender,
        }
      );

      // Handle success response
      if (response.status === 200) {
        console.log("Registration successful:", response.data);
        // Clear email and otpVerified from storage
        sessionStorage.removeItem("tempEmail");
        sessionStorage.removeItem("otpVerified");
        history.push("/login"); // Redirect to login on success
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(error.response.data); // Show error message to user
      } else if (error.request) {
        console.error("No response from the server:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        console.error("Error occurred during the request:", error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {/* Social Buttons */}
      {/* Username */}
      <div className="relative mb-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
          placeholder="Tên đăng nhập"
          required
        />
      </div>

      {/* Password */}
      <div className="relative mb-4">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
          placeholder="Mật khẩu"
          required
        />
      </div>
      {/* cfpass*/}
      <div className="relative mb-4">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
          placeholder="Xác nhận mật khẩu"
          required
        />
      </div>

      {/* Full name and email */}
      <div className="flex justify-between space-x-4">
        <div className="relative mb-6 w-1/2">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
            placeholder="Họ tên đầy đủ"
            required
          />
        </div>
        <div className="relative mb-6 w-1/2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
            placeholder="Email"
            readOnly // Make the email read-only since it's pre-filled
          />
        </div>
      </div>

      {/* Birthdate and Phone Number */}
      <div className="flex justify-between space-x-4">
        <div className="relative mb-6 w-1/2">
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
            required
          />
        </div>
        <div className="relative mb-6 w-1/2">
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="peer block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring"
            placeholder="Số điện thoại"
            required
          />
        </div>
      </div>

      {/* Gender Radio Buttons */}
      <div className="mb-6">
        <label className="mr-4">Giới tính:</label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={formData.gender === "male"}
          onChange={handleInputChange}
        />{" "}
        Nam
        <input
          type="radio"
          name="gender"
          value="female"
          checked={formData.gender === "female"}
          onChange={handleInputChange}
          className="ml-4"
        />{" "}
        Nữ
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        Đăng ký
      </button>

      <div className="text-center mt-2">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-red-500">
          Đăng nhập
        </a>
      </div>
    </form>
  );
};

export default RegistrationForm;
