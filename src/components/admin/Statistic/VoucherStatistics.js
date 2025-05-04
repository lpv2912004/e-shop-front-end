import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Pagination from './Pagination';
import { DownloadIcon } from '@heroicons/react/solid';
const VoucherStatistics = ({ startDate, endDate }) => {
    const [voucherStatistics, setVoucherStatistics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const vouchersPerPage = 10;
    const [currentVouchers, setCurrentVouchers] = useState([]);

    useEffect(() => {
        if (startDate && endDate) {
            setLoading(true);
            const token = localStorage.getItem('jwtToken');

            axios.get('http://localhost:8080/admin/api/statistics/voucher-statistics', {
                params: { fromDate: startDate, toDate: endDate },
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    setVoucherStatistics(response.data);
                    setLoading(false);
                    handlePagination(response.data, 1);
                })
                .catch(error => {
                    console.error('Error fetching voucher statistics:', error);
                    setLoading(false);
                });
        }
    }, [startDate, endDate]);

    const handlePagination = (data, page) => {
        const indexOfLastVoucher = page * vouchersPerPage;
        const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
        const currentVouchers = data.slice(indexOfFirstVoucher, indexOfLastVoucher);
        setCurrentVouchers(currentVouchers);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        handlePagination(voucherStatistics, pageNumber);
    };
    const handleExport = () => {
        const data = voucherStatistics.map((voucher) => ({
            'Mã Voucher': voucher.voucherCode,
            'Mã Đơn Hàng': voucher.orderId,
            'Chiết Khấu (%)': voucher.totalDiscount,
            'Loại': voucher.voucherType,
            'Người Dùng': voucher.userName
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Voucher Statistics');
        XLSX.writeFile(wb, `Voucher_Statistics_${startDate}_${endDate}.xlsx`);
    };


    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="font-bold text-lg mb-4">Thống kê Voucher      <button
                onClick={handleExport}
                className=" text-black pr text-sm  rounded   gap-2"
            >

                <DownloadIcon className="h-5 w-5 hover:bg-red-500" />
            </button></h3>

            {/* Export to Excel Button */}


            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : voucherStatistics.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">STT</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Mã Voucher</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Mã đơn hàng</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Chiết khấu (%)</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Loại</th>
                                <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Người dùng</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {currentVouchers.map((voucher, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-2 px-4 text-sm">{(currentPage - 1) * vouchersPerPage + index + 1}</td>
                                    <td className="py-2 px-4 text-sm">{voucher.voucherCode}</td>
                                    <td className="py-2 px-4 text-sm">{voucher.orderId}</td>
                                    <td className="py-2 px-4 text-sm">{voucher.totalDiscount}%</td>
                                    <td className="py-2 px-4 text-sm">{voucher.voucherType}</td>
                                    <td className="py-2 px-4 text-sm">{voucher.userName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={voucherStatistics.length}
                            itemsPerPage={vouchersPerPage}
                            paginate={paginate}
                        />
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Không có dữ liệu voucher trong khoảng thời gian này.</p>
            )}
        </div>
    );
};

export default VoucherStatistics;
