import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import FlashSale from '../../../components/admin/FlashSale/FlashSaleManagement';

const FlashSales = () => {
    return (
        <AdminLayout>
            <FlashSale />
        </AdminLayout>
    );
};

export default FlashSales;