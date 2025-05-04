import React, { Component } from 'react'
import AddAddressComp from '../AddItem/AddAddressComp'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'


export default class ListAddress extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false,
            listAddress: [],
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
            specificAddress: '',
            id_address: ''
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);

        axios.post(`http://localhost:8080/user/api/address/list/${decoded.id_user}`,
            decoded.id_user,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            }
        ).then(response => {
            this.setState({
                listAddress: response.data
            })
        })
        this.fetchProvinces();
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
            this.updateFullAddress();
        });
    };

    handleSpecificAddressChange = (event) => {
        const specificAddress = event.target.value;
        this.setState({ specificAddress }, this.updateFullAddress);
    };

    updateFullAddress = () => {
        const { provinceName, districtName, wardName, specificAddress } = this.state;
        const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
        this.setState({ fullAddress });
    };

    handleEditAddress = async (id) => {
        const token = localStorage.getItem('jwtToken');
        console.log(id)
        try {
            const response = await axios.post(`http://localhost:8080/user/api/address/detail/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const address = response.data;
            const specificAddress = address.full_address.split(',')[0].trim();

            this.setState({
                id_address: id,
                selectedProvince: address.id_province,
                specificAddress: specificAddress,
            }, async () => {
                await this.fetchDistricts(address.id_province);
                this.setState({ selectedDistrict: address.id_district }, async () => {
                    await this.fetchWards(address.id_district);

                    const provinceName = this.state.provinces.find(p => p.ProvinceID === address.id_province)?.ProvinceName || '';

                    const districtName = this.state.districts.find(d => d.DistrictID === address.id_district)?.DistrictName || '';

                    const wardName = this.state.wards.find(ward => ward.WardCode.toString() === address.id_ward.toString())?.WardName || '';

                    this.setState({ selectedWard: address.id_ward, wardName, provinceName, districtName });
                });
            });

            // Open the edit address modal
            document.querySelector('#exampleModalTips1').classList.add('show');
        } catch (error) {
            console.error('Error fetching address detail:', error);
        }
    }

    handleSetDefault = async (id) => {
        const token = localStorage.getItem('jwtToken');

        try {
            await axios.post(`http://localhost:8080/user/api/address/set-default/${id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast("Địa chỉ đã được thiết lập làm mặc định", {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            this.componentDidMount(); // Re-fetch the list of addresses to reflect the changes
        } catch (error) {
            console.error('Error setting default address:', error);
            toast("Không thể thiết lập địa chỉ mặc định", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
        }
    };



    handleUpdateSubmit = () => {
        const { selectedProvince, selectedDistrict, selectedWard, specificAddress, wardName, districtName, provinceName } = this.state;
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);

        const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;

        const updatedAddress = {
            id_address: this.state.id_address,
            id_user: decoded.id_user,
            provinceId: selectedProvince,
            districtId: selectedDistrict,
            wardId: selectedWard,
            fulladdress: fullAddress,
        };

        axios.post('http://localhost:8080/user/api/address/update', updatedAddress, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            toast("Đã cập nhật địa chỉ", {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // Đóng modal và cập nhật lại danh sách địa chỉ
            document.querySelector('#exampleModalTips1').classList.remove('show');
            this.componentDidMount(); // Cập nhật lại danh sách địa chỉ
        }).catch(error => {
            console.error('Error updating address:', error);
        });
    }

    handleDelete = async (id) => {
        const token = localStorage.getItem('jwtToken');
        await axios.post(`http://localhost:8080/user/api/address/delete/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}` // Nếu có token authentication
            }
        }).then(response => {
            if (response.data) {
                toast("Xóa thành công", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                this.componentDidMount()
            }
            else {
                toast("Xóa thất bại", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
            }
        });
    };

    render() {
        const { listAddress, provinces, districts, wards, specificAddress } = this.state;
        return (
            <>
                <div className="address-container py-4 mx-auto max-w-4xl ">
                    <div className='mb-3'>
                        <AddAddressComp />
                    </div>
                    {listAddress &&
                        listAddress.length > 0 ?
                        listAddress.map((address, index) => (
                            <div
                                key={address.id}
                                className={index % 2 === 0 ? 
                                "rounded-lg shadow-md p-5 py-4 my-5 bg-gray-50" : 
                                "rounded-lg shadow-md p-5 bg-gray-200 py-4 my-5"}>
                                <div className="flex justify-between items-start gap-8  ">
                                    {/* Left: Address details */}
                                    <div className="address-details">
                                        <h4 className="font-bold text-lg text-surface">
                                            {address.user.fullName}
                                            {address.is_default && (
                                                <span className="ms-2 rounded-lg inline-block px-2 py-1 mt-2 text-xs text-white bg-red-500 ">
                                                    Mặc định
                                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-500">{address.user.phone}</p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            {address.full_address}
                                        </p>

                                    </div>

                                    {/* Right: Action buttons */}
                                    <div className="actions text-right mt-5">
                                        <button
                                            onClick={() => this.handleEditAddress(address.id)}
                                            className="text-blue-600 hover:underline mr-4"
                                            data-twe-toggle="modal"
                                            data-twe-target="#exampleModalTips1"
                                            data-twe-ripple-init
                                        >
                                            Cập nhật
                                        </button>
                                        <button
                                            onClick={() => this.handleDelete(address.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                      
                                        <button
                                            onClick={!address.is_default ? () => this.handleSetDefault(address.id) : null}
                                            className={!address.is_default
                                                ? "uppercase font-bold bg-red-300 ml-4 mt-2 inline-block border px-4 py-1 text-xs  text-gray-700 border-gray-300 hover:bg-black hover:text-white"
                                                : "bg-slate-300 uppercase font-bold ml-4 mt-2 inline-block border px-4 py-1 text-xs  text-gray-700 border-gray-300 hover:bg-slate-400 hover:text-white cursor-not-allowed"
                                            }
                                        >
                                            Thiết lập mặc định
                                        </button>

                                    </div>

                                </div>
                            </div>
                        )) :
                        <div className="flex items-center justify-center h-64">
                            <p className="text-lg font-semibold uppercase text-gray-500">
                                KHÔNG CÓ ĐỊA CHỈ
                            </p>
                        </div>
                    }
                </div>

                {/* Modal for editing address */}
                <div>

                    {/* <!-- Modal --> */}
                    <div
                        data-twe-modal-init
                        class="fixed left-0 top-20 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                        id="exampleModalTips1"
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
                                        CẬP NHẬT ĐỊA CHỈ
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
                                                <select value={this.state.selectedProvince} onChange={this.handleProvinceChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                    <option value="">Chọn Tỉnh/Thành phố</option>
                                                    {provinces.map(province => (
                                                        <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                                <select value={this.state.selectedDistrict} onChange={this.handleDistrictChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                    <option value="">Chọn Quận/Huyện</option>
                                                    {districts.map(district => (
                                                        <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                                <select value={this.state.selectedWard} onChange={this.handleWardChange} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500">
                                                    <option value="">Chọn Xã/Phường</option>
                                                    {wards.map(ward => (
                                                        <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="relative flex-shrink-0 sm:w-12/12 mt-4">
                                                <textarea value={specificAddress}
                                                    onChange={this.handleSpecificAddressChange}
                                                    id="billing-address" name="billing-address" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Nhập địa chỉ cụ thể" />
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div
                                    class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                    <button
                                        onClick={() => this.handleUpdateSubmit()}
                                        type="button"
                                        class="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                        data-twe-ripple-init
                                        data-twe-modal-dismiss
                                        data-twe-ripple-color="light">
                                        LƯU THAY ĐỔI
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
