import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import UpdateProduct from '../../../components/admin/Products/ProductVariants/ProductVarianUpdate'; // Đảm bảo đường dẫn đúng với file

const AdminProducts = () => {
    return (
        <AdminLayout>
            <UpdateProduct />
        </AdminLayout>
    );
};

export default AdminProducts;
