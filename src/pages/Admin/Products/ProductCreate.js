import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ProductVariantsComponentCreate from '../../../components/admin/Products/ProductCreate';

const ProductVariantsPage = () => {
    return (
        <AdminLayout>
            <ProductVariantsComponentCreate />
        </AdminLayout>
    );
};

export default ProductVariantsPage;
