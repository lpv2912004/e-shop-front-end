import React from 'react';

const RevenueStatistics = ({ revenueStatistics }) => {
    return (
        <div className="bg-white shadow p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Doanh thu</h3>
            {revenueStatistics !== null ? (
                <p>Tổng doanh thu: {revenueStatistics.toLocaleString()} VND</p>
            ) : (
                <p>Chưa có dữ liệu.</p>
            )}
        </div>
    );
};

export default RevenueStatistics;
