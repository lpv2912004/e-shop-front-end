import React from 'react';
import AdminLayout from '../../../components/admin/layout/AdminLayout';
import Transactions from '../../../components/admin/Transactions/AdminTransactionManagement';

const TransactionsPage = () => {
    return (
        <AdminLayout>
            <Transactions/>
        </AdminLayout>
    );
};

export default TransactionsPage;