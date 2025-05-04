import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const DailyRevenueChart = ({ data }) => {
    // Hàm định dạng tiền
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) => dayjs(date).format('DD/MM/YYYY')} // Định dạng ngày trên trục X
                    label={{ value: '', position: 'insideBottomRight', offset: 0 }}
                />
                <YAxis
                    style={{ fontSize: '10px' }}  // Thêm thuộc tính fontSize để chỉnh sửa kích thước chữ
                    label={{ value: 'Doanh thu (VND)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={formatCurrency} // Định dạng trục Y
                />
                <Tooltip
                    formatter={(value) => formatCurrency(value)} // Định dạng tiền trong Tooltip
                    labelFormatter={(label) => `${dayjs(label).format('DD/MM/YYYY')}`} // Định dạng ngày trong Tooltip
                />
                <Legend formatter={() => 'Doanh thu'} />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DailyRevenueChart;
