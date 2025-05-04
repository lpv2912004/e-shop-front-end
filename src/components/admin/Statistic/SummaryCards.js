import React from 'react';

const SummaryCards = ({ totalOrders, netRevenue, actualRevenue, grossMargin }) => {
    return (
        <div className="flex flex-wrap justify-between gap-12 mt-8">
            {/* Card 1: Total Orders */}
            <div className="flex-1 min-w-[250px] bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg text-center border border-gray-200">
                <h3 className="text-gray-500 font-semibold">Số đơn hàng</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalOrders}</p>
                {/* <p className="text-green-500 text-sm mt-1">+3%</p> */}
            </div>

            {/* Card 2: Net Revenue */}
            <div className="flex-1 min-w-[250px] bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg text-center border border-gray-200">
                <h3 className="text-gray-500 font-semibold">Doanh thu Sản Phẩm</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(netRevenue).toLocaleString()} đ</p> {/* Rounded revenue */}
                {/* <p className="text-green-500 text-sm mt-1">+55%</p> */}
            </div>

            {/* Card 3: Actual Revenue */}
            <div className="flex-1 min-w-[250px] bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 rounded-lg text-center border border-gray-200">
                <h3 className="text-gray-500 font-semibold">Doanh thu thuần</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{Math.round(actualRevenue).toLocaleString()} đ</p> {/* Rounded revenue */}
                {/* <p className="text-green-500 text-sm mt-1">+55%</p> */}
            </div>
        </div>
    );
};

export default SummaryCards;
