import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DateFilter from './DateFilter';
import SalesStatistics from './SalesStatistics';
import RevenueStatistics from './RevenueStatistics';
import InventoryStatistics from './InventoryStatistics';
import SummaryCards from './SummaryCards';
import UserStatistics from './UserStatistics';
import VoucherStatistics from './VoucherStatistics';
import FlashSaleStatistics from './FlashSaleStatistics';
import DailyRevenueChart from './DailyRevenueChart';
import DailyOrderCountChart from './DailyOrderCountChart';

const Statistics = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesStatistics, setSalesStatistics] = useState([]);
    const [revenueStatistics, setRevenueStatistics] = useState(null);
    const [revenueStatistics2, setRevenueStatistics2] = useState(null);
    const [inventoryStatistics, setInventoryStatistics] = useState([]);
    const [userStatistics, setUserStatistics] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [grossMargin, setGrossMargin] = useState(100);
    const [dailyRevenueData, setDailyRevenueData] = useState([]);
    const [dailyOrderCountData, setDailyOrderCountData] = useState([]);

    useEffect(() => {
        // On component mount, load startDate and endDate from localStorage
        const storedStartDate = localStorage.getItem('startDate');
        const storedEndDate = localStorage.getItem('endDate');
        
        if (storedStartDate && storedEndDate) {
            setStartDate(storedStartDate);
            setEndDate(storedEndDate);
        } else {
            // If no values in localStorage, set today's date as default
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);
        }
    }, []);
    useEffect(() => {
        // Whenever startDate or endDate changes, store them in localStorage
        if (startDate && endDate) {
            localStorage.setItem('startDate', startDate);
            localStorage.setItem('endDate', endDate);
            handleFetchStatistics();
        }
    }, [startDate, endDate]);
    
    const handleFetchStatistics = () => {
        if (!startDate || !endDate) {
            return;
        }

        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/admin/api/statistics/daily-revenue', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setDailyRevenueData(response.data);
        }).catch(error => {
            console.error('Error fetching daily revenue data:', error);
        });
        

        axios.get('http://localhost:8080/admin/api/statistics/daily-order-count', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setDailyOrderCountData(response.data);
        }).catch(error => {
            console.error('Error fetching daily order count data:', error);
        });

        axios.get('http://localhost:8080/admin/api/statistics/sales-products', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setSalesStatistics(response.data);
            setTotalOrders(response.data.length);
        }).catch(error => {
            console.error('Error fetching sales statistics:', error);
        });

        axios.get('http://localhost:8080/admin/api/statistics/revenue', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setRevenueStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching revenue statistics:', error);
        });
        axios.get('http://localhost:8080/admin/api/statistics/revenue2', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setRevenueStatistics2(response.data);
        }).catch(error => {
            console.error('Error fetching revenue statistics:', error);
        });

        axios.get('http://localhost:8080/admin/api/statistics/inventory', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setInventoryStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching inventory statistics:', error);
        });

        axios.get('http://localhost:8080/admin/api/statistics/user-statistics', {
            params: { fromDate: startDate, toDate: endDate },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setUserStatistics(response.data);
        }).catch(error => {
            console.error('Error fetching user statistics:', error);
        });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Thống kê</h2>

            <DateFilter
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleFetchStatistics={handleFetchStatistics}
            />

            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-12">
                <SummaryCards
                    totalOrders={totalOrders}
                    netRevenue={revenueStatistics || 0}
                    actualRevenue={revenueStatistics2 || 0}
                    grossMargin={grossMargin}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <DailyRevenueChart data={dailyRevenueData} />
                <DailyOrderCountChart data={dailyOrderCountData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <SalesStatistics salesStatistics={salesStatistics} />
                <InventoryStatistics inventoryStatistics={inventoryStatistics} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <VoucherStatistics startDate={startDate} endDate={endDate} />
                <FlashSaleStatistics startDate={startDate} endDate={endDate} />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
                <UserStatistics userStatistics={userStatistics} />
            </div>
        </div>
    );
};

export default Statistics;
