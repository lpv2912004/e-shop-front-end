import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
class CheckoutSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: {}
        };
    }

    componentDidMount() {
        const orderData = JSON.parse(sessionStorage.getItem('datasucess'));
        this.setState({ orderData });
        console.log(orderData);
    }

    handleBackHome = () => {
        window.location.href = 'http://localhost:3000/home'
        sessionStorage.removeItem('datasucess')
    }

    handleToCheckOut = () => {
        window.location.href = 'http://localhost:3000/myprofile?tab=order'; // Thêm tham số 'tab=order' vào URL
        sessionStorage.removeItem('datasucess');
    }

    render() {
        const { orderData } = this.state;
        const { id, user, state, methodPayment, address, created_date } = orderData;

        return (
            <>
                <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                    <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">Cảm ơn bạn đã đặt hàng!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">đơn hàng <button href="#" className="font-medium text-gray-900 dark:text-white hover:underline">#{id}</button> của bạn sẽ được xử lý xử lý sớm nhất.</p>
                        <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Ngày:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{new Date(created_date).toLocaleDateString()}</dd>
                            </dl>
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Phương thức:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{methodPayment ? methodPayment.name_method : ''}</dd>
                            </dl>
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Tên:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{user ? user.fullName : ''}</dd>
                            </dl>
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-400 dark:text-gray-300">Địa chỉ</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{address ? address.full_address : ''}</dd>
                            </dl>
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Số điện thoại</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{user ? user.phone : ''}</dd>
                            </dl>

                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Trạng thái:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{state ? state.name_status_order : ''}</dd>
                            </dl>
                            <dl className="sm:flex items-center justify-between gap-4">
                                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Số tiền thanh toán:</dt>
                                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderData.total_cash ? orderData.total_cash.toLocaleString() : ''} VND</dd>
                            </dl>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={this.handleBackHome}

                                className="text-primary transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                            >Quay về</button>
                            <button
                                onClick={this.handleToCheckOut}

                                className="text-primary transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                            >Xem đơn hàng</button>
                        </div>


                    </div>
                </section>
            </>
        );
    }
}

export default CheckoutSuccess;
