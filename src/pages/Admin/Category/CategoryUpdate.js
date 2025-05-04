import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import UpdateCategory from '../../../components/admin/Category/CategoryUpdate'; // Đảm bảo đường dẫn đúng với file

const CategoryUpdate = () => {
    return (
        <AdminLayout>
            <UpdateCategory />
        </AdminLayout>
    );
};

export default CategoryUpdate;
