import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import Feedback from '../../../components/admin/Feedback/FeedbackManagement';

const Dashboard = () => {
    return (
        <AdminLayout>
            <Feedback />
        </AdminLayout>
    );
};

export default Dashboard;
