import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import UsersComponent from '../../../components/admin/Users/UsersMain'; // Đảm bảo đường dẫn đúng với file

const AdminUsers = () => {
    return (
        <AdminLayout>
            <UsersComponent />
        </AdminLayout>
    );
};

export default AdminUsers;
