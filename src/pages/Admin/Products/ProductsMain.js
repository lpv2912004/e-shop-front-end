import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ProductsComponent from '../../../components/admin/Products/ProductsMain'; // Đảm bảo đường dẫn đúng với file

const AdminProducts = () => {
    return (
        <AdminLayout>
            <ProductsComponent />
        </AdminLayout>
    );
};

export default AdminProducts;
