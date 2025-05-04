import React, { Component } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
class AddAddressComp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: '',
            provinces: [],
            districts: [],
            wards: [],
            selectedProvince: '',
            selectedDistrict: '',
            selectedWard: '',
            fullAddress: '',
            provinceName: '',
            districtName: '',
            wardName: '',
            specificAddress: ''
        }
    }
    componentDidMount() {
        this.fetchProvinces();
    }

    // Thêm vào trong AddAddressComp
    fetchAddresses = async () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const response = await axios.get('http://localhost:8080/user/api/address', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Cập nhật danh sách địa chỉ vào state hoặc props tùy vào cách bạn quản lý
            this.props.updateAddressList(response.data);
        }
    }

    fetchProvinces = async () => {
        try {
            const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                headers: {
                    'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e'
                }
            });
            this.setState({ provinces: response.data.data });
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, {
                headers: {
                    'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e'
                }
            });
            this.setState({ districts: response.data.data });
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    fetchWards = async (districtId) => {
        try {
            const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
                headers: {
                    'Token': '40890c3a-2e2f-11ef-8ba9-b6fbcb92e37e'
                }
            });
            this.setState({ wards: response.data.data });
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    handleProvinceChange = (event) => {
        const selectedProvince = event.target.value;
        const provinceName = event.target.selectedOptions[0].text;
        this.setState({ selectedProvince, provinceName, selectedDistrict: '', selectedWard: '', districts: [], wards: [] });
        this.fetchDistricts(selectedProvince);
    };

    handleDistrictChange = (event) => {
        const selectedDistrict = event.target.value;
        const districtName = event.target.selectedOptions[0].text;
        this.setState({ selectedDistrict, districtName, selectedWard: '', wards: [] });
        this.fetchWards(selectedDistrict);
    };

    handleWardChange = (event) => {
        const selectedWard = event.target.value;
        const wardName = event.target.selectedOptions[0].text;
        this.setState({ selectedWard, wardName }, () => {
        });
    };

    handleOnchange = (event) => {
        this.setState({
            specificAddress: event.target.value
        })
    }

    handleSubmit = async () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decode = jwtDecode(token);
            const userId = decode.id_user;

            const { selectedProvince, selectedDistrict, selectedWard, specificAddress } = this.state;

            if (selectedDistrict === '' || selectedProvince === '' || selectedWard === '') {
                toast("Vui lòng điền đầy đủ địa chỉ", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                  })
                return
            }else if(specificAddress === ''){
                toast("Vui lòng điền địa chỉ cụ thể", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                  })
               
                return
            } else {
                const address = {
                    id_user: userId,
                    provinceId: selectedProvince,
                    districtId: selectedDistrict,
                    wardId: selectedWard,
                    fulladdress: this.state.specificAddress + ', '
                        + this.state.provinceName + ', '
                        + this.state.districtName + ', '
                        + this.state.wardName
                };

                await axios.post('http://localhost:8080/user/api/address/create', address, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                    }
                });

                toast("Đã thêm địa chỉ mới", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                  })
                // Reload lại trang để cập nhật thông tin mới

                setTimeout(() => {
                    window.location.reload();
                    // Chuyển hướng với query string để focus vào tab "Địa chỉ"
                }, 100);
            }

            this.props.history.push('/myprofile?tab=address');
        }
    }

    render() {
        const { provinces, districts, wards, specificAddress } = this.state;
        return (
            <>
                {/* <!-- Button trigger modal --> */}
                <button
                    type="button"
                    class="inline-block rounded bg-black px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-gray-500 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                    data-twe-toggle="modal"
                    data-twe-target="#exampleModalTips"
                    data-twe-ripple-init
                    data-twe-ripple-color="light">
                    Thêm địa chỉ
                </button>

                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    class="fixed left-0 top-20 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModalTips"
                    tabindex="-1"
                    aria-labelledby="exampleModalTipsLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
                        <div
                            class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div
                                class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5
                                    class="text-xl font-medium leading-normal text-surface dark:text-white"
                                    id="exampleModalTipsLabel">
                                    THÊM ĐỊA CHỈ MỚI
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
                            <div
                                class="relative flex-auto p-4 text-center"
                                data-twe-modal-body-ref>
                                <h5 class="mb-2 text-xl font-bold">CHỈNH SỬA</h5>

                                <hr class="my-4 dark:border-neutral-500" />

                                <div>
                                    <label htmlFor="billing-address" className="text-start mt-4 mb-2 block text-sm font-medium">Địa chỉ giao hàng</label>
                                    <div className="w-full">
                                        <div className="relative flex-shrink-0 sm:w-12/12">
                                            <select onChange={this.handleProvinceChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {provinces.map(province => (
                                                    <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                            <select onChange={this.handleDistrictChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                <option value="">Chọn Quận/Huyện</option>
                                                {districts.map(district => (
                                                    <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                            <select onChange={this.handleWardChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                <option value="">Chọn Xã/Phường</option>
                                                {wards.map(ward => (
                                                    <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                            <textarea value={specificAddress}
                                                onChange={(event) => this.handleOnchange(event)}
                                                id="billing-address" name="billing-address" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Nhập địa chỉ cụ thể" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div
                                class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Đóng
                                </button>
                                <button
                                    onClick={() => this.handleSubmit()}
                                    type="button"
                                    class="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    Tạo địa chỉ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(AddAddressComp)

