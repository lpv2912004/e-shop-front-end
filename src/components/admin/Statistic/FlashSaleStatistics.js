import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Import xlsx library
import { DownloadIcon } from '@heroicons/react/solid';
const FlashSaleStatistics = ({ startDate, endDate }) => {
    const [flashSaleStats, setFlashSaleStats] = useState([]);

    useEffect(() => {
        if (startDate && endDate) {
            const token = localStorage.getItem('jwtToken');
            axios.get('http://localhost:8080/admin/api/statistics/flash-sale-statistics', {
                params: { fromDate: startDate, toDate: endDate },
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    setFlashSaleStats(response.data);
                })
                .catch(error => {
                    console.error('Error fetching flash sale statistics:', error);
                });
        }
    }, [startDate, endDate]);

    // Flatten data for export
    const exportData = flashSaleStats.map(stat => ({
        'Tên Flash Sale': stat.flashSaleName,
        'Đơn hàng': stat.orderId,
        'Người dùng': stat.userId,
        'Số lần sử dụng': stat.totalTimesUsed,
        'Số lượng đã bán': stat.totalItemsSold
    }));
    const handleExport = () => {
        generateExcelReport(exportData, startDate, endDate);
    };
    // Function to generate Excel report
    const generateExcelReport = () => {
        const wb = XLSX.utils.book_new();  // Create a new workbook
        const ws = XLSX.utils.json_to_sheet(exportData);  // Convert data to sheet
        
        // Adjust the column widths
        ws['!cols'] = [
            { wch: 20 }, // Tên Flash Sale
            { wch: 15 }, // Đơn hàng
            { wch: 15 }, // Người dùng
            { wch: 18 }, // Số lần sử dụng
            { wch: 20 }  // Số lượng đã bán
        ];

        // Add the sheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Flash Sale Statistics');
        
        // Export the file
        XLSX.writeFile(wb, `Flash_Sale_Statistics_${startDate}_${endDate}.xlsx`);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
               <h3 className="font-bold text-lg mb-4">Chương trình khuyến mãi      <button
                onClick={handleExport}
                className=" text-black pr text-sm  rounded   gap-2"
            >
              
                <DownloadIcon className="h-5 w-5 hover:bg-red-500" />
            </button></h3>

            {flashSaleStats.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Tên Flash Sale</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Đơn hàng</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Người dùng</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Số lần sử dụng</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Số lượng đã bán</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {flashSaleStats.map((stat, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="py-2 px-4">{stat.flashSaleName}</td>
                                <td className="py-2 px-4">{stat.orderId}</td>
                                <td className="py-2 px-4">{stat.username}</td>
                                <td className="py-2 px-4">{stat.totalTimesUsed}</td>
                                <td className="py-2 px-4">{stat.totalItemsSold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu chương trình khuyến mãi.</p>
            )}
        </div>
    );
};

export default FlashSaleStatistics;
