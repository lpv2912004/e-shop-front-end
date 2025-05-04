import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterName, setFilterName] = useState('');
    const [sortStock, setSortStock] = useState(null);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = () => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const productData = response.data;
                const sortedProducts = productData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                const productPromises = sortedProducts.map(product =>
                    axios.get(`http://localhost:8080/admin/api/variant_products/count-by-product/${product.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(variantResponse => {
                            const variantCount = variantResponse.data;
                            return {
                                ...product,
                                variantCount: variantCount
                            };
                        })
                );
                Promise.all(productPromises)
                    .then(results => {
                        setProducts(results);
                    })
                    .catch(error => console.error('Error fetching product and variant details:', error));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    // Cập nhật bộ lọc để lọc theo mã hoặc tên sản phẩm
    let filteredProducts = products.filter(product => {
        const filter = filterName.toLowerCase();
        return filter
            ? product.name_prod.toLowerCase().includes(filter) || product.id.toString().includes(filter)
            : true;
    });

    if (sortStock === 'asc') {
        filteredProducts = filteredProducts.sort((a, b) => a.sum_quantity - b.sum_quantity);
    } else if (sortStock === 'desc') {
        filteredProducts = filteredProducts.sort((a, b) => b.sum_quantity - a.sum_quantity);
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    const handleNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Hàm rút gọn tên sản phẩm nếu quá dài
    const truncateProductName = (name) => {
        const maxLength = 50;
        return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };

    // Hàm hiển thị phân trang với các trang gần nhất
    const renderPagination = () => {
        const pages = [];
        const pageRange = 2; // Số trang hiển thị trước và sau trang hiện tại

        // Hiển thị trang đầu tiên
        pages.push(
            <button key={1} onClick={() => handlePageChange(1)} className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}>
                1
            </button>
        );

        if (currentPage > pageRange + 2) {
            pages.push(<span key="dots-prev" className="pagination-dots">...</span>);
        }

        // Hiển thị các trang gần trang hiện tại
        for (let i = Math.max(2, currentPage - pageRange); i <= Math.min(totalPages - 1, currentPage + pageRange); i++) {
            pages.push(
                <button key={i} onClick={() => handlePageChange(i)} className={`pagination-button ${currentPage === i ? 'active' : ''}`}>
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - pageRange - 1) {
            pages.push(<span key="dots-next" className="pagination-dots">...</span>);
        }

        // Hiển thị trang cuối cùng
        if (totalPages > 1) {
            pages.push(
                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}>
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-blue-600">Danh sách sản phẩm</h2>
                <div className="flex space-x-2">
                    <Link to="/admin/create-product" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
                    <AiOutlinePlus className="w-5 h-5 mr-2" />
                    Tạo sản phẩm</Link>
                </div>
            </div>

            {/* Bộ lọc */}
            <div className="mb-4 flex space-x-4">
                <div className="w-1/3">
                    <label className="text-sm font-bold flex items-center text-blue-500">Lọc theo mã hoặc tên sản phẩm:</label>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                        placeholder="Mã hoặc Tên sản phẩm..."
                    />
                </div>
                <div className="w-1/3">
                    <label className="text-sm font-bold flex items-center text-blue-500">Sắp xếp theo Tồn kho:</label>
                    <select
                        value={sortStock || ''}
                        onChange={(e) => setSortStock(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                    >
                        <option value="">Mặc định</option>
                        <option value="asc">Tồn kho Tăng dần</option>
                        <option value="desc">Tồn kho Giảm dần</option>
                    </select>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full bg-white border">
                    <thead className="table-header">
                        <tr className="text-left">
                            <th className="px-4 py-3 border-b text-center w-1/12">#STT</th>
                            <th className="px-4 py-3 border-b text-center w-1/12">Mã sản phẩm</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Hình ảnh</th>
                            <th className="px-4 py-3 border-b text-left w-1/3">Tên sản phẩm</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Tồn kho</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Loại</th>
                            <th className="px-4 py-3 border-b text-center w-1/6">Thương hiệu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={product.id} className={`text-center ${index % 2 === 0 ? '' : 'bg-gray-200'}`}>
                                <td className="px-4 py-4 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="px-4 py-4 border-b">
                                <Link
                                        to={`/admin/update-product/${product.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                     {product.id}
                                    </Link>
                                    </td>
                                <td className="px-4 py-4 border-b relative">
                                    <Link
                                        to={`/admin/update-product/${product.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        <img
                                            src={product.image_prod}
                                            alt={product.name_prod}
                                            className="w-16 h-16 object-cover rounded mx-auto transition-shadow duration-200 hover:shadow-light-3"
                                        />
                                    </Link>
                                </td>

                                <td className="px-4 py-4 border-b text-left">
                                    <Link
                                        to={`/admin/update-product/${product.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline"
                                    >
                                        {truncateProductName(product.name_prod)}
                                    </Link>
                                </td>

                                <td className="px-4 py-4 border-b">
                                    {product.sum_quantity} trong {product.variantCount} biến thể
                                </td>
                                <td className="px-4 py-4 border-b">
                                    {product.category?.name_cate || 'Khác'}
                                </td>
                                <td className="px-4 py-4 border-b">
                                    {product.brand?.name_brand || 'Khác'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    Hiển thị {currentProducts.length} trong tổng số {filteredProducts.length} sản phẩm
                </div>

                <div className="pagination-container">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                        &lt;
                    </button>
                    {renderPagination()}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
