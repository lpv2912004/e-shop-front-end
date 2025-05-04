import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import Pagination from './Pagination';
import { DownloadIcon } from '@heroicons/react/solid';

const InventoryStatistics = () => {
    const [inventoryStatistics, setInventoryStatistics] = useState([]);
    const [currentInventoryProducts, setCurrentInventoryProducts] = useState([]);
    const [currentPageInventory, setCurrentPageInventory] = useState(1);
    const productsPerPage = 10;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/statistics/inventory', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setInventoryStatistics(response.data);
                setLoading(false);
                handlePagination(response.data, 1);
            })
            .catch(error => {
                console.error('Error fetching inventory statistics:', error);
                setLoading(false);
            });
    }, []);

    const handlePagination = (data, page) => {
        const indexOfLastProduct = page * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct);
        setCurrentInventoryProducts(currentProducts);
    };

    const paginateInventory = (pageNumber) => {
        setCurrentPageInventory(pageNumber);
        handlePagination(inventoryStatistics, pageNumber);
    };

    // Function to flatten data for export
    const exportData = inventoryStatistics.map((product, index) => ({
        'STT': index + 1,
        'Tên sản phẩm': product.productName || "Unknown Product",
        'Số lượng tồn kho': product.quantityAvailable || 0,
        'Giá': product.price || "N/A",        // Thêm giá
        'Màu sắc': product.colorName || "N/A", // Thêm màu sắc
        'Kích thước': product.sizeName || "N/A" // Thêm kích thước
    }));

    // Function to generate the Excel file
    const generateExcelReport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Adjust column widths for better readability
        ws['!cols'] = [
            { wch: 5 },   // STT
            { wch: 30 },  // Tên sản phẩm
            { wch: 20 },  // Số lượng tồn kho
            { wch: 15 },  // Giá
            { wch: 15 },  // Màu sắc
            { wch: 15 },  // Kích thước
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Inventory Statistics');
        XLSX.writeFile(wb, `Inventory_Statistics.xlsx`);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">
                Thống kê tồn kho
                <button
                    onClick={generateExcelReport}
                    className=" text-black pr text-sm  rounded   gap-2"
                >
                    <DownloadIcon className="h-5 w-5 hover:bg-red-500" />
                </button>
            </h3>

            {loading ? (
                <p>Loading...</p>
            ) : inventoryStatistics.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">STT</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Tên sản phẩm</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Số lượng tồn kho</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Giá</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Màu sắc</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Kích thước</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {currentInventoryProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-2 px-4">{(currentPageInventory - 1) * productsPerPage + index + 1}</td>
                                    <td className="py-2 px-4">{product.productName || "Unknown Product"}</td>
                                    <td className="py-2 px-4">{product.quantityAvailable || 0}</td>
                                    <td className="py-2 px-4">{product.price || "N/A"}</td>
                                    <td className="py-2 px-4">
                                        {product.colorName || "N/A"}
                                        <span
                                            className="w-6 h-6 rounded-full inline-block border ml-2"
                                            style={{ backgroundColor: product.colorName }} // sử dụng mã màu hoặc mặc định
                                        ></span>
                                    </td>

                                    <td className="py-2 px-4">{product.sizeName || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPageInventory}
                            totalItems={inventoryStatistics.length}
                            itemsPerPage={productsPerPage}
                            paginate={paginateInventory}
                        />
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Chưa có dữ liệu tồn kho.</p>
            )}
        </div>
    );
};

export default InventoryStatistics;
