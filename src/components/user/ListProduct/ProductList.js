import React, { useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../../LoadingSpinner';
import { Collapse, Dropdown, Ripple, Carousel, Input, initTWE } from "tw-elements";
import axios from 'axios';
const ProductList = ({ onProductClick }) => {
    const [products, setProducts] = useState([]);
    const [priceRanges, setPriceRanges] = useState({});
    const [visibleProductsCount, setVisibleProductsCount] = useState(12);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/api/products1');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        products.forEach(product => {
            axios.get(`http://localhost:8080/user/api/variants/price-range/${product.id}`)
                .then(response => {
                    setPriceRanges(prevState => ({
                        ...prevState,
                        [product.id]: response.data
                    }));
                })
                .catch(error => {
                    console.error('Error fetching price range:', error);
                });
        });
    }, [products]);

    const handleShowMore = () => {
        setTimeout(() => {
            setVisibleProductsCount(prevCount => prevCount + 8);
            setLoadingMore(false);
        }, 100);
    };

    return (
        <div className="mt-3">
            <h2 className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mx-auto max-w-7xl px-2 py-4 sm:px-2 sm:py-4 text-xl font-bold text-start mb-4">Sản phẩm mới</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mx-auto max-w-7xl px-2 py-4 sm:px-2 sm:py-4">
                {products.slice(0, visibleProductsCount).map((item, index) => (
                    <div className="relative group" key={index}>
                        <LazyLoad height={200} offset={100} once>
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-sm bg-gray-200 group-hover:opacity-75">
                                <img
                                    onClick={() => onProductClick(item)}
                                    src={item.image_prod}
                                    alt={item.name_prod}
                                    className="object-cover object-center w-full h-full cursor-pointer transition-all duration-500"
                                    style={{ opacity: 0 }}
                                    onLoad={(e) => e.target.style.opacity = 1} // Hiệu ứng fade-in
                                />
                            </div>
                        </LazyLoad>
                        <div className="mt-4 text-left">
                            <h3 className="text-left text-sm text-gray-700">
                                <button
                                    onClick={() => onProductClick(item)}
                                    className="hover:text-red-600 transition-colors duration-200"
                                >
                                    {item.name_prod}
                                </button>
                            </h3>
                            <p className="text-sm text-red-600 font-bold">
                                {priceRanges[item.id]
                                    ? (priceRanges[item.id].minPrice === priceRanges[item.id].maxPrice
                                        ? `${priceRanges[item.id].minPrice.toLocaleString()} đ`
                                        : `${priceRanges[item.id].minPrice.toLocaleString()} đ - ${priceRanges[item.id].maxPrice.toLocaleString()} đ`
                                    )
                                    : 'Đang tải...'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {visibleProductsCount < products.length && (
                <div className="flex justify-center items-center mt-6 mb-4">
                    {loadingMore ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            onClick={handleShowMore}
                            className="text-red-600 border border-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all"
                        >
                            <Link to="/search">Xem tất cả</Link>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;

// npm install react-lazyload --legacy-peer-deps

