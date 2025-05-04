import React, { Component } from 'react'
import AccountInfoComp from './Info/AccountInfoComp'
import ListCheckOutUser from './Info/ListCheckOutUser'
import ListAddress from './Info/ListAddress'
import { withRouter } from 'react-router-dom';

class ItemProfileComp extends Component {

    componentDidMount() {
        this.focusTabFromQuery();
    }

    componentDidUpdate(prevProps) {
        // Mỗi khi component nhận props mới, kiểm tra lại query string để focus đúng tab
        if (this.props.location.search !== prevProps.location.search) {
            this.focusTabFromQuery();
        }
    }

    focusTabFromQuery = () => {
        const queryParams = new URLSearchParams(this.props.location.search);
        const tab = queryParams.get('tab');

        setTimeout(() => {
            if (tab === 'address') {
                document.querySelector('[data-twe-target="#tabs-address"]').click();
            } else if (tab === 'info') {
                document.querySelector('[data-twe-target="#tabs-info"]').click();
            } else if (tab === 'order') {
                document.querySelector('[data-twe-target="#tabs-order"]').click();
            }
        }, 100); // Đợi 100ms trước khi click vào tab
    }

    render() {
        return (
            <>
                {/* <!--Tabs navigation--> */}
                <div className="text-xs me- sm:text-sm md:text-base bg-white mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-4 mb-5 w-full">
                    <ul
                        className="mb-5 flex list-none flex-row flex-wrap border-b-0 ps-0 overflow-x-auto"
                        role="tablist"
                        data-twe-nav-ref>
                        <li role="presentation">
                            <a
                                href="#tabs-info"
                                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[twe-nav-active]:border-primary data-[twe-nav-active]:text-primary dark:text-white/50 dark:hover:bg-neutral-700/60 dark:data-[twe-nav-active]:text-primary"
                                data-twe-toggle="pill"
                                data-twe-target="#tabs-info"
                                data-twe-nav-active
                                role="tab"
                                aria-controls="tabs-info"
                                aria-selected="true"
                            >
                                Thông tin tài khoản
                            </a>
                        </li>
                        <li role="presentation">
                            <a
                                href="#tabs-address"
                                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[twe-nav-active]:border-primary data-[twe-nav-active]:text-primary dark:text-white/50 dark:hover:bg-neutral-700/60 dark:data-[twe-nav-active]:text-primary"
                                data-twe-toggle="pill"
                                data-twe-target="#tabs-address"
                                role="tab"
                                aria-controls="tabs-address"
                                aria-selected="false"
                            >
                                Địa chỉ
                            </a>
                        </li>
                        <li role="presentation">
                            <a
                                href="#tabs-order"
                                className="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[twe-nav-active]:border-primary data-[twe-nav-active]:text-primary dark:text-white/50 dark:hover:bg-neutral-700/60 dark:data-[twe-nav-active]:text-primary"
                                data-twe-toggle="pill"
                                data-twe-target="#tabs-order"
                                role="tab"
                                aria-controls="tabs-order"
                                aria-selected="false"
                            >
                                Đơn hàng đã đặt
                            </a>
                        </li>
                    </ul>

                    {/* <!-- Tabs content --> */}
                    <div className="mb-6">
                        <div
                            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block w-full"
                            id="tabs-info"
                            role="tabpanel"
                            aria-labelledby="tabs-info-tab"
                            data-twe-tab-active
                        >
                            <AccountInfoComp />
                        </div>
                        <div
                            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block w-full"
                            id="tabs-address"
                            role="tabpanel"
                            aria-labelledby="tabs-address-tab"
                        >
                            <ListAddress />
                        </div>
                        <div
                            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[twe-tab-active]:block w-full"
                            id="tabs-order"
                            role="tabpanel"
                            aria-labelledby="tabs-order-tab"
                        >
                            <ListCheckOutUser />
                        </div>
                    </div>
                </div>


            </>
        )
    }
}

export default withRouter(ItemProfileComp)
