import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs'; // Thêm thư viện dayjs để định dạng ngày

const DailyOrderCountChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => dayjs(date).format('DD/MM/YYYY')} 
                    label={{ value: '', position: 'insideBottomRight', offset: 0 }} 
                />
                <YAxis label={{ value: 'Số lượng đơn hàng', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                    formatter={(value) => `${value} đơn`} 
                    labelFormatter={(label) => `: ${dayjs(label).format('DD/MM/YYYY')}`} 
                />
                <Legend formatter={() => 'Số lượng đơn hàng'} />
                <Bar dataKey="orderCount" name="Số lượng đơn hàng" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DailyOrderCountChart;
