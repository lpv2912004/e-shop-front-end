import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import '../../assets/modal.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen text-gray-700">
      {/* Sidebar */}
      <div
        className={`fixed h-screen bg-white shadow-md transition-transform duration-300 overflow-y-auto 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:w-64 w-64`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 bg-gradient-to-r from-[#E3F2FD] to-[#dad1d1]">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="p-6 flex-grow overflow-auto">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
      
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-200 text-white p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AdminLayout;