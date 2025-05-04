import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import ProductVariantsCreateComponent from '../../../components/admin/Products/ProductVariants/ProductVarianCreate';

const ProductVariantsPage = () => {
    return (
        <AdminLayout>
            <ProductVariantsCreateComponent />
        </AdminLayout>
    );
};

export default ProductVariantsPage;
