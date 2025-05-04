import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode'; // Đã sửa đúng cách import
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../StorageImageText/TxtImageConfig';
import { withRouter } from 'react-router-dom';
import { Rating } from '@mui/material';
import ReactLoading from 'react-loading';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});


class ListCheckOutUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataCheck: [],
            filteredOrders: [],
            dataOrderDetail: {}, // Thay đổi: lưu chi tiết đơn hàng theo orderId
            imageListVariants: [],
            user: {},
            activeTab: 'all',
            expandedOrders: [],
            currentPage: 1, // Quản lý trang hiện tại
            itemsPerPage: 2, // Số lượng phần tử mỗi trang
            selectedReason: '',
            id_order: '',
            isSatisfied: false,
            content_feedback: '',
            rating: {},
            feedback: {},
            isLoading: false,
            selectedImages: {}, // Mảng chứa các hình ảnh được chọn
            imagePreviews: {}, // Mảng chứa URL xem trước
        };
        this.fileInputs = {}; // Tạo một đối tượng để lưu các ref
        this.imageListVariantsRef = ref(storage, 'variant-images/');
        this.fetchImageList = this.fetchImageList.bind(this);
    }
    
    async componentDidMount() {
        try {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                const decoded = jwtDecode(token);
                this.setState({ user: decoded });

                const dataCheckOut = await api.get(`/user/api/order/all/${decoded.id_user}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const dataFeedback = await api.get(`/user/api/order-details/orderDetailWithFeedbackAndImages`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                const feedbackMap = {};
                dataFeedback.data.forEach(feedback => {
                    feedbackMap[feedback.orderDetailId] = feedback;
                });

                const sortedOrders = dataCheckOut.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

                this.setState({
                    dataCheck: sortedOrders,
                    filteredOrders: sortedOrders,
                    feedbackData: feedbackMap,
                });
            } else {
                alert('Error: No token found');
            }
        } catch (error) {
            console.error("Error in componentDidMount: ", error);
        }
    }

    componentWillUnmount() {
        // Hủy URL để tránh rò rỉ bộ nhớ
        Object.values(this.state.imagePreviews).forEach((previews) => {
            previews.forEach((preview) => URL.revokeObjectURL(preview));
        });
    }



    fetchImageList() {
        listAll(this.imageListVariantsRef).then((response) => {
            const fetchUrls = response.items.map((item) => getDownloadURL(item));
            Promise.all(fetchUrls).then((urls) => {
                this.setState({ imageListVariants: urls });
            });
        });
    }

    formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds} ngày ${day}/${month}/${year}`;
    };

    // Lọc đơn hàng theo tab
    handleTabChange = (status) => {
        if (status === 'all') {
            this.setState({ filteredOrders: this.state.dataCheck, activeTab: 'all', currentPage: 1 });
        } else {
            const filtered = this.state.dataCheck.filter(order => order.state.name_status_order === status);
            this.setState({ filteredOrders: filtered, activeTab: status, currentPage: 1 });
        }
    };

    toggleOrderDetails = async (orderId) => {
        const { expandedOrders, dataOrderDetail } = this.state;

        if (expandedOrders.includes(orderId)) {
            this.setState({
                expandedOrders: expandedOrders.filter(id => id !== orderId)
            });
        } else {
            if (!dataOrderDetail[orderId]) {
                const token = localStorage.getItem('jwtToken');
                try {
                    const dataDetail = await api.get(`/user/api/order-details/orderDetail/${orderId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    this.setState((prevState) => ({
                        expandedOrders: [...prevState.expandedOrders, orderId],
                        dataOrderDetail: {
                            ...prevState.dataOrderDetail,
                            [orderId]: dataDetail.data
                        }
                    }));
                } catch (error) {
                    console.error('Error fetching order details:', error);
                }
            } else {
                this.setState((prevState) => ({
                    expandedOrders: [...prevState.expandedOrders, orderId]
                }));
            }
        }
    };


    handleAcceptOrder = async (id) => {
        const token = localStorage.getItem('jwtToken')
        api.post(`/user/api/order/verifyOrder/${id}`, null,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then((response) => {
            if (response.status === 200) {
                this.showToast(response.data, "success")
                this.componentDidMount()
            } else {
                this.showToast(response.data, "error")

            }
        })
    }

    handleAcceptCancelOrder = async () => {
        const { id_order, selectedReason } = this.state;

        const token = localStorage.getItem('jwtToken');

        // Bật trạng thái loader
        this.setState({ isLoading: true });

        try {
            // Thêm delay 2 giây
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Tạo payload chứa selectedReason
            const payload = {
                reason: selectedReason
            };

            await api.put(`/user/api/order/cancel/${id_order}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            toast('Hủy đơn thành công. Hãy kiểm tra Email của bạn để được hỗ trợ', {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });

            // Cập nhật trạng thái đơn hàng sau khi hủy
            this.setState((prevState) => ({
                dataCheck: prevState.dataCheck.map(order =>
                    order.id === id_order ? { ...order, state: { id: 6, name_status_order: 'Canceled' } } : order
                ),
                isLoading: false
            }));

            this.componentDidMount(); // Cập nhật lại danh sách đơn hàng
        } catch (error) {
            toast('Lỗi hủy đơn', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });

            // Tắt trạng thái loader nếu lỗi xảy ra
            this.setState({ isLoading: false });
        }
    };

    handleCancelOrder = async (id) => {
        this.setState({
            id_order: id
        })
    };

    // Chuyển trang
    paginate = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    handleReasonChange = (event) => {
        const selectedReason = event.target.value;
        this.setState({ selectedReason });
    };

    submitRating = async (detailId) => {
        const token = localStorage.getItem('jwtToken');
        const decoded = jwtDecode(token);
        const { rating, feedback, selectedImages } = this.state;

        if (rating === undefined) {
            alert("Hãy đánh giá sản phẩm");
            return;
        }

        // Bắt đầu hiển thị loader
        this.setState({ isLoading: true });

        try {
            const imageFiles = selectedImages[detailId] || [];
            const imageUrls = [];

            // Tải ảnh lên Firebase
            for (let file of imageFiles) {
                const storageRef = ref(storage, `feedback-images/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                imageUrls.push(url); // Lưu URL
            }

            console.log("Các URL hình ảnh:", imageUrls);

            const DataFeedbackDTO = {
                detailId,
                id_user: decoded.id_user,
                rating: rating[detailId],
                content_feedback: feedback[detailId] !== undefined ? feedback[detailId] : null,
                images: imageUrls, // Gửi URL của ảnh lên server nếu cần
            };

            // Gửi dữ liệu đánh giá
            await api.post('/user/api/feedback/create', DataFeedbackDTO, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    this.showToast("Cảm ơn bạn đánh giá", "success");
                    this.componentDidMount();
                } else {
                    this.showToast("Sai đánh giá", "eror");
                }
            });
        } catch (error) {
            this.showToast("Lỗi khi gửi đánh giá:", error);
            console.error("Lỗi khi gửi đánh giá:", error);
        } finally {
            // Dừng hiển thị loader
            this.setState({ isLoading: false });
        }
    };


    handleImageSelect = (detailId, event) => {
        const newFiles = Array.from(event.target.files); // Tệp mới
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file)); // URL xem trước mới

        if (!detailId) {
            console.error("detailId is undefined or null");
            return;
        }

        this.setState((prevState) => {
            const currentFiles = prevState.selectedImages[detailId] || []; // Tệp hiện tại
            const currentPreviews = prevState.imagePreviews[detailId] || []; // Xem trước hiện tại

            // Gộp tệp mới và hiện tại, giới hạn tối đa 3
            const combinedFiles = [...currentFiles, ...newFiles].slice(0, 3);
            const combinedPreviews = [...currentPreviews, ...newPreviews].slice(0, 3);

            return {
                selectedImages: {
                    ...prevState.selectedImages,
                    [detailId]: combinedFiles,
                },
                imagePreviews: {
                    ...prevState.imagePreviews,
                    [detailId]: combinedPreviews,
                },
            };
        });
    };

    handleRemoveImage = (detailId, index) => {
        this.setState((prevState) => {
            const previews = [...prevState.imagePreviews[detailId]];
            const files = [...prevState.selectedImages[detailId]];

            // Xóa ảnh khỏi danh sách
            previews.splice(index, 1);
            files.splice(index, 1);

            return {
                imagePreviews: {
                    ...prevState.imagePreviews,
                    [detailId]: previews,
                },
                selectedImages: {
                    ...prevState.selectedImages,
                    [detailId]: files,
                },
            };
        });
    };



    handleDragStart = (e, detailId, index) => {
        e.dataTransfer.setData("sourceIndex", index); // Lưu vị trí bắt đầu
        e.dataTransfer.setData("detailId", detailId); // Lưu detailId
    };

    handleDrop = (e, detailId, targetIndex) => {
        const sourceIndex = e.dataTransfer.getData("sourceIndex");
        const sourceDetailId = e.dataTransfer.getData("detailId");

        if (sourceDetailId !== detailId.toString()) {
            console.error("Drag and drop giữa các detailId khác nhau không được hỗ trợ.");
            return;
        }

        this.setState((prevState) => {
            const previews = [...prevState.imagePreviews[detailId]];
            const movedItem = previews.splice(sourceIndex, 1)[0]; // Xóa phần tử từ vị trí gốc
            previews.splice(targetIndex, 0, movedItem); // Thêm vào vị trí mới

            return {
                imagePreviews: {
                    ...prevState.imagePreviews,
                    [detailId]: previews,
                },
            };
        });
    };


    showToast(content, typeToast) {
        toast(`${content}`, {
            type: `${typeToast}`,
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            richColors: true
        })
    }

    handleOnchangeTextArea = (detailId, e) => {
        this.setState(prevState => ({
            feedback: {
                ...prevState.feedback,
                [detailId]: e.target.value,  // Update feedback for the specific detail ID
            }
        }));
    };


    render() {
        const { filteredOrders, currentPage, itemsPerPage, activeTab, expandedOrders, dataOrderDetail } = this.state;
        const reasons = [
            'Đặt nhầm sản phẩm',
            'Sản phẩm giao quá trễ',
            'Tìm thấy giá rẻ hơn',
            'Thay đổi ý định',
            'Lý do khác',
        ];

        // Tính toán chỉ số phần tử của trang hiện tại
        const indexOfLastOrder = currentPage * itemsPerPage;
        const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
        const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

        // Tổng số trang
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

        return (
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Tabs */}
                <div className="tabs mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                    {['Tất cả', 'Đang chờ xử lý', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao', 'Đã hoàn thành'].map((status) => (
                        <button
                            key={status}
                            className={`py-2 px-4 text-sm sm:text-base rounded-lg transition ${activeTab === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            onClick={() => this.handleTabChange(status === 'Tất cả' ? 'all' : status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Kiểm tra nếu không có dữ liệu */}
                {filteredOrders.length === 0 ? (
                    <div className="flex items-center justify-center h-48 sm:h-64">
                        <p className="text-base sm:text-lg font-semibold uppercase text-gray-500">KHÔNG CÓ ĐƠN HÀNG</p>
                    </div>
                ) : (
                    /* Nếu có dữ liệu, hiển thị danh sách đơn hàng */
                    <div className="order-list space-y-4 sm:space-y-6">
                        {currentOrders.map((item) => (
                            <div key={item.id} className="order-item bg-white p-4 sm:p-6 rounded-lg shadow-md mx-auto max-w-2xl lg:max-w-4xl">
                                <div className="order-info flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className='flex-1'>
                                        <div className="font-bold text-base sm:text-lg">
                                        Đơn hàng #{item.id}   
                                        </div>
                                        <div className="font-bold text-base sm:text-lg">
                                          {item.methodPayment.name_method === 'COD' ? 'Thanh toán khi giao hàng' : 'Thanh toán Online'} 
                                        </div>
                                        <div className="text-sm text-gray-600">Trạng thái:
                                            <span className='ml-1 text-red-600 text-base'>
                                                {item.state.name_status_order}
                                            </span>
                                        </div>

                                        {item.state.id === 6 &&
                                            <div className="text-sm text-gray-600">
                                                Lí do: {item.note}
                                            </div>
                                        }

                                        <div className="text-sm text-gray-600">Ngày đặt: {this.formatDate(item.created_date)}</div>
                                        <div className="text-sm text-gray-600">Phí vận chuyển: {item.delivery_fee.toLocaleString()} đ</div>
                                        <div className="text-sm font-semibold text-gray-900">Tổng tiền: {item.total_cash.toLocaleString()} đ</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.state.id === 5 && <button
                                            className="px-4 py-2 text-sm sm:text-base bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                            // onClick={() => this.toggleOrderDetails(item.id)}
                                            onClick={() => this.handleAcceptOrder(item.id)}
                                        >
                                            Xác nhận đơn hàng
                                        </button>}

                                        <button
                                            className="px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                            onClick={() => this.toggleOrderDetails(item.id)}
                                        >
                                            {expandedOrders.includes(item.id) ? 'Ẩn' : 'Chi tiết'}
                                        </button>
                                        {item.state.id === 1 && (
                                            <button type="button"
                                                onClick={() => this.handleCancelOrder(item.id)}
                                                class="px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                data-twe-toggle="modal"
                                                data-twe-target="#exampleModal5"
                                                data-twe-ripple-init
                                                data-twe-ripple-color="light">
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* CHi tiết đơn hàng */}
                                {
                                    expandedOrders.includes(item.id) && dataOrderDetail[item.id] ? (
                                        dataOrderDetail[item.id].map((detail, idx) => {
                                            const feedback = this.state.feedbackData[detail.id];
                                            console.log(feedback)
                                            return (
                                                <div key={idx}>
                                                    {/* Order details */}
                                                    <div className="text-sm mt-2 flex items-center space-x-10">
                                                        <img
                                                            src={detail.variantProd.image_variant}
                                                            alt=""
                                                            className="w-28 h-28 object-cover rounded-lg border"
                                                        />
                                                        <div className="flex flex-col space-y-2">
                                                            <span className="font-bold text-lg">
                                                                Tên mặt hàng: {detail.variantProd.product.name_prod} - kích thước: {detail.name_size}
                                                            </span>
                                                            <p>Màu:
                                                                <div className="w-7 h-7 rounded-full" style={{ backgroundColor: detail.name_color }}></div>
                                                            </p>
                                                            <p className="font-semibold text-gray-700">
                                                                Số lượng: {detail.quantity} - Đơn giá: {detail.price.toLocaleString()} đ
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {item.state.id === 9
                                                        ?
                                                        feedback ?
                                                            (
                                                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                                                    <p>Đánh giá của bạn:</p>
                                                                    <Rating
                                                                        name={`rating-${detail.id}`}
                                                                        value={feedback.number_star || 0}  // Get rating for this specific detail.id
                                                                        readOnly
                                                                    />

                                                                    <p> {feedback.content}</p>

                                                                    {/* Hiển thị ảnh đánh giá */}
                                                                    {feedback.images && feedback.images.length > 0 && (
                                                                        <div className="mt-4 flex flex-wrap gap-4">
                                                                            {feedback.images.map((image, index) => (
                                                                                <img
                                                                                    key={index}
                                                                                    src={image}
                                                                                    alt={`feedback-${index}`}
                                                                                    className="w-28 h-28 object-cover rounded-lg border"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                /* Nếu chưa có đánh giá thì hiển thị form đánh giá */
                                                                <>
                                                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                                                        <p>Bạn có hài lòng với sản phẩm này không?</p>
                                                                        <div className="my-2">
                                                                            <Rating
                                                                                name={`rating-${detail.id}`}
                                                                                value={this.state.rating[detail.id] || 0}
                                                                                onChange={(event, newValue) => this.setState(prevState => ({
                                                                                    rating: {
                                                                                        ...prevState.rating,
                                                                                        [detail.id]: newValue,
                                                                                    }
                                                                                }))}
                                                                            />
                                                                        </div>
                                                                        <textarea
                                                                            onChange={(e) => this.handleOnchangeTextArea(detail.id, e)}
                                                                            value={this.state.feedback[detail.id] || ''}
                                                                            placeholder="Hãy cho tôi biết đánh giá của bạn"
                                                                            className="resize-none p-3 h-32 rounded-md w-full"
                                                                        />

                                                                        {/* Thêm phần chọn ảnh */}
                                                                        <div
                                                                            key={detail.id}
                                                                            className="mt-6 p-4 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500"
                                                                            onDragOver={(e) => e.preventDefault()} // Cho phép drop
                                                                            onDrop={(e) => {
                                                                                e.preventDefault();
                                                                                const files = Array.from(e.dataTransfer.files);
                                                                                this.handleImageSelect(detail.id, { target: { files } });
                                                                            }}
                                                                        >
                                                                            <label className="block text-sm font-medium text-gray-800 mb-4 text-center">
                                                                                Kéo thả hoặc nhấp để chọn hình ảnh (tối đa 3):
                                                                            </label>

                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                multiple
                                                                                onChange={(e) => this.handleImageSelect(detail.id, e)}
                                                                                className="hidden"
                                                                                ref={(input) => (this.fileInputs[detail.id] = input)} // Lưu ref theo detailId
                                                                            />

                                                                            <button
                                                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
                                                                                onClick={() => this.fileInputs[detail.id]?.click()} // Dùng ref tương ứng với detailId
                                                                            >
                                                                                Chọn tệp
                                                                            </button>

                                                                            <p className="mt-2 text-sm text-gray-600">
                                                                                Tệp được chọn: <span className="font-semibold">{this.state.selectedImages[detail.id]?.length || 0}</span>/3
                                                                            </p>
                                                                            <div className="flex flex-wrap gap-4 mt-4">
                                                                                {Array.isArray(this.state.imagePreviews[detail.id]) &&
                                                                                    this.state.imagePreviews[detail.id].map((preview, index) => (
                                                                                        <div
                                                                                            key={index}
                                                                                            className="relative w-20 h-20 overflow-hidden rounded-lg border border-gray-200 cursor-move"
                                                                                            draggable
                                                                                            onDragStart={(e) => this.handleDragStart(e, detail.id, index)}
                                                                                            onDragOver={(e) => e.preventDefault()}
                                                                                            onDrop={(e) => this.handleDrop(e, detail.id, index)}
                                                                                        >
                                                                                            {/* Dấu "X" để xóa ảnh */}
                                                                                            <button
                                                                                                onClick={() => this.handleRemoveImage(detail.id, index)}
                                                                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 focus:ring-2 focus:ring-red-300"
                                                                                            >
                                                                                                &times;
                                                                                            </button>
                                                                                            <img
                                                                                                src={preview}
                                                                                                alt={`preview-${index}`}
                                                                                                className="object-cover w-full h-full"
                                                                                            />
                                                                                        </div>
                                                                                    ))}
                                                                            </div>
                                                                        </div>

                                                                        <button
                                                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                                                                            onClick={() => !this.state.isLoading && this.submitRating(detail.id)}
                                                                            disabled={this.state.isLoading}
                                                                        >
                                                                            {this.state.isLoading ? (
                                                                                <>
                                                                                    <ReactLoading type="spin" color="#fff" height={20} width={20} />
                                                                                    <span>Đang tải...</span>
                                                                                </>
                                                                            ) : (
                                                                                "Gửi đánh giá"
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )
                                                        : ""}
                                                    {/* Nếu đã có đánh giá thì hiển thị số sao và ghi chú */}
                                                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                                    {idx === dataOrderDetail[item.id].length - 1 && (
                                                        <p className="text-base font-semibold text-gray-900">
                                                            <span className='uppercase p-3 '>Địa chỉ giao hàng: </span>
                                                            <span className='text-red-400 uppercase'>{detail.full_address}</span>
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-sm mt-2"></div>
                                    )
                                }


                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination flex justify-center mt-4">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => this.paginate(index + 1)}
                                        className={`py-2 px-4 mx-1 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
                }
                {/* <!-- Modal --> */}
                <div
                    data-twe-modal-init
                    className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                    id="exampleModal5"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div
                        data-twe-modal-dialog-ref
                        className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                    >
                        <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                                <h5 className="text-xl font-medium leading-normal text-surface dark:text-white" id="exampleModalLabel">
                                    Hủy đơn
                                </h5>
                                <button
                                    type="button"
                                    className="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    data-twe-modal-dismiss
                                    aria-label="Close"
                                >
                                    <span className="[&>svg]:h-6 [&>svg]:w-6">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>

                            {/* Modal body */}
                            <div className="relative flex-auto p-4" data-twe-modal-body-ref>
                                <p>Lý do hủy đơn</p>
                                {reasons.map((reason, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`reason-${index}`}
                                            name="cancelReason"
                                            value={reason}
                                            onChange={this.handleReasonChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`reason-${index}`} className="cursor-pointer">
                                            {reason}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Modal footer */}
                            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                                <button
                                    type="button"
                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-modal-dismiss
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light"
                                >
                                    Đóng
                                </button>

                                <button
                                    onClick={() => this.handleAcceptCancelOrder()}
                                    type="button"
                                    className="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    disabled={this.state.isLoading} // Vô hiệu hóa nút khi đang loading
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
                                        "Xác nhận hủy đơn"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ListCheckOutUser);

