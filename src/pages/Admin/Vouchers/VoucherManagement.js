import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import VouchersComponent from '../../../components/admin/Vouchers/VoucherManagement'; 

const Vouchers = () => {
    return (
        <AdminLayout>
            <VouchersComponent />
        </AdminLayout>
    );
};

export default Vouchers;