import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../StorageImageText/TxtImageConfig';
// import { toast } from 'react-toastify';
import { toast, Toaster } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Rating } from '@mui/material';
import { FaFacebook, FaFacebookMessenger, FaHeart } from "react-icons/fa";

class ProdDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            dataAddToCheckOut: [],
            listVariants: [],
            imageListVariants: [],
            imageProduct: {},
            product: {},
            selectedColorId: null,
            selectedSizeId: null,
            priceVariants: 0,
            availableProducts: 0,
            availableColors: [],
            quantity: 1,
            id_variant: null, // Thêm state để lưu id_variant
            listFeedback: [],
            selectedStar: 0,
            likesCount: 0,
            isLiked: false,
            sumSellQuantity: 0,
        };
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.imageListVariantsRef = ref(storage, 'images/');
        this.imageProductRef = ref(storage, 'images/');
        this.fetchImageList = this.fetchImageList.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleBuyNow = this.handleBuyNow.bind(this);
    }

    handleUpQuantity = () => {
        if (this.state.availableProducts === this.state.quantity) {
            toast("Số lượng vượt quá sản phẩm cho phép", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })

            this.setState({
                quantity: this.state.availableProducts
            })
            return
        } else {
            this.setState({
                quantity: parseInt(this.state.quantity + 1)
            })
        }
    }

    handleDownQuantity = () => {
        this.setState({
            quantity: parseInt(this.state.quantity === 1 ? 1 : this.state.quantity - 1),
        })
    }

    handleInputOnchange = (e) => {
        let value = parseInt(e.target.value);

        if (isNaN(value) || value < 1) {
            value = 1;
            toast("Số lượng không thể nhỏ hơn 1", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Số lượng không thể nhỏ hơn 1');
        } else if (value > this.state.availableProducts) {
            value = this.state.availableProducts;
            toast("Số lượng vượt quá sản phẩm sẵn có", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Số lượng vượt quá sản phẩm sẵn có');
        }

        this.setState({
            quantity: value
        });
    }


    async componentDidMount() {
        if (this.props.match && this.props.match.params) {
            let id = this.props.match.params.id;

            let resProd = await axios.get(`http://localhost:8080/user/api/products1/${id}`);
            let res = await axios.get(`http://localhost:8080/user/api/variants/${id}`);
            let dataFeedback = await axios.get(`http://localhost:8080/user/api/feedback/listFeedback/${id}`);
            let quantitySell = await axios.get(`http://localhost:8080/user/api/products1/${id}/successful-orders`)

            const variants = res && res.data ? res.data : [];
            const product = resProd && resProd.data ? resProd.data : {};
            const feedbacks = dataFeedback && dataFeedback.data ? dataFeedback.data : []
            const token = localStorage.getItem('jwtToken')
            const dataQuantitySell = quantitySell && quantitySell.data ? quantitySell.data : 0

            localStorage.setItem('name_prod', product.name_prod);
            if (token) {
                const decoded = jwtDecode(token)
                this.setState({ user: decoded, product: product }, () => {
                    this.checkIfLiked(); // Gọi hàm kiểm tra trạng thái thích
                });
            }

            this.setState(
                {
                    listVariants: variants,
                    imageProduct: product,
                    product: product,
                    listFeedback: feedbacks,
                    sumSellQuantity: dataQuantitySell
                },
                () => {
                    // Tìm biến thể đầu tiên có quantity > 0
                    const firstVariant = variants.find((item) => item.quantity > 0);

                    if (firstVariant) {
                        // Get all available colors from the variants
                        const availableColors = variants
                            .filter((item) => item.quantity > 0)
                            .map((item) => item.color);

                        // Get the size list based on the first color available
                        const availableSizes = variants
                            .filter((item) => item.color.id === firstVariant.color.id && item.quantity > 0)
                            .map((item) => item.size);

                        this.setState({
                            selectedColorId: firstVariant.color.id,
                            availableColors: availableColors,
                            selectedSizeId: availableSizes.length > 0 ? availableSizes[0].id : null,
                            priceVariants: firstVariant.price,
                            availableProducts: firstVariant.quantity,
                            id_variant: firstVariant.id // Lưu id_variant đầu tiên
                        });
                    } else {
                        // Không có biến thể nào hợp lệ
                        this.setState({
                            selectedColorId: null,
                            availableColors: [],
                            selectedSizeId: null,
                            priceVariants: null,
                            availableProducts: 0,
                            id_variant: null // Không có id_variant nào
                        });
                    }
                }
            );
        }
        this.updateProductDetails()
        this.fetchImageList();
        this.fetchLikesCount();
    }

    handleColorChange(event) {
        const colorId = event.target.value;
        const { listVariants } = this.state;

        const availableSizes = listVariants
            .filter((item) => item.color.id === parseInt(colorId))
            .map((item) => item.size);

        this.setState(
            {
                selectedColorId: colorId,
                availableSizes: availableSizes,
                selectedSizeId: availableSizes.length > 0 ? availableSizes[0].id : null,
            },
            this.updateProductDetails
        );
    }

    handleSizeChange(event) {
        const sizeId = event.target.value;
        this.setState(
            {
                selectedSizeId: sizeId,
            },
            this.updateProductDetails
        );
    }

    async updateProductDetails() {
        const { selectedColorId, selectedSizeId, listVariants } = this.state;

        if (selectedColorId && selectedSizeId) {
            const matchingVariant = listVariants.find(
                (item) =>
                    item.color.id === parseInt(selectedColorId) &&
                    item.size.id === parseInt(selectedSizeId)
            );

            if (matchingVariant) {
                try {
                    const discountRes = await axios.get(`http://localhost:8080/user/api/variants/discount/${matchingVariant.id}`);
                    const discountPercent = discountRes.data;

                    this.setState({
                        availableProducts: matchingVariant.quantity,
                        priceVariants: matchingVariant.price,
                        discountPercent,
                        id_variant: matchingVariant.id,
                        imageProduct: { image_prod: matchingVariant.image_variant },
                    });
                } catch (error) {
                    console.error('Error fetching discount:', error);
                }
            } else {
                this.setState({
                    availableProducts: 0,
                    priceVariants: 0,
                    discountPercent: 0,
                    id_variant: null,
                });
            }
        }
    }

    fetchImageList() {
        listAll(this.imageListVariantsRef).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ imageListVariants: urls });
            });
        });
    }

    async handleAddToCart() {
        const user_id = this.state.user.id_user;
        const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage

        if (!token) {
            toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        if (!user_id) {
            toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        const { id_variant, quantity } = this.state;

        if (!id_variant) {
            toast("Vui lòng chọn kích thước và màu sắc sản phẩm", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Vui lòng chọn kích thước và màu sắc sản phẩm');
            return;
        }

        const data = {
            id_user: user_id,
            id_variant: id_variant,
            quantity: quantity
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/cartdetail/post', data, {
                headers: {
                    'Authorization': `Bearer ${token}` // Đính kèm token vào yêu cầu
                }
            });
            if (response.status === 200) {
                toast("Sản phẩm đã được thêm vào giỏ hàng", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.success('Sản phẩm đã được thêm vào giỏ hàng');
            } else {
                toast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            alert(error);
            if (error.response && error.response.status === 401) {
                // toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
                // this.props.history.push('/login');

            } else {
                toast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
            }
        }
    }

    async handleBuyNow() {
        const user_id = this.state.user.id_user;
        const { id_variant, quantity } = this.state;
        const token = localStorage.getItem('jwtToken'); // Get the JWT token from localStorage

        if (!token) {
            toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            this.props.history.push('/login');
            return;
        }

        if (!user_id) {
            toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            this.props.history.push('/login');
            return;
        }

        if (!id_variant) {
            toast("Vui lòng chọn kích thước và màu sắc sản phẩm", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Vui lòng chọn kích thước và màu sắc sản phẩm');
            return;
        }

        const data = {
            id_user: user_id,
            id_variant: id_variant,
            quantity: quantity
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/cartdetail/order-direct', data, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the request
                }
            });
            if (response.status === 200) {
                const dulieu = response.data;
                console.log('dulieu to save:', dulieu);

                // Đảm bảo dữ liệu được lưu vào session là một mảng
                sessionStorage.setItem('selectedCartItems', JSON.stringify([dulieu]));
                sessionStorage.setItem('totalPrice', dulieu.discountedPrice * dulieu.quantity);
                this.props.history.push('/checkout');

            } else {
                toast("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            alert(error);
            if (error.response && error.response.status === 401) {
                toast("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                this.props.history.push('/login');
            } else {
                toast.error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
            }
        }
    }

    //like product
    // Hàm gọi API để thích/không thích sản phẩm
    toggleLikeProduct = async () => {
        const { user, product } = this.state;
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            toast("Bạn cần đăng nhập để thích sản phẩm", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error("Bạn cần đăng nhập để thích sản phẩm");
            this.props.history.push("/login");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/user/api/like/${user.id_user}/${product.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            this.setState({ isLiked: response.data.isLiked });
            this.fetchLikesCount(); // Cập nhật số lượt thích sau khi thích/không thích
        } catch (error) {
            toast("Có lỗi xảy ra khi thực hiện hành động thích sản phẩm", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error("Có lỗi xảy ra khi thực hiện hành động thích sản phẩm");
        }
    };

    // Hàm gọi API để lấy số lượt thích của sản phẩm
    fetchLikesCount = async () => {
        const { product } = this.state;
        try {
            const response = await axios.get(
                `http://localhost:8080/api/auth/count/${product.id}`
            );
            this.setState({ likesCount: response.data });
        } catch (error) {
            toast("Có lỗi xảy ra khi lấy số lượt thích của sản phẩm", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error("Có lỗi xảy ra khi lấy số lượt thích của sản phẩm");
        }
    };

    checkIfLiked = async () => {
        const { user, product } = this.state;
        const token = localStorage.getItem("jwtToken"); // Lấy token từ localStorage

        if (!user || !product.id || !token) return; // Kiểm tra xem token có tồn tại hay không

        try {
            const response = await axios.get(
                `http://localhost:8080/user/api/like/${user.id_user}/${product.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Đính kèm token vào yêu cầu
                    },
                }
            );
            if (response.data) {
                this.setState({ isLiked: response.data.isLiked }); // Cập nhật state với giá trị isLiked
            } else {
                this.setState({ isLiked: false });
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi kiểm tra trạng thái thích", error);
        }
    };

    // Calculate average rating
    calculateAverageRating = (listFeedback) => {
        const totalFeedback = listFeedback && listFeedback.length > 0 ? listFeedback.length : 0;
        const averageRating = listFeedback.reduce((sum, feedback) => sum + feedback.number_star, 0) / totalFeedback;
        return averageRating.toFixed(1);
    };

    // Method to handle the filter by star rating
    handleFilterClick = (star) => {
        this.setState({ selectedStar: star });
    };

    // Method to filter reviews based on selected star
    filterFeedbackByStar = (listFeedback) => {
        const { selectedStar } = this.state;
        if (selectedStar === 0) {
            return listFeedback; // Show all reviews
        }
        return listFeedback.filter(feedback => feedback.number_star === selectedStar);
    };

    // Method to calculate the number of reviews for each star rating
    calculateStarCount = (listFeedback) => {
        return [5, 4, 3, 2, 1].map(star => ({
            star,
            count: listFeedback.filter(feedback => feedback.number_star === star).length,
        }));
    };


    render() {
        const timeAgo = (date) => {
            const now = new Date();
            const createdDate = new Date(date);
            const seconds = Math.floor((now - createdDate) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (seconds < 60) {
                return 'Vài giây trước';
            } else if (minutes < 60) {
                return `${minutes} phút trước`;
            } else if (hours < 24) {
                return `${hours} giờ trước`;
            } else if (days < 30) {
                return `${days} ngày trước`;
            } else if (months < 12) {
                return `${months} tháng trước`;
            } else {
                return `${years} năm trước`;
            }
        };

        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: true, // Hiển thị mũi tên

        };

        const { user, listVariants, imageProduct, product,
            availableProducts, priceVariants, selectedSizeId, selectedColorId, availableColors, id_variant, discountPercent, listFeedback, selectedStar, sumSellQuantity
        } = this.state;


        const totalFeedback = listFeedback.length;
        const averageRating = totalFeedback > 0 ? this.calculateAverageRating(listFeedback) : 0;
        const filteredFeedback = this.filterFeedbackByStar(listFeedback);
        const starCount = this.calculateStarCount(listFeedback);

        const brand = product.brand || {};
        const category = product.category || {};

        const finalPrice = discountPercent > 0
            ? priceVariants - (priceVariants * discountPercent / 100)
            : priceVariants;

        const prices = listVariants.map(variant => variant.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Lọc các size có sẵn dựa trên màu đã chọn
        const availableSizes = listVariants
            .filter(item => item.color.id === parseInt(selectedColorId) && item.quantity > 0)
            .map(item => item.size);

        return (

            <div className='w-full mx-auto max-w-7xl rounded-lg mt-10 px-4 py-4 sm:px-6 sm:py-4 bg-gray-50 mb-5'>
                <div className="grid md:grid-cols-2 w-full">
                    {/* Hình ảnh sản phẩm */}
                    <div className="w-full">
                        <div className="w-full md:w-full lg:w-3/4 h-96 overflow-hidden relative group">
                            <img
                                src={this.state.imageProduct?.image_prod || product.image_prod}
                                alt="product"
                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
                            />
                        </div>
                        <div className="mt-4 w-full md:w-3/4 ">
                            <Slider {...settings}>
                                {/* Hình ban đầu */}
                                <div>
                                    <img
                                        src={product.image_prod}
                                        alt="product default"
                                        className="w-full h-24 object-cover cursor-pointer border border-gray-300 hover:border-primary"
                                        onClick={() =>
                                            this.setState({
                                                imageProduct: { image_prod: product.image_prod },
                                            })
                                        }
                                    />
                                </div>
                                {/* Hình biến thể */}
                                {listVariants &&
                                    listVariants.map((item, index) => (
                                        <div className='' key={index} style={{ padding: '0 8px' }}>
                                            <img
                                                src={item.image_variant}
                                                alt="product variant"
                                                className="w-full h-24 object-cover cursor-pointer border border-gray-300 hover:border-primary"
                                                onClick={() =>
                                                    this.setState({
                                                        imageProduct: { image_prod: item.image_variant },
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                            </Slider>
                        </div>

                        <div className="flex items-center space-x-4 mt-6">
                            <span>Chia sẻ: </span>

                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600"
                            >
                                <FaFacebook size={24} />
                                <span>Facebook</span>
                            </a>

                            <a
                                href={`https://www.messenger.com/t/?link=${window.location.href}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-500"
                            >
                                <FaFacebookMessenger size={24} />
                                <span>Messenger</span>
                            </a>

                            {/* Đường thẳng dọc */}
                            <div className="border-l border-gray-300 h-6 mx-4"></div>

                            <button
                                onClick={this.toggleLikeProduct}
                                className="flex items-center space-x-1 text-gray-600"
                            >
                                <FaHeart
                                    size={24}
                                    className={this.state.isLiked ? "text-red-500" : ""} // Hiển thị màu đỏ nếu đã thích
                                />
                                <span>
                                    {this.state.isLiked ? "Đã thích" : "Thích"} (
                                    {this.state.likesCount})
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className=" text-start">
                        <h2 className="text-2xl w-full md:text-3xl font-semibold uppercase mb-4">
                            {product.name_prod}
                        </h2>

                        {/* Giá sản phẩm */}
                        <div className="flex items-baseline mb-4 space-x-2 font-roboto mt-4">
                            {/* Nếu chưa chọn màu, hiển thị giá min-max */}
                            {!selectedColorId ? (
                                <p className="text-xl text-primary font-semibold">
                                    {minPrice?.toLocaleString() || "0"} VNĐ - {maxPrice?.toLocaleString() || "0"} VNĐ
                                </p>
                            ) : discountPercent > 0 ? (
                                // Nếu đã chọn màu và có giảm giá, hiển thị giá đã giảm và giá gốc
                                <>
                                    <p className="text-xl text-primary font-semibold">
                                        {finalPrice?.toLocaleString() || "0"} VNĐ
                                    </p>
                                    <p className="text-base text-gray-400 line-through">
                                        {priceVariants?.toLocaleString() || "0"} VNĐ
                                    </p>
                                </>
                            ) : (
                                // Nếu đã chọn màu nhưng không có giảm giá
                                <p className="text-xl text-primary font-semibold">
                                    {priceVariants?.toLocaleString() || "0"} VNĐ
                                </p>
                            )}
                        </div>

                        <div className="divide-y divide-gray-300">
                            <div className="flex items-center py-2">
                                <span className="text-gray-800 me-20">Đánh giá </span>
                                <div className="mr-2 text-gray-600 font-semibold">
                                    {totalFeedback > 0 ? averageRating : "0"}
                                </div>
                                {totalFeedback > 0 && (
                                    <>
                                        <div>
                                            <Rating name="read-only" value={parseFloat(averageRating)} precision={0.1} readOnly />
                                        </div>
                                        <span className="ml-2 text-gray-600">({totalFeedback} đánh giá)</span>
                                    </>
                                )}
                            </div>
                            <div className=" divide-y divide-gray-300">
                                <div className="flex items-center py-2">
                                    <span className="text-gray-800 me-11">Thương hiệu</span>
                                    <span className="ml-2 text-gray-600 font-semibold">{brand.name_brand}</span>
                                </div>
                                <div className="flex items-center py-2">
                                    <span className="text-gray-800 me-10">Đã bán được</span>

                                    {sumSellQuantity > 0 ? (
                                        <span className="ml-2 text-gray-600 font-bold">
                                            {sumSellQuantity} sản phẩm
                                        </span>
                                    ) : (
                                        <span className="ml-2 text-gray-600 font-bold">
                                            0
                                        </span>
                                    )}

                                    {/* {sumSellQuantity > 0 && <span className="ml-2 text-gray-600">Sản phẩm</span>} */}
                                </div>
                                <div className="flex items-center py-2">
                                    <span className="text-gray-800 me-16">Danh mục</span>
                                    <span className="ml-2 text-gray-600 font-semibold">{category.name_cate}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="h-px my-8 bg-gray-500 border-0 dark:bg-gray-700" />


                        {/* Màu sắc */}
                        <div className="py-3 text-lg uppercase font-bold">Màu sắc</div>
                        <div className="flex gap-4">
                            {listVariants &&
                                [...new Map(
                                    listVariants.map((item) => [item.color.id, item.color])
                                ).values()].map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => this.handleColorChange({ target: { value: color.id } })}
                                        className={`w-10 h-10 border rounded-full focus:outline-none p-1 ${selectedColorId === color.id ? 'border-4 border-gray-500' : 'border-2 border-gray-300'
                                            }`}
                                        style={{ backgroundColor: '#fff', padding: '2px' }}
                                    >
                                        <div className="w-full h-full rounded-full" style={{ backgroundColor: color.color_name }}></div>
                                    </button>
                                ))}
                        </div>



                        {/* Kích thước */}
                        <div className='py-3 text-lg uppercase font-bold'>Kích cỡ</div>
                        <div className="flex gap-4 pt-4">
                            {listVariants &&
                                [...new Map(
                                    listVariants.map((item) => [item.size.id, item.size])
                                ).values()].map((size) => {
                                    // Kiểm tra xem kích thước này có khả dụng cho màu đã chọn không
                                    const isAvailable =
                                        selectedColorId &&
                                        listVariants.some(
                                            (variant) => variant.color.id === parseInt(selectedColorId) && variant.size.id === size.id && variant.quantity > 0
                                        );

                                    return (
                                        <button
                                            key={size.id}
                                            onClick={() => this.handleSizeChange({ target: { value: size.id } })}
                                            className={`px-4 py-2 border rounded ${selectedSizeId === size.id
                                                ? 'bg-blue-500 text-white'
                                                : isAvailable
                                                    ? 'bg-gray-200'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={!isAvailable}
                                        >
                                            {size.name_size}
                                        </button>
                                    );
                                })}
                        </div>


                        {/* Số lượng */}
                        <div className="pt-4">
                            <h3 className="text-xl text-gray-800 font-medium uppercase mb-2">Số lượng</h3>
                            <div className="flex items-center gap-2">
                                <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                                    <button
                                        onClick={this.handleDownQuantity}
                                        className={availableProducts === 0 ? `h-8 w-8 text-xl flex items-center justify-center  cursor-not-allowed` : `h-8 w-8 text-xl flex items-center justify-center cursor-pointer`}
                                        disabled={availableProducts === 0 || this.state.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        onChange={this.handleInputOnchange}
                                        type="number"
                                        value={this.state.quantity}
                                        className={availableProducts === 0 ?
                                            `h-8 w-12 text-center text-gray-900 font-semibold 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed` : `h-8 w-12 text-center text-gray-900 font-semibold 
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        disabled={availableProducts === 0}
                                    />
                                    <button
                                        onClick={this.handleUpQuantity}
                                        className={availableProducts === 0 ? `h-8 w-8 text-xl flex items-center justify-center  cursor-not-allowed` : `h-8 w-8 text-xl flex items-center justify-center cursor-pointer`}
                                        disabled={availableProducts === 0 || this.state.quantity >= availableProducts}
                                    >
                                        +
                                    </button>
                                </div>
                                {availableProducts === 0 ? (
                                    <span className="text-red-500 text-sm">Sản phẩm đã hết hàng</span>
                                ) : (
                                    <>
                                        <span className="font-bold text-gray-600">{availableProducts}</span>
                                        <span className="text-gray-600">Sản phẩm sẵn có</span>
                                    </>
                                )}
                            </div>
                        </div>


                        {/* Nút thao tác */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={this.handleAddToCart}
                                className={`bg-black text-white px-6 py-2 rounded uppercase hover:bg-transparent hover:text-black border border-black transition ${availableProducts === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={availableProducts === 0}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={this.handleBuyNow}
                                className={`bg-white text-gray-600 px-6 py-2 rounded uppercase hover:bg-gray-100 border border-gray-300 transition ${availableProducts === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={availableProducts === 0}
                            >
                                Đặt Ngay
                            </button>
                        </div>

                    </div>
                </div>

                <div className='w-full py-5 bg-slate-50'>
                    <div className='w-full h-auto px-2 py-2 bg-slate-300 font-bold text-center'>Mô tả sản phẩm</div>
                    <div style={{ textAlign: 'left' }} className="m-5 w-full"
                        dangerouslySetInnerHTML={{ __html: product.description }}>
                    </div>
                </div>

                {/* Phần Đánh giá sản phẩm */}
                <div className="container">
                    <div className=" py-5 bg-slate-50">
                        <div className='h-auto px-2 py-2 bg-slate-300 font-bold text-center'>Đánh giá sản phẩm</div>
                        {/* Overall Rating */}
                        <div className='px-4 mx-auto md:px-4 lg:px-4 mt-3'>
                            <div className="flex items-center mb-4">
                                <div className="text-4xl font-bold mr-4">
                                    {totalFeedback > 0 ? averageRating : "Chưa có đánh giá"}
                                </div>
                                {totalFeedback > 0 && (
                                    <>
                                        <Rating name="read-only" value={parseFloat(averageRating)} precision={0.1} readOnly />
                                        <span className="ml-2 text-gray-600">({totalFeedback} đánh giá)</span>
                                    </>
                                )}
                            </div>

                            {/* Rating breakdown */}
                            <div className="mb-6">
                                {totalFeedback > 0 ? (
                                    starCount.map(({ star, count }) => (
                                        <div key={star} className="flex items-center mb-1">
                                            <span className="text-gray-600 w-6">{star}</span>
                                            <Rating name="read-only" value={star} readOnly className="mr-2" />
                                            <div className="relative w-full h-3 bg-gray-200 rounded">
                                                <div
                                                    className="absolute top-0 left-0 h-3 bg-green-500 rounded"
                                                    style={{ width: `${(count / totalFeedback) * 100}%` }}>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">Chưa có đánh giá nào</p>
                                )}
                            </div>
                        </div>

                        {/* Render the actual feedback list */}
                        <div className="w-full">
                            <div className="container bg-slate-50 max-w-full mx-auto px-4">
                                {/* Star Rating Filter Buttons */}
                                <div className="flex flex-wrap m-0 p-0">
                                    <button
                                        className={`px-4 py-2 mr-3 mb-2 border-2 ${selectedStar === 0
                                            ? 'border-green-600 text-black'
                                            : 'border-gray-300 text-black'
                                            }`}
                                        onClick={() => this.handleFilterClick(0)}>
                                        Tất Cả
                                    </button>
                                    {starCount.map(({ star, count }) => (
                                        <button
                                            key={star}
                                            className={`px-4 py-2 mr-3 mb-2 border-2 ${selectedStar === star
                                                ? 'border-green-600 text-black'
                                                : 'border-gray-300 text-black'
                                                }`}
                                            onClick={() => this.handleFilterClick(star)}>
                                            {star}{' '}
                                            <span className="text-yellow-500 text-xl">★</span> ({count})
                                        </button>
                                    ))}
                                </div>

                                {/* Render filtered feedback list */}
                                {filteredFeedback.length > 0 ? (
                                    filteredFeedback.map((feedback, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row items-start mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
                                            <img
                                                src={feedback.user.image_user}
                                                alt=""
                                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    {feedback.user.fullName}
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <Rating
                                                        name="read-only"
                                                        value={feedback.number_star}
                                                        readOnly
                                                    />
                                                    <span className="ml-2 text-gray-600">
                                                        ({feedback.number_star}/5)
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-2">{feedback.content}</p>
                                                <p className="font-semibold">{feedback.user_name}</p>

                                                {/* Hiển thị danh sách ảnh feedback */}
                                                <div className="flex flex-wrap mt-3 gap-3">
                                                    {feedback.imageUrls && feedback.imageUrls.map((url, imgIndex) => (
                                                        <img
                                                            key={imgIndex}
                                                            src={url}
                                                            alt={`feedback-${imgIndex}`}
                                                            className="w-20 h-20 rounded-lg object-cover"
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-500 text-sm mt-3">
                                                    {timeAgo(feedback.created_date)}
                                                </p>
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 mt-5">
                                        Chưa có đánh giá nào cho mức đánh giá này.
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProdDetail);