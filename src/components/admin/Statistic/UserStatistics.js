import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Pagination from './Pagination';
import { DownloadIcon } from '@heroicons/react/solid';
const UserStatistics = ({ userStatistics }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState({});
    const [expandedUsers, setExpandedUsers] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        // Get startDate and endDate from localStorage
        const storedStartDate = localStorage.getItem('startDate');
        const storedEndDate = localStorage.getItem('endDate');
        
        if (storedStartDate && storedEndDate) {
            setStartDate(storedStartDate);
            setEndDate(storedEndDate);
        } else {
            // If no dates in localStorage, default to today's date
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const grouped = userStatistics.reduce((acc, user) => {
            if (!acc[user.username]) {
                acc[user.username] = {
                    totalOrders: user.totalOrders,
                    totalAmount: user.totalAmount,
                    products: []
                };
            }
            acc[user.username].products.push({
                productName: user.productDetails.productName,
                quantity: user.productDetails.quantity,
                price: user.productDetails.price,
                colorName: user.productDetails.colorName,
                sizeName: user.productDetails.sizeName
            });
            return acc;
        }, {});

        setGroupedData(grouped);
        setLoading(false);
    }, [userStatistics]);

    const toggleExpand = (username) => {
        setExpandedUsers((prevState) => ({
            ...prevState,
            [username]: !prevState[username]
        }));
    };

    const handleExport = () => {
        generateExcelReport(exportData, startDate, endDate);
    };

    // Flattened data for export
    const exportData = Object.keys(groupedData).flatMap((username) => {
        return groupedData[username].products.map(product => ({
            'Tên khách hàng': username,
            'Tổng đơn hàng': groupedData[username].totalOrders,
            'Tên sản phẩm': product.productName,
            'Số lượng': product.quantity,
            'Giá': product.price,
            'Màu': product.colorName,
            'Kích thước': product.sizeName,
            'Thống kê khách hàng mua hàng': `Thống kê từ ngày ${startDate} đến ngày ${endDate}`,  // Additional column
            'Ngày lấy dữ liệu': `${startDate} - ${endDate}`  // Additional column
        }));
    });

    // Excel report generation
    const generateExcelReport = (data, startDate, endDate) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([  
            [{ v: `16:47 ${new Date().toLocaleDateString('en-GB')}`, t: 's' }, { v: ' ~ Báo cáo người dùng ~ ', t: 's' }],
            [],
            [],
            [{ v: 'Báo cáo Kênh bán hàng', t: 's' }],
            [{ v: `Từ ngày ${startDate} đến ngày ${endDate}`, t: 's' }], // Correct use of startDate and endDate
            [],
            ['Tên khách hàng', 'Tổng đơn hàng', 'Tên sản phẩm', 'Số lượng', 'Giá', 'Màu', 'Kích thước'],
        ]);
        
        data.forEach((row) => {
            XLSX.utils.sheet_add_aoa(ws, [[
                row['Tên khách hàng'],
                row['Tổng đơn hàng'],
                row['Tên sản phẩm'],
                row['Số lượng'],
                row['Giá'],
                row['Màu'],
                row['Kích thước'],
            ]], { origin: -1 });
        });
        
        // Adjust column widths
        ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
        
        // Add the sheet to the workbook and save the file
        XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
        XLSX.writeFile(wb, `Báo cáo_người_dùng_mua_hàng_${startDate}_${endDate}.xlsx`);
    };

    // Current users for pagination
    const currentUsers = Object.keys(groupedData).slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                 <h3 className="font-bold text-lg mb-4">Thống kê Người dùng      <button
                onClick={handleExport}
                className=" text-black pr text-sm  rounded   gap-2"
            >
              
                <DownloadIcon className="h-5 w-5 hover:bg-red-500" />
            </button></h3>
            {/* <button
                onClick={handleExport}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Xuất ra Excel
            </button> */}

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    {currentUsers.length > 0 ? (
                        currentUsers.map((username, index) => (
                            <div key={index} className="mb-4 p-4 border rounded">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg">Người dùng: {username}</h4>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => toggleExpand(username)}
                                    >
                                        {expandedUsers[username] ? 'Ẩn chi tiết' : 'Hiện chi tiết'}
                                    </button>
                                </div>
                                


                                {expandedUsers[username] && (
                                    <table className="min-w-full bg-white border border-gray-300 mt-4">
                                        <thead className="bg-gray-100 border-b border-gray-300">
                                            <tr>
                                                <th className="py-2 px-4 border">Tên sản phẩm</th>
                                                <th className="py-2 px-4 border">Số lượng</th>
                                                <th className="py-2 px-4 border">Giá</th>
                                                <th className="py-2 px-4 border">Màu sắc</th>
                                                <th className="py-2 px-4 border">Kích thước</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupedData[username].products.map((product, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-2 px-4 border">{product.productName}</td>
                                                    <td className="py-2 px-4 border">{product.quantity}</td>
                                                    <td className="py-2 px-4 border">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </td>

                                                    <td className="py-2 px-4 border flex items-center space-x-2">
                                                        {/* Vòng tròn màu */}
                                                        <span
                                                            className="w-6 h-6 rounded-full border"
                                                            style={{ backgroundColor: product.colorName }} // Sử dụng mã màu từ product.colorCode
                                                        ></span>
                                                        {/* Tên màu */}
                                                        <span className="text-gray-700">{product.colorName}</span>
                                                    </td>

                                                    <td className="py-2 px-4 border">{product.sizeName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Không có dữ liệu người dùng.</p>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalItems={Object.keys(groupedData).length}
                        itemsPerPage={usersPerPage}
                        paginate={Pagination}
                    />
                </div>
            )}
        </div>
    );
};

export default UserStatistics;
