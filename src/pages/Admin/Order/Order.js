import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import Order from '../../../components/admin/Order/AdminOrderManagement';

const Dashboard = () => {
    return (
        <AdminLayout>
            <Order />
        </AdminLayout>
    );
};

export default Dashboard;
