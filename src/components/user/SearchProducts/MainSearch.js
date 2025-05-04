import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import FilterBar from './FilterBar';
import LoadingSpinner from '../../../LoadingSpinner';
import { useHistory } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import LazyLoad from 'react-lazyload';
const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleProductsCount, setVisibleProductsCount] = useState(8);
    const [loading, setLoading] = useState(true);

    const [selectedColors, setSelectedColors] = useState({});
    const [selectedSizes, setSelectedSizes] = useState({});
    const [availableColors, setAvailableColors] = useState({});
    const [availableSizes, setAvailableSizes] = useState({});
    const [imageVariants, setImageVariants] = useState({});
    const [priceVariants, setPriceVariants] = useState({});
    const [priceRanges, setPriceRanges] = useState({});
    const [availableProducts, setAvailableProducts] = useState({});
    const history = useHistory();
    const [discounts, setDiscounts] = useState({});
    const modalRef = useRef(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/user/api/products1');
                let productsData = response.data;

                productsData.forEach(product => {
                    setImageVariants(prev => ({
                        ...prev,
                        [product.id]: product.image_prod
                    }));

                    // Gọi API để lấy khoảng giá
                    axios.get(`http://localhost:8080/user/api/variants/price-range/${product.id}`)
                        .then(res => {
                            setPriceRanges(prev => ({
                                ...prev,
                                [product.id]: res.data
                            }));
                        })
                        .catch(error => {
                            console.error('Error fetching price range:', error);
                        });
                });

                setProducts(productsData);
                setFilteredProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/api/flash-sales/with-discounts');
                const discountData = response.data.reduce((acc, flashSale) => {
                    flashSale.variants.forEach(variant => {
                        acc[variant.variantId] = variant.discountPercent;
                    });
                    return acc;
                }, {});
                setDiscounts(discountData);
            } catch (error) {
                console.error('Error fetching flash sale discounts:', error);
            }
        };

        fetchDiscounts();
    }, []);

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const promises = products.map(async (product) => {
                    const response = await axios.get(`http://localhost:8080/user/api/variants/${product.id}`);
                    const variants = response.data;
                    product.variants = variants;

                    const colors = [...new Map(variants.map(item => [item.color.id, item.color])).values()];
                    const sizes = [...new Map(variants.map(item => [item.size.id, item.size])).values()];

                    setAvailableColors(prev => ({
                        ...prev,
                        [product.id]: colors
                    }));
                    setAvailableSizes(prev => ({
                        ...prev,
                        [product.id]: sizes
                    }));
                });

                await Promise.all(promises);
            } catch (error) {
                console.error('Error fetching variants:', error);
            }
        };

        if (products.length > 0) {
            fetchVariants();
        }
    }, [products]);

    const updateProductDetails = (productId, variant) => {
        const discountPercent = discounts[variant.id] || 0; // Lấy % giảm giá nếu có, nếu không thì là 0
        const originalPrice = variant.price;
        const discountedPrice = originalPrice * (1 - discountPercent / 100); // Tính giá sau khi giảm

        setPriceVariants(prev => ({
            ...prev,
            [productId]: { originalPrice, discountedPrice, discountPercent }
        }));
        setImageVariants(prev => ({
            ...prev,
            [productId]: variant.image_variant
        }));
        setAvailableProducts(prev => ({
            ...prev,
            [productId]: variant.quantity
        }));
    };

    // Xử lý thay đổi màu sắc
    const handleColorChange = (productId, colorId) => {
        const isSelected = selectedColors[productId] === colorId;
        const newColorId = isSelected ? null : colorId; // Nếu chọn lại màu đang chọn, bỏ chọn

        setSelectedColors(prev => ({
            ...prev,
            [productId]: newColorId
        }));

        // Nếu không chọn màu, quay về trạng thái mặc định
        if (!newColorId) {
            resetToDefault(productId);
            return;
        }

        // Tìm các biến thể phù hợp theo màu đã chọn
        const product = products.find(p => p.id === productId);
        const selectedVariants = product?.variants || [];

        // Lọc các kích thước khả dụng theo màu đã chọn
        const sizes = selectedVariants.filter(item => item.color.id === newColorId).map(item => item.size);
        const defaultSizeId = sizes[0]?.id || null;

        // Cập nhật danh sách kích thước và kích thước mặc định
        setAvailableSizes(prev => ({
            ...prev,
            [productId]: sizes
        }));
        setSelectedSizes(prev => ({
            ...prev,
            [productId]: defaultSizeId
        }));

        // Cập nhật giá, ảnh và số lượng dựa trên màu mới và kích thước mặc định
        const matchingVariant = selectedVariants.find(
            item => item.color.id === newColorId && item.size.id === defaultSizeId
        );

        if (matchingVariant) {
            updateProductDetails(productId, matchingVariant);
        }
    };

    // Xử lý thay đổi kích thước
    const handleSizeChange = (productId, sizeId) => {
        const isSelected = selectedSizes[productId] === sizeId;
        const newSizeId = isSelected ? null : sizeId; // Nếu chọn lại kích thước đang chọn, bỏ chọn

        setSelectedSizes(prev => ({
            ...prev,
            [productId]: newSizeId
        }));

        // Nếu không chọn kích thước, quay về trạng thái mặc định
        if (!newSizeId) {
            resetToDefault(productId);
            return;
        }

        const product = products.find(p => p.id === productId);
        const selectedVariants = product?.variants || [];

        // Tìm biến thể phù hợp theo kích thước và màu hiện tại
        const matchingVariant = selectedVariants.find(
            item => item.color.id === selectedColors[productId] && item.size.id === newSizeId
        );

        if (matchingVariant) {
            updateProductDetails(productId, matchingVariant);
        }
    };

    // Hàm đặt lại trạng thái mặc định
    const resetToDefault = (productId) => {
        const product = products.find(p => p.id === productId);

        setSelectedColors(prev => ({
            ...prev,
            [productId]: null
        }));
        setSelectedSizes(prev => ({
            ...prev,
            [productId]: null
        }));
        setImageVariants(prev => ({
            ...prev,
            [productId]: product?.image_prod || ''
        }));
        setPriceVariants(prev => ({
            ...prev,
            [productId]: null
        }));
        setAvailableProducts(prev => ({
            ...prev,
            [productId]: null
        }));
    };


    // Áp dụng bộ lọc
    const applyFilters = (filters) => {
        let filtered = [...products];

        // Lọc theo danh mục
        if (filters.category && filters.category !== 'Tất cả') {
            filtered = filtered.filter(product => product.category?.name_cate === filters.category);
        }

        // Lọc theo từ khóa tìm kiếm
        if (filters.search && filters.search.trim() !== '') {
            const keyword = filters.search.trim().toLowerCase();
            filtered = filtered.filter(product =>
                product.name_prod.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo màu sắc
        if (filters.colors && filters.colors.length > 0) {
            filtered = filtered.filter(product =>
                availableColors[product.id]?.some(color => filters.colors.includes(color.color_name))
            );
        }

        // Lọc theo kích thước
        if (filters.sizes && filters.sizes.length > 0) {
            filtered = filtered.filter(product =>
                availableSizes[product.id]?.some(size => filters.sizes.includes(size.name_size))
            );
        }

        // Lọc theo khoảng giá
        if (filters.priceRange) {
            filtered = filtered.filter(product => {
                const range = priceRanges[product.id];
                return range?.minPrice >= filters.priceRange[0] && range?.maxPrice <= filters.priceRange[1];
            });
        }

        // Sắp xếp sản phẩm theo giá
        if (filters.sort) {
            if (filters.sort === 'Giá tăng dần') {
                filtered.sort((a, b) => (priceRanges[a.id]?.minPrice || 0) - (priceRanges[b.id]?.minPrice || 0));
            } else if (filters.sort === 'Giá giảm dần') {
                filtered.sort((a, b) => (priceRanges[b.id]?.maxPrice || 0) - (priceRanges[a.id]?.maxPrice || 0));
            }
        }

        setFilteredProducts(filtered);
    };


    const handleLoadMore = () => {
        setVisibleProductsCount(prevCount => {
            const newCount = prevCount + 8;
            // Kiểm tra xem không vượt quá số lượng sản phẩm đã lọc
            return newCount <= filteredProducts.length ? newCount : filteredProducts.length;
        });
    };
    const handleViewDetail = (item) => {
        history.push(`/product/${item.id}`);
    };

    const handleAddToCart = async (productId) => {
        const selectedColorId = selectedColors[productId];
        const selectedSizeId = selectedSizes[productId];
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
            history.push('/login');
            return;
        }

        if (!selectedColorId || !selectedSizeId) {
            toast.error('Vui lòng chọn màu sắc và kích thước trước khi thêm vào giỏ hàng.');
            return;
        }

        const product = products.find((p) => p.id === productId);
        const variant = product?.variants.find(
            (v) => v.color.id === selectedColorId && v.size.id === selectedSizeId
        );

        if (!variant) {
            toast.error('Không tìm thấy biến thể phù hợp.');
            return;
        }

        const getUserIdFromToken = () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('Token không tồn tại.');
                return null;
            }

            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.id_user;
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                return null;
            }
        };

        const cartData = {

            id_user: getUserIdFromToken(),
            id_variant: variant.id,
            quantity: 1,
        };

        try {
            const response = await axios.post('http://localhost:8080/user/api/cartdetail/post', cartData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.status === 200) {
                toast.success('Sản phẩm đã được thêm vào giỏ hàng.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng.');
        }
    };
    const [showAllColors, setShowAllColors] = useState({});
    const [showAllSizes, setShowAllSizes] = useState({});
    const toggleShowAllColors = (productId) => {
        setShowAllColors((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };
    const toggleShowAllSizes = (productId) => {
        setShowAllSizes((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowAllColors(false); // Đóng modal
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowAllColors]);
    useEffect(() => {
        const handleClickOutside2 = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowAllSizes(false); // Đóng modal
            }
        };

        document.addEventListener('mousedown', handleClickOutside2);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside2);
        };
    }, [setShowAllSizes]);

    return (

        <div className="search-page mx-auto mb-10 ">
            <div className="banner-section mx-auto max-w ">
                <img
                    src="https://media.canifa.com/Simiconnector/aokhoac_homepage_desktop-18.11.webp"
                    alt="Áo Phông Đa Sắc Màu"
                />
            </div>
            <FilterBar onFilterChange={applyFilters} />

            {loading ? (
                <div className="text-center mt-6">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mx-auto max-w-7xl  px-2 py-4 sm:px-2 sm:py-4">
                        {filteredProducts.slice(0, visibleProductsCount).map((item, index) => (
                            <div
                                key={index}
                                className="relative group   overflow-hidden gap-x-6 gap-y-8  transition-transform transform "
                            >
                                {/*  ảnh sản phẩm */}
                                <LazyLoad height={390} offset={100} once>
                                    <div className="relative cursor-pointer group">
                                        <div
                                            onClick={() => handleViewDetail(item)}
                                            className="absolute inset-0 z-10"
                                        ></div>

                                        <img
                                            src={imageVariants[item.id] || item.image_prod}
                                            alt={item.name_prod}
                                            className="object-cover object-center w-full h-full hover:scale-105"
                                        />

                                        <div className="absolute inset-0 flex items-end justify-center bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Ngăn chặn sự kiện lan tới cha
                                                    handleAddToCart(item.id);
                                                }}
                                                className="bg-slate-100 rounded-md z-20 text-black text-sm w-64 px-4 py-2 mb-4 shadow hover:bg-gray-200 bg-opacity-70 transition"
                                            >
                                                Thêm nhanh vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                </LazyLoad>


                                {/* Chọn màu sắc */}
                                <div className="flex justify-start mt-3 mb-2 space-x-2 px-2 relative">
                                    {availableColors[item.id]?.slice(0, 3).map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleColorChange(item.id, color.id)}
                                            className={`w-4 h-4 rounded-full transition-all duration-300 ${selectedColors[item.id] === color.id
                                                ? 'ring-2 ring-offset-2 ring-blue-400 scale-110'
                                                : 'border border-gray-200 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color.color_name }}
                                        />
                                    ))}
                                    {/* Nút "+" cho màu sắc */}
                                    {availableColors[item.id]?.length > 3 && (
                                        <button
                                            onClick={() => toggleShowAllColors(item.id)}
                                            className="w-4 h-4 flex items-center justify-center     hover:text-red-700 text-sm font-medium text-gray-700"
                                        >
                                            +{availableColors[item.id]?.length - 3}
                                        </button>
                                    )}

                                    {/* Modal hiện tất cả màu sắc */}
                                    {showAllColors[item.id] && (
                                        <div ref={modalRef} className="absolute top-4 left-0 bg-slate-100 rounded-lg shadow-lg p-4 z-50">
                                            <div className="flex flex-wrap gap-2">
                                                {availableColors[item.id]?.map((color, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleColorChange(item.id, color.id)}
                                                        className={`w-4 h-4 rounded-full transition-all duration-300 ${selectedColors[item.id] === color.id
                                                            ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                                                            : 'border bg-gray-200 hover:scale-105'
                                                            }`}
                                                        style={{ backgroundColor: color.color_name }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Kích thước */}
                                <div className="flex justify-start mt-3 space-x-2 px-2 relative">
                                    {availableSizes[item.id]?.slice(0, 3).map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSizeChange(item.id, size.id)}
                                            className={`text-xs px-2 py-1 rounded transition-all ${selectedSizes[item.id] === size.id
                                                ? 'bg-blue-500 text-white scale-105'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                        >
                                            {size.name_size}
                                        </button>
                                    ))}
                                    {/* Nút "+" cho kích thước */}
                                    {availableSizes[item.id]?.length > 3 && (
                                        <button
                                            onClick={() => toggleShowAllSizes(item.id)}
                                            className="text-sm rounded  bg-white hover:text-red-600 text-gray-700"
                                        >
                                            +{availableSizes[item.id]?.length - 3}
                                        </button>
                                    )}

                                    {/* Modal hiện tất cả kích thước */}
                                    {showAllSizes[item.id] && (
                                        <div ref={modalRef} className="absolute h-auto justify-items-center items-center top-7 left-0 bg-white border rounded-lg shadow-lg p-4 z-50">
                                            <div className="flex flex-wrap gap-2">
                                                {availableSizes[item.id]?.map((size, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSizeChange(item.id, size.id)}
                                                        className={`text-xs px-2 py-1 rounded transition-all ${selectedSizes[item.id] === size.id
                                                            ? 'bg-blue-500 text-white scale-105'
                                                            : 'bg-gray-200 hover:bg-gray-300'
                                                            }`}
                                                    >
                                                        {size.name_size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 px-2">
                                    <h3 className="text-black text-sm sm:text-xs w-full">
                                        <button onClick={() => handleViewDetail(item)} className="truncate">
                                            {item.name_prod}
                                        </button>
                                    </h3>

                                    <p className="text-xs">
                                        {priceVariants[item.id]?.discountPercent ? (
                                            <>
                                                <span className="text-red-600 text-sm font-bold">
                                                    {priceVariants[item.id]?.discountedPrice.toLocaleString()} đ
                                                </span>
                                                <span className="text-gray-500 line-through ml-2 text-sm font-bold">
                                                    {priceVariants[item.id]?.originalPrice.toLocaleString()} đ
                                                </span>
                                                <span className="text-red-600 ml-2 text-sm font-bold">
                                                    -{priceVariants[item.id]?.discountPercent}%
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                {priceRanges[item.id]?.minPrice === priceRanges[item.id]?.maxPrice ? (
                                                    <span className="text-red-600 text-sm font-bold">
                                                        {priceRanges[item.id]?.minPrice?.toLocaleString()} đ
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 text-sm font-bold">
                                                        {priceRanges[item.id]?.minPrice?.toLocaleString()} đ - {priceRanges[item.id]?.maxPrice?.toLocaleString()} đ
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>


                            </div>
                        ))}
                    </div>



                    {visibleProductsCount < filteredProducts.length && (
                        <div className="flex justify-center mt-10 mb-2">
                            <button
                                className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all"
                                onClick={handleLoadMore}
                            >
                                Xem thêm
                            </button>
                        </div>
                    )}
                </>
            )}
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Hiển thị {visibleProductsCount} trên tổng số {filteredProducts.length} sản phẩm
                </p>
            </div>

        </div>

    );
};

export default SearchPage;
