import React, { Component, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { getDownloadURL, list, listAll, ref } from 'firebase/storage';
import { storage } from '../StorageImageText/TxtImageConfig';
import axios from 'axios';
// import { toast } from 'react-toastify';
import { Toaster, toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import '../style/Voucher.css'
import { getMessaging, getToken } from "firebase/messaging";

class CheckoutComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataAddToCheckout: [],
            totalPrice: 0,
            listImageVariants: [],
            delivery_fee: 0,
            selectedPaymentMethod: '',
            fullAddress: '',
            specificAddress: '',
            userAddress: {},
            listAddress: [],
            listVoucher: [],
            id_voucher: '',
            appliedVouchers: [],
            // Trạng thái kiểm tra voucher có đang được áp dụng hay không
            isVoucherApplied: false,
            originalTotalPrice: 0,
            originalDeliveryFee: 0,
            deviceToken: "",
            notificationSent: false,
            isLoading: false,
            searchTerm: "",
            setTextApplyVoucherOrder: '',
            setTextApplyVoucherShipping: '', //
        };
        this.listImageVariants = ref(storage, '/images');
    }

    showToast(content, typeToast) {
        toast(`${content}`, {
            type: `${typeToast}`,
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            richColors: true
        })
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        const data = sessionStorage.getItem('selectedCartItems');
        const totalPrice = sessionStorage.getItem('totalPrice');
        const decoded = jwtDecode(token)

        axios.get('http://localhost:8080/token/device').then((response) => {
            this.setState({
                deviceToken: response.data
            })
        })

        // console.log(token)
        // Kiểm tra xem checkoutElement có được lấy từ sessionStorage không
        const storedCheckoutElement = sessionStorage.getItem('checkoutElement');
        const extractToken = jwtDecode(token)
        // console.log(extractToken.id_user)
        console.log("du lieu : ", JSON.parse(data))
        this.setState({
            dataAddToCheckout: JSON.parse(data) && JSON.parse(data) !== null ? JSON.parse(data) : '',
            totalPrice: totalPrice || 0,
            checkoutElement: storedCheckoutElement ? JSON.parse(storedCheckoutElement) : null,  // Gán checkoutElement nếu có
        }, () => {
            console.log('State checkoutElement sau khi cập nhật:', this.state.checkoutElement);
            console.log(this.state.checkoutElement);

            // const { checkoutElement } = this.state;

            axios.get(`http://localhost:8080/user/api/address/getAddress/${extractToken.id_user}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then(response => {
                this.setState({
                    userAddress: response.data
                }, () => {
                    this.calculateShippingFee();
                });
            }).catch(error => {
                console.error('Error fetching address:', error);
            });

            this.setState({
                dataAddToCheckout: JSON.parse(data) && JSON.parse(data) !== null ? JSON.parse(data) : '',
                totalPrice: totalPrice || 0,
            });

            this.fetchImageList();

            // Kiểm tra xem có tham số phản hồi từ VNPay hay không
            const params = new URLSearchParams(window.location.search);
            const vnp_ResponseCode = params.get('vnp_ResponseCode');

            //ma trang thai
            const vnp_TransactionStatus = params.get('vnp_TransactionStatus');

            //ma thanh toan
            const vnp_TransactionNo = params.get('vnp_TransactionNo');
            console.log('VNPay response params:', Array.from(params.entries()));

            //Chỉ xử lý nếu vnp_ResponseCode có tồn tại
            if (vnp_ResponseCode) {
                this.handleVNPayResponse(vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo, token);
            }

        });
        this.fetchVouchers()
    }

    getDaysRemaining = (expirationDate) => {
        const currentDate = new Date();
        const expDate = new Date(expirationDate);

        // Tính sự khác biệt giữa hai ngày (tính bằng milliseconds)
        const timeDifference = expDate.getTime() - currentDate.getTime();

        // Chuyển đổi sự khác biệt từ milliseconds sang ngày
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Trả về số ngày còn lại với định dạng mong muốn
        if (daysRemaining > 1) {
            return `Còn ${daysRemaining} ngày`;
        } else if (daysRemaining === 1) {
            return 'Còn 1 ngày';
        } else if (daysRemaining === 0) {
            return 'Hết hạn hôm nay';
        } else {
            return 'Voucher đã hết hạn';
        }
    };

    fetchImageList() {
        listAll(this.listImageVariants).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ listImageVariants: urls });
            });
        });
    }

    async fetchVouchers() {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        try {
            const response = await axios.post('http://localhost:8080/user/api/voucher/list', { id_user: decoded.id_user },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('voucher: ', response.data)
            this.setState({
                listVoucher: response && response.data.length > 0 ? response.data : []
            })
        } catch (error) {
            console.log(error.message);
        }

    }

    // handleChange = (event) => {
    //     this.setState({ searchTerm: event.target.value });
    // };

    // handleSearchVoucher = async () => {
    //     const { searchTerm } = this.state;
    //     const token = localStorage.getItem("jwtToken");
    //     const decoded = jwtDecode(token);

    //     try {
    //         const response = await axios.post(
    //             "http://localhost:8080/user/api/voucher/searchCode",
    //             { code: searchTerm.trim(), idUser: decoded.id_user },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         // Hiển thị response data
    //         console.log(response.data);
    //         toast(`${response.data}`, {
    //             type: "success",
    //             position: "top-right",
    //             duration: 3000,
    //             closeButton: true,
    //             richColors: true,
    //         });
    //     } catch (error) {
    //         if (error.response) {
    //             // Hiển thị lỗi từ backend
    //             console.error("Error:", error.response.data);
    //             toast(`${error.response.data}`, {
    //                 type: "error",
    //                 position: "top-right",
    //                 duration: 3000,
    //                 closeButton: true,
    //                 richColors: true,
    //             });
    //         } else {
    //             // Lỗi khác (network, timeout,...)
    //             console.error("Error:", error.message);
    //             toast("Có lỗi xảy ra, vui lòng thử lại!", {
    //                 type: "error",
    //                 position: "top-right",
    //                 duration: 3000,
    //                 closeButton: true,
    //                 richColors: true,
    //             });
    //         }
    //     }
    // }

    handleChange = (event) => {
        const searchTerm = event.target.value;
        this.setState({ searchTerm });

        // Nếu searchTerm rỗng, fetch lại danh sách voucher
        if (!searchTerm.trim()) {
            this.fetchVouchers();
        }
    };

    handleSearchVoucher = async () => {
        const { searchTerm } = this.state;
        const token = localStorage.getItem("jwtToken");
        const decoded = jwtDecode(token);

        if (!searchTerm.trim()) {
            toast("Vui lòng nhập mã voucher để tìm kiếm!", {
                type: "error",
                position: "top-right",
                duration: 3000,
                closeButton: true,
                richColors: true,
            });
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/user/api/voucher/searchCode",
                { code: searchTerm.trim(), idUser: decoded.id_user },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const foundVoucher = response.data;

            // Cập nhật listVoucher chỉ chứa voucher vừa được tìm thấy
            this.setState({
                listVoucher: [foundVoucher],
            });

            toast("Đã tìm thấy voucher!", {
                type: "success",
                position: "top-right",
                duration: 3000,
                closeButton: true,
                richColors: true,
            });
        } catch (error) {
            if (error.response) {
                // Hiển thị lỗi từ backend
                console.error("Error:", error.response.data);
                toast(`${error.response.data}`, {
                    type: "error",
                    position: "top-right",
                    duration: 3000,
                    closeButton: true,
                    richColors: true,
                });
            } else {
                // Lỗi khác (network, timeout,...)
                console.error("Error:", error.message);
                toast("Có lỗi xảy ra, vui lòng thử lại!", {
                    type: "error",
                    position: "top-right",
                    duration: 3000,
                    closeButton: true,
                    richColors: true,
                });
            }
        }
    };


    getVoucherColor = (typeVoucherName) => {
        switch (typeVoucherName) {
            case 'ORDER':
                return 'https://img.freepik.com/premium-vector/coupon-icon-coupon-discount-promotion-sale-shopping-voucher-money-saving-shopping-concept_97458-1054.jpg?w=360';
            case 'SHIPPING':
                return 'https://png.pngtree.com/png-vector/20191129/ourmid/pngtree-fast-delivery-icon-delivery-icon-png-image_2047531.jpg';
            case 'DISCOUNT':
                return 'bg-yellow-500 text-white'; // Màu cho DISCOUNT
            default:
                return 'bg-gray-500 text-white'; // Màu mặc định
        }
    }

    handleSelectVoucher = (voucherId) => {
        const { listVoucher, totalPrice, delivery_fee, originalTotalPrice, originalDeliveryFee, setTextApplyVoucherShipping, setTextApplyVoucherOrder } = this.state;

        // cập nhật lại giá gốc trước lúc chọn voucher khác
        let updatedTotalPrice = originalTotalPrice || totalPrice;
        let updatedDeliveryFee = originalDeliveryFee || delivery_fee;
        let dataApplyVoucherShipping = ""
        let dataApplyVoucherOrder = ""
        const selectedVoucher = listVoucher.find(voucher => voucher.id === voucherId);
        const isVoucherCurrentlyApplied = selectedVoucher.isApplied;

        // làm mới vouchers và set lựa chọn là false 
        let updatedVouchers = listVoucher.map(voucher => {
            if (voucher.id === voucherId && isVoucherCurrentlyApplied) {
                return {
                    ...voucher,
                    isApplied: false,
                    setTextApplyVoucherShipping: "",
                    textDataVoucherOrder: ""
                };
            } else if (voucher.typeVoucher.id === selectedVoucher.typeVoucher.id && voucher.isApplied) {
                return {
                    ...voucher,
                    isApplied: false,
                    setTextApplyVoucherShipping: "",
                    textDataVoucherOrder: ""
                };
            }
            return voucher;
        });

        if (!isVoucherCurrentlyApplied) {
            updatedVouchers = updatedVouchers.map(voucher => {
                if (voucher.id === voucherId) {
                    if (updatedTotalPrice >= voucher.condition) {
                        toast(`Đã áp dụng Voucher giảm ${voucher.discount}%`, {
                            type: 'success',
                            position: 'top-right',
                            duration: 3000,
                            closeButton: true,
                            richColors: true
                        })
                        // toast.success(`Đã áp dụng Voucher giảm ${voucher.discount}%`)
                        return { ...voucher, isApplied: true };
                    } else {
                        toast(`Voucher này chỉ được áp dụng cho đơn hàng có giá trị tối thiểu là ${voucher.condition.toLocaleString()}`, {
                            type: 'error',
                            position: 'top-right',
                            duration: 3000,
                            closeButton: true,
                            richColors: true
                        })

                        return { ...voucher, isApplied: false };
                    }
                }
                return voucher;
            });
        }

        // tính tiền cho voucher đã chọn
        updatedVouchers.forEach(voucher => {
            if (voucher.isApplied) {
                if (voucher.typeVoucher.nameTypeVoucher === 'SHIPPING') {
                    dataApplyVoucherShipping =
                        `${updatedDeliveryFee.toLocaleString()} - ${(updatedDeliveryFee.toLocaleString() * parseInt(voucher.discount).toLocaleString() / 100)}`

                    updatedDeliveryFee -= updatedDeliveryFee * parseInt(voucher.discount) / 100;
                } else if (voucher.typeVoucher.nameTypeVoucher === 'ORDER') {

                    // Tính toán giá trị số
                    const discountAmount = Math.min(
                        (updatedTotalPrice * parseInt(voucher.discount)) / 100,
                        voucher.max_voucher_apply
                    );

                    // Định dạng kết quả
                    const updatedTotalPriceFormatted = updatedTotalPrice.toLocaleString();
                    const discountAmountFormatted = discountAmount.toLocaleString();

                    // Kết hợp thành chuỗi
                    dataApplyVoucherOrder = `${parseFloat(updatedTotalPrice).toLocaleString()} - ${discountAmountFormatted}`

                    // dataApplyVoucherOrder =
                    //     `${updatedTotalPrice.toLocaleString()} - ${Math.min(updatedTotalPrice.toLocaleString() * parseInt(voucher.discount).toLocaleString() / 100, voucher.max_voucher_apply.toLocaleString())}`

                    updatedTotalPrice -= Math.min((updatedTotalPrice * parseInt(voucher.discount) / 100), voucher.max_voucher_apply);
                }
            }
        });

        updatedTotalPrice = updatedTotalPrice > 0 ? updatedTotalPrice : 0;
        updatedDeliveryFee = updatedDeliveryFee > 0 ? updatedDeliveryFee : 0;

        // Lấy ra danh sách ID của các voucher đã áp dụng
        const appliedVoucherIds = updatedVouchers.filter(voucher => voucher.isApplied).map(voucher => voucher.id);

        this.setState({
            listVoucher: updatedVouchers,
            totalPrice: updatedTotalPrice,
            delivery_fee: updatedDeliveryFee,
            originalTotalPrice: originalTotalPrice || totalPrice,
            originalDeliveryFee: originalDeliveryFee || delivery_fee,
            appliedVouchers: appliedVoucherIds,
            setTextApplyVoucherOrder: dataApplyVoucherOrder || "",
            setTextApplyVoucherShipping: dataApplyVoucherShipping || ""
        });
    };

    calculateShippingFee = () => {
        const { userAddress } = this.state;

        if (!userAddress || !userAddress.id_district || !userAddress.id_ward) {
            toast("Chưa có địa chỉ hãy thêm địa chỉ mới!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Chưa có địa chỉ hãy thêm địa chỉ mới!');
            return;
        }

        // lấy danh sách các dịch vụ có sẵn
        axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
            "shop_id": 5144386,
            "from_district": 1454, // Quận của người bán
            "to_district": parseInt(userAddress.id_district) || 0 // Quận của người nhận
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e' // Token GHN
            }
        })
            .then(response => {
                if (response.data.code === 200 && response.data.data.length > 0) {
                    const availableServices = response.data.data;
                    // Chọn gói dịch vụ đầu tiên từ danh sách
                    const selectedService = availableServices[0];

                    // Tính phí vận chuyển với service_id từ dịch vụ hợp lệ
                    const requestData = {
                        from_district_id: 1454,
                        from_ward_code: "21211",
                        service_id: selectedService.service_id,
                        service_type_id: 2,
                        to_district_id: parseInt(userAddress.id_district) || 0,
                        to_ward_code: String(userAddress.id_ward) || "",
                        height: 1,
                        length: 1,
                        weight: 2,
                        width: 1,
                        insurance_value: 0,
                        cod_failed_amount: 0,
                        coupon: null
                    };

                    // request tính phí vận chuyển
                    axios.post('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e',
                            'ShopId': '5144386'
                        }
                    })
                        .then(response => {
                            if (response.data.code === 200) {
                                let shippingFee = parseInt(response.data.data.total);
                                this.setState({ delivery_fee: shippingFee });
                            } else {
                                toast('Lỗi tính phí vận chuyển: ' + response.data.message, {
                                    type: 'error',
                                    position: 'top-right',
                                    duration: 3000,
                                    closeButton: true,
                                    richColors: true
                                })
                                // toast.error('Lỗi tính phí vận chuyển: ' + response.data.message);
                            }
                        })
                        .catch(error => {
                            toast('Có lỗi khi tính phí vận chuyển', {
                                type: 'error',
                                position: 'top-right',
                                duration: 3000,
                                closeButton: true,
                                richColors: true
                            })
                            //toast.error('Có lỗi khi tính phí vận chuyển');
                            console.error(error);
                        });
                } else {
                    toast("Không có gói dịch vụ nào khả dụng", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    })
                    // toast.error('Không có gói dịch vụ nào khả dụng');
                }
            })
            .catch(error => {
                toast('Lỗi khi lấy danh sách dịch vụ: ' + error.message, {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error('Lỗi khi lấy danh sách dịch vụ: ' + error.message);
                console.error(error);
            });
    };

    handleToAddress(e) {
        e.preventDefault();
        // Chuyển hướng với query string để focus vào tab "Địa chỉ"
        this.props.history.push('/myprofile?tab=address');
    }

    handlePaymentMethodChange = (event) => {
        this.setState({ selectedPaymentMethod: event.target.id });
    };

    handlePlaceOrder = () => {
        if (this.state.isLoading) return; // Chặn nếu đang tải

        // Hiển thị trạng thái "Đang xử lý"
        this.setState({ isLoading: true });

        // Thêm delay 2 giây trước khi thực hiện xử lý đặt hàng
        setTimeout(() => {
            const token = localStorage.getItem('jwtToken');
            const decoded = jwtDecode(token);
            const { dataAddToCheckout, totalPrice, delivery_fee, selectedPaymentMethod, userAddress, appliedVouchers } = this.state;

            if (selectedPaymentMethod === '') {
                this.showToast("Vui lòng chọn phương thức thanh toán");
                this.setState({ isLoading: false });
                return;
            }

            if (!userAddress) {
                this.showToast("Vui lòng kiểm tra địa chỉ");
                this.setState({ isLoading: false });
                return;
            }

            const checkoutElement = {
                items: dataAddToCheckout.map(item => ({
                    variantProduct: item.variantProduct,
                    quantity: item.quantity,
                    user: item.user,
                    fullAddress: userAddress.full_address || '',
                    nameColor: item.variantProduct.color.color_name || '',
                    nameSize: item.variantProduct.size.name_size || '',
                })),
                id_vouchers: appliedVouchers,
                totalPrice: parseInt(totalPrice) + parseInt(delivery_fee),
                deliveryFee: delivery_fee,
                address: userAddress.id,
                paymentMethod: selectedPaymentMethod,
                state: 1
            };

            if (selectedPaymentMethod === "2") {
                axios.post('http://localhost:8080/user/api/payment', {
                    amount: checkoutElement.totalPrice,
                    orderType: 'billpayment',
                    returnUrl: 'http://localhost:3000/checkout'
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(response => {
                    if (response.data) {
                        this.setState({ checkoutElement }, () => {
                            sessionStorage.setItem('checkoutElement', JSON.stringify(checkoutElement));
                            window.location.href = response.data;
                        });
                    } else {
                        this.showToast("Lỗi tạo URL thanh toán");
                        this.setState({ isLoading: false });
                    }
                }).catch(error => {
                    console.error('Error creating payment URL:', error);
                    this.showToast("Đặt hàng thất bại");
                    this.setState({ isLoading: false });
                });
            } else {
                axios.post('http://localhost:8080/user/api/order/create', checkoutElement, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(response => {
                        this.showToast("Đặt hàng thành công", 'success');
                        sessionStorage.setItem('datasucess', JSON.stringify(response.data));
                        sessionStorage.removeItem('selectedCartItems');
                        sessionStorage.removeItem('totalPrice');
                        this.setState({ dataAddToCheckout: [], totalPrice: 0, isLoading: false });
                        //phan gui thong bao day -------------------------------------------------------------------
                        const adminToken = sessionStorage.getItem('FCMToken');  // Lấy token admin từ sessionStorage

                        if (adminToken) {
                            const messageData = {
                                token: this.state.deviceToken,
                                title: "Đơn hàng mới",
                                body: `Đơn hàng đã được đặt bởi ${decoded.username}`,
                            };

                            console.log(messageData);

                            axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then((response) => {
                                    if (response) {
                                        //                                 //create notify to admin 
                                        axios.post('http://localhost:8080/user/api/notify/createNotifyToAdmin', { mess: `Đơn hàng mới! Đơn hàng đã được đặt bởi ${decoded.username}` }, {
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        }).then((response) => {
                                            console.log("da tao moi thong bao den admin")
                                        })
                                    }
                                })
                                .catch((error) => {
                                    console.log("Error sending message:", error);
                                });
                            console.log("Successfully sent message:", response.data);
                        }
                        //-------------------------------------------------------------------
                        // Gửi thông báo và tạo thông báo admin...
                        this.props.history.push('/success');
                    })
                    .catch(error => {
                        console.error('There was an error placing the order:', error);
                        this.showToast("Đặt hàng thất bại");
                        this.setState({ isLoading: false });
                    });
            }
        }, 2000); // Delay 2 giây
    };

    showToast(message, type = 'error') {
        toast(message, {
            type,
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            richColors: true,
        });
    }

    handleLoadAddressByUserId() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token)
            const id_user = decoded.id_user
            axios.get(`http://localhost:8080/user/api/address/list/${id_user}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                    }
                }
            ).then(response => {
                this.setState({
                    listAddress: response && response.data ? response.data : []
                })
            })
        }
    }

    handleChangeAddress(id_address) {
        const token = localStorage.getItem('jwtToken')
        axios.get(`http://localhost:8080/user/api/address/byid/${id_address}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            }
        ).then(response => {
            this.setState({
                userAddress: response.data
            }, () => {
                this.calculateShippingFee();
            })
        })
        console.log(this.state.userAddress)
    }

    // Tách hàm xử lý phản hồi VNPay
    handleVNPayResponse(vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo, token) {
        console.log('VNPay response params:', vnp_ResponseCode, vnp_TransactionStatus, vnp_TransactionNo);

        const decoded = jwtDecode(token)

        if (vnp_ResponseCode === '00') {
            const updatedCheckoutElement = {
                ...this.state.checkoutElement,  // Dữ liệu đã có sẵn trong checkoutElement
                vnp_TransactionStatus,  // Thêm mã trạng thái giao dịch
                vnp_TransactionNo  // Thêm mã thanh toán
            };
            axios.post('http://localhost:8080/user/api/order/createbyvnpay', updatedCheckoutElement, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {

                    console.log('Order placed successfully after VNPay:', response.data);
                    toast("Đặt hàng thành công", {
                        type: 'success',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    })
                    // toast.success('Đặt hàng thành công');
                    sessionStorage.removeItem('selectedCartItems');
                    sessionStorage.setItem('datasucess', JSON.stringify(response.data));
                    sessionStorage.removeItem('totalPrice');
                    sessionStorage.removeItem('checkoutElement');
                    this.setState({ dataAddToCheckout: [], totalPrice: 0 });

                    //phan gui thong bao day -------------------------------------------------------------------
                    const adminToken = sessionStorage.getItem('FCMToken');  // Lấy token admin từ sessionStorage

                    if (adminToken) {
                        const messageData = {
                            token: this.state.deviceToken,
                            title: "Đơn hàng mới",
                            body: `Đơn hàng đã được đặt bởi ${decoded.username}`,
                        };

                        console.log(messageData);

                        axios.post('http://localhost:8080/user/api/notify/sendNotification', messageData, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                        )
                            .then((response) => {

                                if (response) {
                                    //                                 //create notify to admin 
                                    axios.post('http://localhost:8080/user/api/notify/createNotifyToAdmin', { mess: `Đơn hàng mới! Đơn hàng đã được đặt bởi ${decoded.username}` }, {
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    }).then((response) => {
                                        console.log("da tao moi thong bao den admin")
                                    })
                                }
                            })
                            .catch((error) => {
                                console.log("Error sending message:", error);
                            });
                        console.log("Successfully sent message:", response.data);

                    }
                    //-------------------------------------------------------------------

                    this.props.history.push('/success');
                })
                .catch(error => {
                    console.error('Error placing order after VNPay:', error);
                    toast("Đặt hàng thất bại", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    })
                    // toast.error('Đặt hàng thất bại');
                });
        } else {
            const updatedCheckoutElement = {
                ...this.state.checkoutElement,  // Dữ liệu đã có sẵn trong checkoutElement
                vnp_TransactionStatus,  // Thêm mã trạng thái giao dịch
                vnp_TransactionNo  // Thêm mã thanh toán
            };
            axios.post('http://localhost:8080/user/api/order/createbyvnpay', updatedCheckoutElement, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Order placed successfully after VNPay:', response.data);
                    toast("Thanh toán không thành công", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                    })
                    // toast.error('Thanh toán không thành công');
                })
                .catch(error => {
                    console.error('Error placing order after VNPay:', error);
                    toast("Đặt hàng thất bại", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    })
                });

        }
    }

    render() {
        const { dataAddToCheckout, totalPrice, delivery_fee, userAddress, listAddress, selectedPaymentMethod, listVoucher, setTextApplyVoucherOrder, setTextApplyVoucherShipping } = this.state;
        console.log(dataAddToCheckout)
        const totalPriceFormatted = isNaN(parseInt(totalPrice)) ? 0 : parseInt(totalPrice);
        const deliveryFeeFormatted = isNaN(parseInt(delivery_fee)) ? 0 : parseInt(delivery_fee);
        const totalAmount = totalPriceFormatted + deliveryFeeFormatted;


        return (
            <>
                {/* <div className="flex flex-col items-center border-b py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32 mt-5">
                    <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base"></div>
                </div> */}

                <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 my-5">
                    <div className="px-4 pt-8">
                        <div className="grid lg:grid-cols-2 ">
                            <div>
                                <p className="text-xl font-medium">Thông tin đơn hàng</p>
                                <p className="text-gray-400">Kiểm tra sản phẩm và lựa chọn phương thức thanh toán.</p>
                            </div>
                            <div className='block sm:mx-24 w-full'>

                                {/* <!-- Button trigger modal --> */}
                                <button
                                    type="button"
                                    class="inline-block bg-red-400 rounded px-7 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    data-twe-toggle="modal"
                                    data-twe-target="#exampleModal"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Sử dụng phiếu giảm giá
                                </button>

                            </div>
                        </div>

                        <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                            {dataAddToCheckout && dataAddToCheckout.length > 0 && dataAddToCheckout !== null ? (
                                dataAddToCheckout.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center rounded-lg bg-white">
                                            {/* Hình ảnh sản phẩm */}
                                            <img
                                                className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                                src={item.variantProduct.image_variant}
                                                alt=""
                                            />
                                            {/* Thông tin sản phẩm */}
                                            <div className="flex flex-col w-full px-4 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <span className="font-semibold text-sm sm:text-base">
                                                        {item.variantProduct.product.name_prod} - Kích thước: {item.variantProduct.size.name_size}
                                                    </span>
                                                    {/* Màu sắc kế bên kích thước */}
                                                    <span
                                                        className="w-5 h-5 rounded-full border"
                                                        style={{ backgroundColor: item.variantProduct.color.color_name }}
                                                        title={item.variantProduct.color.color_name} // Thêm tooltip để hiển thị tên màu
                                                    ></span>
                                                </div>
                                                <div className="mt-2 flex justify-between items-center text-sm sm:text-base">
                                                    <span className="text-gray-400">Số lượng: {item.quantity}</span>
                                                    <p className="text-lg font-bold text-end">{(item.quantity * item.discountedPrice).toLocaleString()} đ</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Đường kẻ phân cách */}
                                        <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-400" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center font-semibold">Đơn hàng đang trống</div>
                            )}
                        </div>



                    </div>
                    <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                        <p className="text-xl font-medium">Chi tiết thanh toán</p>
                        <p className="text-gray-400">Vui lòng hoàn thành thông tin đơn hàng của bạn</p>
                        <div>
                            {!userAddress || !userAddress.id_district || !userAddress.id_ward ?
                                <button
                                    onClick={(e) => this.handleToAddress(e)}
                                    type="button"
                                    className="text-red-400 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
                                >
                                    Thêm địa chỉ mới tại đây
                                </button>
                                :
                                <>
                                    <span>
                                        <label htmlFor="billing-address" className="text-start mt-4 mb-2 text-sm font-medium me-5">Địa chỉ giao hàng</label>
                                    </span>
                                    <span>
                                        <label htmlFor="billing-address" className="text-start text-red-400 mt-4 mb-2 text-sm font-medium">
                                            {/* <!-- Button trigger modal --> */}
                                            <button
                                                onClick={() => this.handleLoadAddressByUserId()}
                                                type="button"
                                                className="text-red-400 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
                                                data-twe-toggle="modal"
                                                data-twe-target="#exampleModalTips2"
                                                data-twe-ripple-init
                                                data-twe-ripple-color="light">
                                                Thay Đổi
                                            </button>
                                        </label>
                                    </span>
                                </>
                            }

                            <div className="w-full">
                                {userAddress.user && (
                                    <span className='font-bold '>
                                        {userAddress.user.phone}
                                    </span>
                                )}
                                <span> {userAddress.full_address}</span>
                            </div>
                            <div>
                                <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
                                <form className="mt-5 grid gap-6">
                                    <div className="relative">
                                        <input className="peer hidden" id="1" type="radio" name="radio" onChange={this.handlePaymentMethodChange} />
                                        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="1">
                                            <img className="w-14 object-contain" src="https://cdn-icons-png.flaticon.com/512/2897/2897855.png" alt="" />
                                            <div className="ml-5">
                                                <span className="mt-2 font-semibold">Thanh toán khi nhận hàng</span>
                                                <p className="text-slate-500 text-sm leading-6">bạn sẽ trả tiền trực tiếp cho người giao hàng khi nhận được sản phẩm.</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input className="peer hidden" id="2" type="radio" name="radio" onChange={this.handlePaymentMethodChange} />
                                        <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                        <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="2">
                                            <img className="w-14 object-contain" src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="" />
                                            <div className="ml-5">
                                                <span className="mt-2 font-semibold">Thanh Toán Qua Ngân Hàng</span>
                                                <p className="text-slate-500 text-sm leading-6">chuyển tiền ngân hàng đến tài khoản của người bán để thanh toán.</p>
                                            </div>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-b py-2">
                            {setTextApplyVoucherOrder !== "" &&
                                <div className="flex items-center justify-between content-center mt-3">
                                    <p className="text-sm font-medium text-gray-900">Áp dụng giảm cho đơn hàng:</p>
                                    <p className="font-semibold text-gray-900">({setTextApplyVoucherOrder})
                                    </p>
                                </div>
                            }

                            <div className="flex items-center justify-between mt-3 ">
                                 <p className="text-sm font-medium text-gray-900">Tạm tính:</p>
                                <p className="font-semibold text-gray-900">{totalPriceFormatted.toLocaleString()} đ
                                </p>
                            </div>

                            <hr class="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700"/>

                                {setTextApplyVoucherShipping !== "" &&
                                    <div className="flex items-center justify-between content-center mt-3">
                                        <p className="text-sm font-medium text-gray-900">Áp dụng giảm cho phí vận chuyển:</p>
                                        <p className="font-semibold text-gray-900">({setTextApplyVoucherShipping})
                                        </p>
                                    </div>
                                }

                                <div className="flex items-center justify-between content-center mt-3">
                                    <p className="text-sm font-medium text-gray-900">Phí vận chuyển:</p>
                                    <p className="font-semibold text-gray-900">{deliveryFeeFormatted.toLocaleString()} đ</p>
                                </div>
                            
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Tổng tiền cần phải thanh toán: </p>
                            <p className="text-2xl font-semibold text-gray-900">{totalAmount.toLocaleString()}</p>
                        </div>

                        {/* <button onClick={this.handlePlaceOrder} className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">Đặt hàng</button> */}

                        <button
                            onClick={this.handlePlaceOrder}
                            disabled={this.state.isLoading}
                            className={`mt-4 mb-8 w-full rounded-md px-6 py-3 font-medium text-white 
        ${this.state.isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900'}`}
                        >
                            {this.state.isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
                                    </svg>
                                    Đang xử lý...
                                </div>
                            ) : (
                                "Thanh toán"
                            )}
                        </button>

                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    class="fixed left-0 top-36 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModalTips2"
                    tabindex="-1"
                    aria-labelledby="exampleModalTipsLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[600px]">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                                class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5
                                    class="text-xl font-medium leading-normal text-surface dark:text-white"
                                    id="exampleModalTipsLabel">
                                    Đổi địa chỉ đặt hàng
                                </h5>
                            </div>
                            <div
                                class="relative flex-auto p-4 text-start"
                                data-twe-modal-body-ref>
                                {listAddress && listAddress.length > 0
                                    && listAddress.map((item, index) => {
                                        return (
                                            <>
                                                <h5 class="mb-2 text-xl font-bold">
                                                    {item.user.phone}
                                                </h5>
                                                <div class="flex justify-between items-center">
                                                    <div class="truncate max-w-[70%]">
                                                        {item.full_address}
                                                    </div>
                                                    <button
                                                        onClick={() => this.handleChangeAddress(item.id)}
                                                        type="button"
                                                        class="ms-4 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                                        data-twe-toggle="popover"
                                                        data-twe-title="Popover title"
                                                        data-twe-content="Popover body content is set in this attribute."
                                                        data-twe-ripple-init
                                                        data-twe-ripple-color="light">
                                                        Thay đổi
                                                    </button>
                                                </div>

                                                <hr class="my-4 dark:border-neutral-500" />
                                            </>
                                        )
                                    }
                                    )}
                            </div>
                            <div
                                class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    ĐÓNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[800px]">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                                class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5
                                    class="text-xl uppercase font-medium leading-normal text-surface dark:text-white"
                                    id="exampleModalLabel">
                                    Danh sách mã giảm giá
                                </h5>
                                <button
                                    type="button"
                                    class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    data-twe-modal-dismiss
                                    aria-label="Close">
                                    <span class="[&>svg]:h-6 [&>svg]:w-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor">
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>

                            {/* Modal body with scroll */}
                            <div class="relative flex-auto p-4 max-h-[500px] overflow-y-auto"
                                id="exampleModal"
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                                data-twe-modal-body-ref>

                                {/* tim kiem voucher */}
                                <div className=''>
                                    <div class="max-w-full">
                                        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Tìm</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>
                                            <input
                                                value={this.state.searchTerm}
                                                onChange={this.handleChange}
                                                type="search"
                                                id="default-search"
                                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm Voucher" />
                                            <button
                                                onClick={this.handleSearchVoucher}
                                                type="button"
                                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg className="w-4 h-4 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                {/* Voucher Section */}
                                <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">

                                    <div className="p-4">
                                        {/* set voucher vaof ddaya */}
                                        {listVoucher && listVoucher.length > 0 ? (
                                            listVoucher
                                                .sort((a, b) => a.typeVoucher.nameTypeVoucher.localeCompare(b.typeVoucher.nameTypeVoucher)) // Sắp xếp theo typeVoucher
                                                .map((item, index) => (
                                                    <div key={index}
                                                        className={`flex items-center border rounded-lg shadow-md p-4 mb-4 `}>
                                                        <div className={`w-24 h-24 flex-shrink-0 rounded-l-lg relative`}>
                                                            <img className='top-2/4' src={`${this.getVoucherColor(item.typeVoucher.nameTypeVoucher)}`} alt='' />
                                                            <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                                                            <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full"></div>
                                                            <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rounded-full"></div>
                                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full"></div>
                                                        </div>
                                                        <div className="flex-grow p-4">
                                                            <div className="text-lg font-semibold">{item.code} </div>

                                                            <div className="text-sm text-gray-600 flex items-center mt-2">
                                                                Giảm: {item.discount}%, tối đa là {item.max_voucher_apply.toLocaleString()}đ, đơn hàng tối thiểu là {item.condition.toLocaleString()}đ
                                                            </div>

                                                            <div className="text-sm text-gray-600 flex items-center mt-2">
                                                                {item.description}
                                                            </div>

                                                            <div className="text-sm text-gray-600 flex items-center mt-2">
                                                                <i className="far fa-clock mr-1"></i> Hết hạn: {this.getDaysRemaining(item.expiration_date)}
                                                            </div>

                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="bg-red-100 text-red-500 text-xs rounded-full px-3 py-3 mb-2">
                                                                x{item.quantity}
                                                            </div>
                                                            <button
                                                                onClick={() => this.handleSelectVoucher(item.id)}
                                                                className={`border rounded px-4 py-1 ${item.isApplied ? 'border-gray-500 text-gray-500' : 'border-red-500 text-red-500'} hover:bg-red-400 hover:text-white`}
                                                            >
                                                                {item.isApplied ? 'Bỏ áp dụng' : 'Áp dụng'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center font-bold w-full items-center border rounded-lg shadow-md p-4">
                                                Không có mã giảm giá
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default withRouter(CheckoutComponent);
