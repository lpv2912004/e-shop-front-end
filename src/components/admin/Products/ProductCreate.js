import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SearchableDropdown from "./SearchableDropdown";
import SearchableBrandDropdown from "./BrandSearch";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';
// Cấu hình Firebase
// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const CreateProductWithVariants = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const history = useHistory();
    const [product, setProduct] = useState({
        name_prod: '',
        description: '',
        brandId: '',
        categoryId: '',
        image_prod: ''
    });
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showVariants, setShowVariants] = useState(true);

    const [variants, setVariants] = useState(() => JSON.parse(localStorage.getItem('variants')) || [{
        color: '',
        size: '',
        price: '',
        quantity: '',
        image_variant: '',
        previewUrl_variant: ''
    }]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Token không tồn tại!');
            return;
        }


        const fetchData = async () => {
            try {
                const [brandsResponse, categoriesResponse, colorsResponse, sizesResponse] = await Promise.all([
                    axios.get('http://localhost:8080/admin/api/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/admin/api/sizes', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                setBrands(brandsResponse.data);
                setCategories(categoriesResponse.data);
                setColors(colorsResponse.data);
                setSizes(sizesResponse.data);
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu!');
            }
        };

        fetchData();
    }, []);

    // Quản lý sự thay đổi trong biến thể
    const handleChange = (e) => {
        const { name, value } = e.target;

        setProduct({
            ...product,
            [name]: name === 'name_prod' ? value.toUpperCase() : value, // Chuyển thành chữ in hoa nếu là name_prod
        });

        // Kiểm tra nếu name là categoryId thì in ra giá trị
        if (name === 'brandId') {
            console.log('Selected categoryId:', value);
        }
    };



    // Thay đổi giá trị của từng biến thể
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index][name] = value;
        setVariants(newVariants);
        localStorage.setItem('variants', JSON.stringify(newVariants));
    };

    // Upload ảnh biến thể
    const handleVariantImageChange = async (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newVariants = [...variants];
            newVariants[index].previewUrl_variant = URL.createObjectURL(file); // Tạo URL để xem trước ảnh

            // Upload ảnh lên Firebase Storage và lấy URL
            try {
                const imageUrl = await uploadImage(file, `variant-images/${file.name}`);
                newVariants[index].image_variant = imageUrl; // Lưu URL của ảnh sau khi upload
                setVariants(newVariants); // Cập nhật biến thể với URL ảnh
                localStorage.setItem('variants', JSON.stringify(newVariants)); // Lưu lại vào localStorage
            } catch (error) {
                toast.error('Lỗi khi tải hình ảnh biến thể!');
            }
        }
    };

    // Upload ảnh sản phẩm
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));

            // Upload ngay lập tức và lưu trữ URL
            try {
                const imageUrl = await uploadImage(file, `images/${file.name}`);
                setProduct({ ...product, image_prod: imageUrl });
            } catch (error) {
                toast.error('Lỗi khi tải hình ảnh sản phẩm!');
            }
        }
    };

    // Hàm tối ưu hóa việc upload ảnh
    const uploadImage = async (file, path) => {
        setIsUploading(true);
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);
            return downloadURL;
        } catch (error) {
            setIsUploading(false);
            toast.error('Lỗi khi tải hình ảnh!');
            throw error;
        }
    };


    // Thêm biến thể mới
    const handleAddVariant = () => {
        setVariants([...variants, { color: '', size: '', price: '', quantity: '', image_variant: '', previewUrl_variant: '' }]);
    };

    // Xóa biến thể
    const handleRemoveVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
        localStorage.setItem('variants', JSON.stringify(newVariants));
    };

    // Xử lý lưu sản phẩm và các biến thể
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Khóa nút để ngăn người dùng nhấn nhiều lần
        setIsButtonDisabled(true);

        // Đặt hẹn giờ để mở lại nút sau 5 giây
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 5000);

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast.error('Bạn chưa đăng nhập!');
            return;
        }
        if (!product.name_prod) {
            toast.error('Vui lòng điền tên sản phẩm.');
            return;
        }

        // Kiểm tra ký tự đặc biệt
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharRegex.test(product.name_prod)) {
            toast.error('Tên sản phẩm không được chứa ký tự đặc biệt.');
            return;
        }

        if (product.name_prod.length < 3 || product.name_prod.length > 50) {
            toast.error('Tên sản phẩm phải có độ dài từ 3 đến 50 ký tự.');
            return;
        }

        if (!product.categoryId) {
            toast.error('Vui lòng chọn loại sản phẩm.');
            return;
        }

        if (!product.brandId) {
            toast.error('Vui lòng chọn thương hiệu.');
            return;
        }

        if (!product.image_prod) {
            toast.error('Vui lòng chọn ảnh sản phẩm.');
            return;
        }

        if (showVariants) {
            const variantSet = new Set(); // Dùng để kiểm tra trùng lặp màu sắc và kích thước

            for (let variant of variants) {
                // Kiểm tra nếu thiếu thông tin
                if (!variant.color || !variant.size || !variant.price || !variant.quantity || !variant.image_variant) {
                    toast.error('Vui lòng điền đầy đủ thông tin cho tất cả các biến thể.');
                    return;
                }

                // Kiểm tra giá và số lượng hợp lệ
                const price = parseFloat(variant.price);
                const quantity = parseInt(variant.quantity, 10);

                if (isNaN(price) || price <= 0) {
                    toast.error('Giá phải là một số dương.');
                    return;
                }
                if (isNaN(quantity) || quantity <= 0) {
                    toast.error('Số lượng phải là một số dương.');
                    return;
                }
                if (quantity > 1000) {
                    toast.error('Số lượng tối đa là 1000.');
                    return;
                }

                // Kiểm tra trùng lặp màu sắc và kích thước
                const variantKey = `${variant.color}-${variant.size}`; // Tạo khóa duy nhất dựa trên màu sắc và kích thước
                if (variantSet.has(variantKey)) {
                    toast.error(`Biến thể với màu sắc và kích thước không được trùng nhau.`);
                    return;
                }
                variantSet.add(variantKey); // Thêm vào Set để kiểm tra các biến thể tiếp theo
            }
        }





        const newProduct = { ...product, status_prod: 0 };

        try {
            const productResponse = await axios.post('http://localhost:8080/admin/api/products', newProduct, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productId = productResponse.data.id;

            if (showVariants) {
                for (let i = 0; i < variants.length; i++) {
                    const variantData = {
                        product: { id: productId },
                        color: { id: variants[i].color },
                        size: { id: variants[i].size },
                        price: variants[i].price,
                        quantity: variants[i].quantity,
                        image_variant: variants[i].image_variant,
                    };
                    await axios.post('http://localhost:8080/admin/api/variant_products', variantData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            }

            toast.success('Tạo sản phẩm thành công!');
            setTimeout(() => {
                history.push('/admin/products');
            }, 1500);

        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo sản phẩm!');
        }
    };

    const handleGoBack = () => {
        history.push('/admin/products');
    };

    const toggleVariants = () => {
        setShowVariants(!showVariants);
    };

    const handleFieldChange = (variantId, field, value) => {
        setVariants(variants.map(variant => {
            if (variant.id === variantId) {
                return { ...variant, [field]: value };
            }
            return variant;
        }));
    };

    const generateSuggestions = (value) => {
        const number = parseInt(value, 10);

        if (isNaN(number)) return [];

        // Gợi ý dựa trên số chữ số
        const suggestions = [];

        if (number < 100) {
            suggestions.push(number * 1000); // Gợi ý hàng chục nghìn
        }
        if (number < 1000) {
            suggestions.push(number * 10000); // Gợi ý hàng trăm nghìn
        }

        return suggestions;
    };
    const handleSuggestionClick = (variantId, suggestion) => {
        handleFieldChange(variantId, 'price', suggestion); // Cập nhật giá trị vào input
    };
    const handleKeyDown = (e, variant) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && variant.price) {
            const suggestions = generateSuggestions(variant.price);
            if (suggestions.length > 0) {
                handleFieldChange(variant.id, 'price', suggestions[0]); // Lấy gợi ý đầu tiên
                e.preventDefault(); // Ngăn hành vi mặc định của phím Tab hoặc Enter
            }
        }
    };

    return (

        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold flex items-center text-blue-600">
                    Tạo sản phẩm mới

                </h2>

                <div className="flex space-x-2">
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
                        onClick={handleGoBack}
                    >
                        <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
                        Quay lại
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Tên sản phẩm */}
                        <div>
                            <label className="block text-gray-700">Tên sản phẩm</label>
                            <input
                                type="text"
                                name="name_prod"
                                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                                value={product.name_prod}
                                onChange={handleChange}
                            />


                        </div>

                        {/* Loại sản phẩm */}
                        <SearchableDropdown
                            categories={categories} // Danh sách danh mục
                            product={product} // State sản phẩm
                            setProduct={setProduct} // Hàm cập nhật state sản phẩm
                        />


                        {/* Nhà cung cấp */}
                        <SearchableBrandDropdown
                            brands={brands} // Danh sách thương hiệu
                            product={product} // State sản phẩm
                            setProduct={setProduct} // Hàm cập nhật state sản phẩm
                        />

                    </div>

                    <div className="flex flex-col items-center mt-6">
                        <div className="w-60 h-60 bg-gray-50 border border-dashed border-gray-400 flex items-center justify-center rounded">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500 flex items-center justify-center h-full w-full">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain rounded"
                                    />
                                ) : (
                                    <span className="text-center">Nhấp để chọn ảnh</span>
                                )}
                            </label>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}

                        />

                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Mô tả sản phẩm</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={product.description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setProduct({ ...product, description: data });
                        }}
                    />
                </div>

                <hr className="my-6 border-gray-300" />

                <div className="mb-4">
                    {/* <button type="button" onClick={toggleVariants} className="bg-blue-500 text-white px-4 py-2 rounded">
                        {showVariants ? 'Ẩn' : 'Hiện'}
                    </button> */}

                    <button
                        type="button"
                        onClick={toggleVariants}
                        className=" text-white px-4 py-2 rounded flex items-center"
                    >
                        {showVariants ? (
                            <AiOutlineEye className="w-5 h-5 mr-2 text-black" />
                        ) : (
                            <AiOutlineEyeInvisible className="w-5 h-5 mr-2 text-black" />
                        )}
                        {showVariants ? '' : ''}
                    </button>
                </div>

                {showVariants && variants.map((variant, index) => (
                    <div key={index} className="mb-8">
                        <h3 className="text-md font-semibold mb-4">Biến thể {index + 1}</h3>
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-gray-700">Màu sắc</label>
                                <select
                                    name="color"
                                    className="w-full border px-4 py-2 rounded mt-1"
                                    value={variant.color}
                                    onChange={(e) => handleVariantChange(index, e)}
                                    style={{
                                        backgroundColor: colors.find(color => color.id === parseInt(variant.color))?.color_name || '#fff', // Đặt màu nền tương ứng
                                        color: colors.find(color => color.id === parseInt(variant.color))?.color_name === '#fff' ? '#000' : '#fff', // Đổi màu chữ nếu nền sáng
                                    }}
                                >
                                    <option value="">Chọn màu sắc</option>
                                    {colors.map(color => (
                                        <option
                                            key={color.id}
                                            value={color.id}
                                            style={{
                                                backgroundColor: color.color_name,
                                                color: '#fff',
                                            }}
                                        >
                                            {color.color_name}
                                        </option>
                                    ))}
                                </select>




                                {/* <ColorSelect
                                    selectedColor={variant.color?.id || ''}
                                    handleChange={selectedOption => handleFieldChange(variant.id, 'color', { id: selectedOption.value, colorName: selectedOption.color })}
                                    colors={colors} // Danh sách màu sắc từ API
                                /> */}
                            </div>

                            <div>
                                <label className="block text-gray-700">Kích thước</label>
                                <select
                                    name="size"
                                    className="w-full border px-4 py-2 rounded mt-1"
                                    value={variant.size}
                                    onChange={(e) => handleVariantChange(index, e)}
                                >
                                    <option value="">Chọn kích thước</option>
                                    {sizes.map(size => (
                                        <option key={size.id} value={size.id}>
                                            {size.name_size}
                                        </option>
                                    ))}
                                </select>

                                {/* <SizeSelect
                                    selectedSize={variant.size?.id || ''}
                                    handleChange={selectedOption => handleFieldChange(variant.id, 'size', { id: selectedOption.value, nameSize: selectedOption.label })}
                                    sizes={sizes} // Danh sách kích thước từ API
                                /> */}
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700">Giá</label>
                                {/* Input giá */}
                                <input
                                    type="number"
                                    name="price"
                                    className="w-full border px-4 py-2 rounded mt-1"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(e, variant)} // Xử lý khi nhấn Tab hoặc Enter
                                    placeholder="Giá"
                                />

                                {/* Hiển thị danh sách gợi ý */}
                                {variant.price && (
                                    <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                        {generateSuggestions(variant.price).map((suggestion, idx) => (
                                            <li
                                                key={idx}
                                                className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSuggestionClick(variant.id, suggestion)} // Xử lý khi click vào gợi ý
                                            >
                                                {suggestion.toLocaleString('vi-VN')} đ
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>


                            <div>
                                <label className="block text-gray-700">Số lượng</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className="w-full border px-4 py-2 rounded mt-1"
                                    value={variant.quantity}
                                    onChange={(e) => handleVariantChange(index, e)}
                                    placeholder="Số lượng"
                                />
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-28 h-28 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                                    <label htmlFor={`variant-file-upload-${index}`} className="cursor-pointer text-gray-500 flex items-center justify-center h-full w-full">
                                        {variant.previewUrl_variant ? (
                                            <img
                                                src={variant.previewUrl_variant}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-center">Chọn ảnh</span>
                                        )}
                                    </label>
                                </div>
                                <input
                                    id={`variant-file-upload-${index}`}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleVariantImageChange(index, e)}

                                />
                            </div>


                            <div className="flex justify-start mt-2">
                                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded flex items-center" onClick={() => handleRemoveVariant(index)}>
                                    <AiOutlineDelete className="w-5 h-5 mr-2" />
                                    {index + 1}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                        onClick={handleAddVariant}
                    >
                        <AiOutlinePlus className="w-5 h-5 mr-2" />
                        Thêm biến thể
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                        disabled={isButtonDisabled || isUploading}
                    >
                        <AiOutlineSave className="w-5 h-5 mr-2" />
                        {isButtonDisabled ? "Chờ..." : "Lưu sản phẩm và biến thể"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateProductWithVariants;
