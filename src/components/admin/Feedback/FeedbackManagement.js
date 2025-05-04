import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStar, setFilterStar] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterUserName, setFilterUserName] = useState('');
    const [filterProductName, setFilterProductName] = useState('');
    const [expandedIds, setExpandedIds] = useState([]);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast("Token không tồn tại! Vui lòng đăng nhập lại!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            setLoading(false);
            return;
        }

        axios
            .get('http://localhost:8080/admin/api/feedbacks', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setFeedbacks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    toast("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    });
                } else {
                    toast("Lỗi khi tải danh sách đánh giá!", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    });
                }
            });
    };

    const toggleExpand = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((expId) => expId !== id) : [...prev, id]
        );
    };

    const renderContent = (feedback) => {
        if (!feedback.content) return null;

        const isExpanded = expandedIds.includes(feedback.id);
        const contentToShow = isExpanded
            ? feedback.content
            : feedback.content.substring(0, 50) + (feedback.content.length > 50 ? '...' : '');

        return (
            <>
                <p>{contentToShow}</p>
                {feedback.content.length > 50 && (
                    <button
                        className="text-blue-500"
                        onClick={() => toggleExpand(feedback.id)}
                    >
                        {isExpanded ? 'Thu gọn' : 'Hiện thêm'}
                    </button>
                )}
            </>
        );
    };

    const filteredFeedbacks = feedbacks.filter((feedback) => {
        const matchesStar = filterStar ? feedback.numberStar === parseInt(filterStar) : true;
        const matchesDate = filterDate
            ? new Date(feedback.createdDate).toLocaleDateString() === filterDate
            : true;
        const matchesUserName = filterUserName
            ? feedback.userName.toLowerCase().includes(filterUserName.toLowerCase())
            : true;
        const matchesProductName = filterProductName
            ? feedback.productName.toLowerCase().includes(filterProductName.toLowerCase())
            : true;
        return matchesStar && matchesDate && matchesUserName && matchesProductName;
    });

    const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
    const currentFeedbacks = filteredFeedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const renderPagination = () => {
        const pages = [];
        const pageRange = 2;

        pages.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
            >
                1
            </button>
        );

        if (currentPage > pageRange + 2) {
            pages.push(<span key="dots-prev" className="pagination-dots">...</span>);
        }

        for (
            let i = Math.max(2, currentPage - pageRange);
            i <= Math.min(totalPages - 1, currentPage + pageRange);
            i++
        ) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - pageRange - 1) {
            pages.push(<span key="dots-next" className="pagination-dots">...</span>);
        }

        if (totalPages > 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
             <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">Quản lý đánh giá sản phẩm</h2>

            <div className="flex space-x-4 mb-4">
                <input
                    type="number"
                    placeholder="Lọc theo số sao"
                    className="border px-4 py-2"
                    value={filterStar}
                    onChange={(e) => setFilterStar(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Lọc theo ngày bình luận"
                    className="border px-4 py-2"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Lọc theo tên người dùng"
                    className="border px-4 py-2"
                    value={filterUserName}
                    onChange={(e) => setFilterUserName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Lọc theo tên sản phẩm"
                    className="border px-4 py-2"
                    value={filterProductName}
                    onChange={(e) => setFilterProductName(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <>
                    <table className="min-w-full bg-white shadow-md rounded-lg border">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-6 py-3 border-b">Ngày tạo</th>
                                <th className="px-6 py-3 border-b">Số sao</th>
                                <th className="px-6 py-3 border-b">Sản phẩm</th>
                                <th className="px-6 py-3 border-b">Người dùng</th>
                                <th className="px-6 py-3 border-b">Nội dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFeedbacks.map((feedback) => (
                                <tr key={feedback.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b">
                                        {new Date(feedback.createdDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        {[...Array(5)].map((_, index) => (
                                            <FontAwesomeIcon
                                                key={index}
                                                icon={faStar}
                                                className={
                                                    index < feedback.numberStar
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 border-b">{feedback.productName}</td>
                                    <td className="px-6 py-4 border-b">{feedback.userName}</td>
                                    <td className="px-6 py-4 border-b">{renderContent(feedback)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-4">
                        <div>
                            Hiển thị {currentFeedbacks.length} trong tổng số{' '}
                            {filteredFeedbacks.length} đánh giá
                        </div>
                        <div className="pagination-container">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`pagination-button ${
                                    currentPage === 1 ? 'disabled' : ''
                                }`}
                            >
                                &lt;
                            </button>
                            {renderPagination()}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`pagination-button ${
                                    currentPage === totalPages ? 'disabled' : ''
                                }`}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FeedbackManagement;
