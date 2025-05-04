import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import Pagination from './Pagination';
import { DownloadIcon } from '@heroicons/react/solid';
const SalesStatistics = ({ salesStatistics = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [currentSalesProducts, setCurrentSalesProducts] = useState([]);
    const [startDate, endDate] = useState('');
    useEffect(() => {
        const indexOfLastProduct = currentPage * itemsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
        setCurrentSalesProducts(salesStatistics.slice(indexOfFirstProduct, indexOfLastProduct));
    }, [salesStatistics, currentPage, itemsPerPage]);
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');
    const paginateSales = (pageNumber) => setCurrentPage(pageNumber);
    const handleExport = () => {
        generateExcelReport(exportData, storedStartDate, storedEndDate);
    };
    // Function to flatten data for export
    const exportData = currentSalesProducts.map((product, index) => ({
        'STT': (currentPage - 1) * itemsPerPage + index + 1,
        'Tên sản phẩm': product.nameProd,
        'Phiên bản': (() => {
            const [colorCode, size] = product.variantName.split(' - ');
            return `${colorCode.trim()} - ${size.trim()}`;
        })(),
        'Giá': Math.round(product.price).toLocaleString() + ' đ',
        'Số lượng': product.quantity
    }));

    // Function to generate the Excel file
    const generateExcelReport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Adjust column widths for better readability
        ws['!cols'] = [
            { wch: 5 },   // STT
            { wch: 30 },  // Tên sản phẩm
            { wch: 20 },  // Phiên bản
            { wch: 15 },  // Giá
            { wch: 10 },  // Số lượng
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Sales Statistics');
        XLSX.writeFile(wb, `Sales_Statistics_${currentPage}.xlsx`);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
               <h3 className="font-bold text-lg mb-4">Sản phẩm bán được    <button
                onClick={handleExport}
                className=" text-black pr text-sm  rounded   gap-2"
            >
              
                <DownloadIcon className="h-5 w-5 hover:bg-red-500" />
            </button></h3>

            {currentSalesProducts.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">STT</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Tên sản phẩm</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Phiên bản</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Giá</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {currentSalesProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="py-2 px-4">{product.nameProd}</td>
                                    <td className="py-2 px-4 flex items-center space-x-2">
                                        {(() => {
                                            const [colorCode, size] = product.variantName.split(' - ');

                                            return (
                                                <>
                                                    <span
                                                        className="w-6 h-6 rounded-full inline-block border"
                                                        style={{ backgroundColor: colorCode.trim() }}
                                                    ></span>
                                                    <span className="text-gray-700">{size.trim()}</span>
                                                </>
                                            );
                                        })()}
                                    </td>
                                    <td className="py-2 px-4">{Math.round(product.price).toLocaleString()} đ</td>
                                    <td className="py-2 px-4">{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={salesStatistics.length}
                            itemsPerPage={itemsPerPage}
                            paginate={paginateSales}
                        />
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu sản phẩm bán được trong khoảng thời gian này.</p>
            )}
        </div>
    );
};

export default SalesStatistics;
