import axios from 'axios'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../StorageImageText/TxtImageConfig';
import { toast, Toaster } from 'sonner';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
class CartDetailComp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cartData: [],
            imageListVariants: [],
            nameP: '',
            totalPrice: 0,
            selectAllChecked: false,
            user: {},
        }
        this.imageListVariantsRef = ref(storage, 'images/');
    }

    async componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token)
        console.log(decoded.id_user)

        if (token) {
            this.setState({
                user: decoded
            })
        }

        const resp = await axios.get(`http://localhost:8080/user/api/cartdetail/${decoded.id_user}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            }
        )

        console.log(resp)
        this.setState({
            cartData: resp && resp.data ? resp.data.map(item => ({ ...item, checked: false })) : [],
            // nameP: name_prod,
        })
        this.fetchImageList();
    }

    fetchImageList() {
        listAll(this.imageListVariantsRef).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ imageListVariants: urls });
            });
        });
    }

    handleQuantityChange = (index, quantity) => {
        this.setState((prevState) => {
            const newCartData = prevState.cartData.map((item, i) => {
                if (i === index && item) {  // Kiểm tra nếu item tồn tại
                    const maxQuantity = item.variantProduct.quantity;

                    // Kiểm tra nếu `quantity` là rỗng, set thành 0 để giá về 0
                    const updatedQuantity = quantity === '' ? 0 : (quantity > maxQuantity ? maxQuantity : quantity < 0 ? 0 : quantity);

                    return {
                        ...item,
                        quantity: updatedQuantity
                    };
                }
                return item;
            });

            return { cartData: newCartData };
        }, () => {
            if (this.state.cartData[index]) {  // Kiểm tra nếu item tồn tại
                console.log(this.state.cartData[index].quantity);
                this.calculateTotalPrice();
            }
        });
    };

    incrementQuantity = (index, event) => {
        event.stopPropagation();
        this.setState((prevState) => {
            const newCartData = prevState.cartData.map((item, i) => {
                if (i === index && item) {  // Kiểm tra nếu item tồn tại
                    if (item.quantity < item.variantProduct.quantity) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return { ...item, quantity: item.quantity }
                    }
                }
                return item;
            });
            return { cartData: newCartData };
        }, () => {
            if (this.state.cartData[index]) {  // Kiểm tra nếu item tồn tại
                console.log(this.state.cartData[index].quantity);
                this.calculateTotalPrice();
            }
        });

    };


    decrementQuantity = (index, event) => {
        event.stopPropagation();
        this.setState((prevState) => {
            const newCartData = prevState.cartData.map((item, i) => {
                if (i === index && item) {  // Kiểm tra nếu item tồn tại
                    return {
                        ...item,
                        quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity
                    };
                }
                return item;
            });
            return { cartData: newCartData };
        }, () => {
            if (this.state.cartData[index]) {  // Kiểm tra nếu item tồn tại
                console.log(this.state.cartData[index].quantity);
                this.calculateTotalPrice();
            }
        });
        console.log(index)
    };


    handleCheckboxChange = (index) => {
        this.setState((prevState) => {
            const newCartData = prevState.cartData.map((item) => {
                // Ensure you're targeting the correct item by comparing item.id to the given index
                if (item.id === index) {
                    return { ...item, checked: !item.checked }; // Toggle the 'checked' property
                }
                return item;
            });
            return { cartData: newCartData };
        }, () => {
            this.calculateTotalPrice(); // Recalculate total price after state update
        });
    }

    async handleDeleteCartItem(id) {
        const token = localStorage.getItem('jwtToken')
        try {
            await axios.delete(`http://localhost:8080/user/api/cartdetail/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            });

            // Fetch updated data
            const resp = await axios.get(`http://localhost:8080/user/api/cartdetail/${this.state.user.id_user}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                    }
                }
            );
            this.setState({
                cartData: resp && resp.data ? resp.data.map(item => ({ ...item, checked: false })) : []
            });
            this.calculateTotalPrice();
        } catch (error) {
            toast.error("Delete failed");
            console.error("There was an error deleting the cart item!", error);
        }
    }

    handleSelectAllChange = () => {
        this.setState((prevState) => {
            const newSelectAllChecked = !prevState.selectAllChecked;
            const newCartData = prevState.cartData.map((item) => ({
                ...item,
                checked: newSelectAllChecked
            }));
            return {
                cartData: newCartData,
                selectAllChecked: newSelectAllChecked,
            };
        }, () => {
            this.calculateTotalPrice();
        });
    }

    calculateTotalPrice = () => {
        const totalPrice = this.state.cartData.reduce((acc, item) => {
            if (item.checked) {
                return acc + (item.quantity * item.discountedPrice);
            }
            return acc;
        }, 0);

        this.setState({ totalPrice }, () => {
            console.log('Updated totalPrice:', this.state.totalPrice); // Verify if totalPrice is updated correctly
        });
    }


    saveSelectedItemsToSession = () => {
        const selectedItems = this.state.cartData.filter(item => item.checked);
        console.log(selectedItems)
        if (isNaN(this.state.totalPrice) && isNaN(selectedItems.quantity)) {
            toast("Vui lòng chọn số lượng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error("Vui lòng chọn số lượng");
            return
        } else if (this.state.totalPrice <= 0 || selectedItems.quantity <= 0) {
            toast("Vui lòng chọn số lượng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            toast("Vui lòng chọn số lượng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            return
        }
        if (selectedItems.length <= 0) {
            toast("Bạn vẫn chưa chọn sản phẩm!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
           
            return
        } else {
            this.props.history.push('/checkout');
            sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
            sessionStorage.setItem('totalPrice', this.state.totalPrice);
        }
    }

    render() {
        const { cartData, totalPrice, selectAllChecked } = this.state;
        return (
            <>
                <div class="container mx-auto max-w-7xl  px-4 py-4 sm:px-6 sm:py-4 gap-6 md:p-10 lg:p-10
                font-sansmax-md:max-w-xl bg-slate-50">
                    <h1 class="pt-6 text-3xl uppercase font-bold text-gray-800 text-center">Giỏ hàng </h1>

                    <div class="flex justify-start">
                        {/* checkbox chọn tất cả các mặt hàng cần đặt hàng*/}
                        <div class="pt-5 me-4 inline-block min-h-[1.5rem] ps-[1.5rem]">
                            <input
                                //className
                                class="relative float-left -ms-[1.5rem] me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-checkbox before:shadow-transparent before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ms-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-checkbox checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ms-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent rtl:float-right dark:border-neutral-400 dark:checked:border-primary dark:checked:bg-primary"
                                type="checkbox"
                                id="inlineCheckbox1"
                                value="option1"
                                checked={selectAllChecked}
                                onChange={this.handleSelectAllChange}
                            />
                            <label
                                class="inline-block font-semibold uppercase ps-[0.15rem] hover:cursor-pointer"
                                for="inlineCheckbox1"
                            >CHỌN TẤT CẢ</label>
                        </div>
                        {/* đóng chọn tất cả các mặt hàng cần đặt hàng*/}
                    </div>

                    <div class=" gap-8 mt-16" >
                        <div class=" space-y-4 align-middle">
                            {/* fetch Data Bien the load vao element */}
                            {cartData && cartData.length > 0 && cartData != null ? cartData.map((item, index) =>
                            (
                                <>
                                    <div id={item.id} key={item.id} className="grid grid-cols-4 items-start max-md:grid-cols-1">
                                        {/* Phần thông tin sản phẩm */}
                                        <div className="col-span-2 flex items-start gap-4">
                                            <div className="mb-[0.125rem] block min-h-[1.5rem] ps-[1.5rem] mt-10">
                                                <input
                                                    className="cursor-pointer h-[1.125rem] w-[1.125rem] rounded-[0.25rem] border-[0.125rem] border-solid border-secondary-500"
                                                    type="checkbox"
                                                    id={`checkbox-${item.id}`}
                                                    checked={item.checked}
                                                    onChange={() => this.handleCheckboxChange(item.id)}
                                                />
                                            </div>
                                            <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0 bg-gray-100 p-2 rounded-md">
                                                <img src={item.variantProduct.image_variant} className="w-full h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-base font-bold text-gray-800">{item.variantProduct.product.name_prod} {item.variantProduct.size.name_size}</h3>
                                                <div className="flex items-center">
                                                    <div className="text-base font-bold text-gray-800 mr-2">Màu:</div>
                                                    <div
                                                        className="w-7 h-7 border rounded-full"
                                                        style={{
                                                            backgroundColor: item.variantProduct.color.color_name,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-lg font-semibold text-red-500 mt-0.5">
                                                    GIÁ: {item.discountedPrice.toLocaleString()} đ
                                                </p>
                                                <button
                                                    onClick={() => this.handleDeleteCartItem(item.id)}
                                                    type="button"
                                                    className="mt-6 font-semibold text-blue-500 text-xs flex items-center gap-1 shrink-0"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-current inline" viewBox="0 0 24 24">
                                                        <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"></path>
                                                        <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"></path>
                                                    </svg>
                                                    XÓA
                                                </button>
                                            </div>
                                        </div>

                                        {/* Phần điều khiển số lượng */}
                                        <div className="ml-auto">
                                            <div className="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
                                                <div className="flex mt-6 items-center h-full">
                                                    <button
                                                        onClick={(e) => this.decrementQuantity(index, e)}
                                                        className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300"
                                                    >
                                                        <svg className="stroke-gray-900" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                                            <path d="M16.5 11H5.5" stroke-width="1.6" stroke-linecap="round" />
                                                        </svg>
                                                    </button>
                                                    <input type="number"
                                                        class="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px]  text-center bg-transparent
                                                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                                        "
                                                        value={item.quantity}
                                                        min="1"
                                                        max={item.variantProduct.quantity}
                                                        onChange={(e) => this.handleQuantityChange(index, parseInt(e.target.value))}
                                                    />
                                                    <button
                                                        onClick={(e) => this.incrementQuantity(index, e)}
                                                        className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300"
                                                    >
                                                        <svg className="stroke-gray-900" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                                                            <path d="M11 5.5V16.5M16.5 11H5.5" stroke-width="1.6" stroke-linecap="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phần giá nhân số lượng */}
                                        <div className="ml-5 max-md:mt-3">
                                            <div className="w-full h-full">
                                                <h4 className="text-lg mt-10 items-center max-sm:text-base font-bold text-gray-800">
                                                    {(item.quantity * item.discountedPrice) > 0 ? (item.quantity * item.discountedPrice).toLocaleString() : 0} đ
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    <hr class="border-gray-300" />
                                </>
                            ))
                                :

                                <>
                                    <div className='flex items-center justify-center'>
                                        <img className='max-w-full max-h-full object-contain' src='https://www.ruouhungdong.vn/assets/images/no-cart.png' alt='Giỏ hàng trống' />
                                    </div>
                                    <div className='text-4xl uppercase text-center mt-3'>Giỏ hàng trống</div>
                                </>

                            }
                        </div>

                        <div class="bg-white-100 rounded-md p-4 h-max">
                            <ul class="text-gray-700  mt-6 space-y-3">
                                <li class="flex font-extrabold text-3xl flex-wrap gap-4 ">
                                    Tổng tiền:  <span class="ml-auto text-red-500">{totalPrice > 0 ? this.state.totalPrice.toLocaleString() : 0} </span>đ
                                </li>
                            </ul>
                            {/* Đóng Tính tổng tiền */}
                            <div className='flex'>

                            </div>
                            <div className='flex'>
                                <div class="mt-6 block space-y-3 w-6/12 me-2">
                                    <NavLink to="/">
                                        <button type="button" class="text-sm px-4 py-2.5 w-full font-semibold  tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md">Quay lại cửa hàng  </button>

                                    </NavLink>
                                </div>

                                <div class="mt-6 block space-y-3 w-6/12">
                                    {/* <NavLink to="/checkout"> */}
                                    <button class="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-500 hover:bg-gray-700 text-white rounded-md"
                                        onClick={this.saveSelectedItemsToSession}
                                    >
                                        Đặt hàng
                                    </button>
                                    {/* </NavLink> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default withRouter(CartDetailComp)