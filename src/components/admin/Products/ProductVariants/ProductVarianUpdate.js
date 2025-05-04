import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import Select from 'react-select';
import ColorSelect from './ColorSelect';
import SizeSelect from './SizeSelect';
import StatusSelect from './StatusSelect';
import { Toaster, toast } from 'sonner';
import SearchableDropdown from "../SearchableDropdown";
import SearchableBrandDropdown from "../BrandSearch";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
// Đặt phần tử gốc của ứng dụng
Modal.setAppElement('#root');
// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const UpdateProduct = () => {
    const history = useHistory();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        // Fetch sản phẩm
        axios.get(`http://localhost:8080/admin/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product!', error));
        // Fetch thương hiệu
        axios.get('http://localhost:8080/admin/api/brands', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setBrands(response.data))
            .catch(error => console.error('Error fetching brands!', error));
        // Fetch danh mục
        axios.get('http://localhost:8080/admin/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories!', error));
        // Fetch biến thể
        axios.get(`http://localhost:8080/admin/api/variant_products/product/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setVariants(response.data))
            .catch(error => console.error('Error fetching variants!', error));
        // Fetch màu sắc
        axios.get('http://localhost:8080/admin/api/colors', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setColors(response.data))
            .catch(error => console.error('Error fetching colors!', error));
        // Fetch kích thước
        axios.get('http://localhost:8080/admin/api/sizes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setSizes(response.data))
            .catch(error => console.error('Error fetching sizes!', error));

    }, [id]);

    // Hàm upload ảnh lên Firebase và trả về URL
    const handleImageUpload = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image!', error);
            throw error;
        }
    };

    const handleProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // lưu ảnh vào state
            setPreviewUrl(URL.createObjectURL(file)); // xem trước
        }
    };

    const handleImageChange = (e, variantId) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            setVariants(variants.map(variant =>
                variant.id === variantId || variant.id === null
                    ? { ...variant, imageFile: file, imagePreview: previewUrl }
                    : variant
            ));
        }
    };

    const validateProduct = () => {
        if (!product.nameProd && !product.name_prod) {
            toast.error('Tên sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.imageProd && !imageFile) {
            toast.error('Hình ảnh sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.category?.id) {
            toast.error('Loại sản phẩm không được bỏ trống!');
            return false;
        }
        if (!product.brand?.id) {
            toast.error('Thương hiệu không được bỏ trống!');
            return false;
        }
        return true;
    };

    const handleAddVariant = () => {
        setVariants([...variants, {
            id: null,
            color: { id: '' },
            size: { id: '' },
            price: '',
            quantity: '',
            image_variant: '',
            status_VP: 1,
            isNew: true
        }]);
    };

    const uploadImageToFirebase = async () => {
        if (!imageFile) return product.imageProd;

        setUploading(true);
        const storageRef = ref(storage, `images/${imageFile.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image!', error);
            setUploading(false);
            return product.imageProd;
        }
    };

    const handleSave = async () => {
        if (!validateProduct()) return;

        const token = localStorage.getItem('jwtToken');

        let imageProd;
        try {
            imageProd = await uploadImageToFirebase();
        } catch (error) {
            console.error('Error uploading product image!', error);
            toast.error('Lỗi khi tải ảnh sản phẩm lên!');
            return;
        }

        const updatedProduct = {
            name_prod: product.name_prod || product.nameProd,
            description: product.description || '',
            image_prod: imageProd,
            brand: product.brand || {},
            category: product.category || {},
            status_prod: product.status_prod !== undefined ? product.status_prod : true,
        };

        try {
            await axios.put(`http://localhost:8080/admin/api/products/${id}`, updatedProduct, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Sau khi cập nhật thành công, hiển thị toast thành công
            toast.success('Cập nhật sản phẩm thành công!');

            // Delay trước khi chuyển hướng
            setTimeout(() => {
                history.push('/admin/products');
            }, 1500);  // Delay 1.5 giây để toast có thời gian hiển thị
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                toast.error(`Lỗi từ máy chủ: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Không nhận được phản hồi từ máy chủ.');
            } else {
                console.error('Client Error:', error.message);
                toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
            }
        }
    };

    const handleSaveVariant = async (variant) => {
        const duplicateVariant = variants.find(v =>
            v.color.id.toString() === variant.color.id.toString() &&
            v.size.id.toString() === variant.size.id.toString() &&
            v.id !== variant.id
        );

        if (duplicateVariant) {
            toast.error('Biến thể với màu sắc và kích thước này đã tồn tại!');
            return;
        }

        if (!variant.color.id) {
            toast.error('Màu sắc không được bỏ trống!');
            return;
        }

        if (!variant.size.id) {
            toast.error('Kích thước không được bỏ trống!');
            return;
        }

        if (variant.price <= 0) {
            toast.error('Giá phải lớn hơn 0!');
            return;
        }

        if (!variant.quantity) {
            toast.error('Số lượng không được bỏ trống!');
            return;
        }

        const token = localStorage.getItem('jwtToken');

        let imageUrl = variant.image_variant || variant.imagePreview;

        if (variant.imageFile) {
            const storageRef = ref(storage, `variants/${variant.imageFile.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, variant.imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error('Error uploading variant image!', error);
                toast.error('Lỗi khi tải ảnh lên!');
                return;
            }
        }

        const updatedVariant = {
            ...variant,
            image_variant: imageUrl,
            product: { id: product.id }
        };

        try {
            if (variant.id) {
                await axios.put(`http://localhost:8080/admin/api/variant_products/${variant.id}`, updatedVariant, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Cập nhật biến thể thành công!');
            } else {
                const response = await axios.post('http://localhost:8080/admin/api/variant_products', updatedVariant, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Thêm biến thể mới thành công!');
            }

            const variantsResponse = await axios.get(`http://localhost:8080/admin/api/variant_products/product/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVariants(variantsResponse.data);

            setEditingVariantId(null);
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
                toast.error(`Lỗi từ máy chủ: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Không nhận được phản hồi từ máy chủ.');
            } else {
                console.error('Client Error:', error.message);
                toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
            }
        }
    };

    const handleFieldChange = (variantId, field, value) => {
        setVariants(variants.map(variant => {
            if (variant.id === variantId) {
                return { ...variant, [field]: value };
            }
            return variant;
        }));
    };

    const handleEditVariant = (variantId) => {
        setEditingVariantId(variantId);
        setVariants(variants.map(variant =>
            variant.id === variantId ? { ...variant, imagePreview: variant.imageVariant } : variant
        ));
    };

    if (!product) {
        return <div>Loading...</div>;
    }
    const handleDeleteVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
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
        <div className="p-6 bg-gray-50 shadow">
            <Toaster richColors position="top-right" />

            <div className="flex justify-between items-center mb-4 flex ">
                <h2 className="text-xl font-bold flex items-center text-blue-600">

                    Chỉnh sửa sản phẩm: {product.nameProd}</h2>
                <button className="bg-gray-500 text-white border-spacing-2 px-4 py-2 rounded flex" onClick={() => history.goBack()}>
                    <AiOutlineArrowLeft className="w-5 h-5 mr-2 flex items-center" />
                    Quay lại
                </button>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="bg-white p-4 rounded shadow flex">
                <div className="flex-1 pr-4">

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tên sản phẩm</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                            value={product.name_prod || product.nameProd}
                            onChange={e => setProduct({ ...product, name_prod: e.target.value })}
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

                <div className="w-1/3">
                    <div className="flex flex-col items-center mt-6">
                        <div className="w-48 h-48 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded" />
                                ) : product.imageProd ? (
                                    <img src={product.imageProd} alt="Hình sản phẩm" className="max-w-full max-h-full object-contain rounded" />
                                ) : (
                                    "nhấp để chọn ảnh"
                                )}
                            </label>
                        </div>

                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleProductImageChange}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-gray-700 mb-2">Mô tả sản phẩm</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={product.description || '<p>Nhập mô tả sản phẩm tại đây...</p>'}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setProduct({ ...product, description: data });
                    }}
                />
            </div>

            {/* Biến thể */}
            <div className="bg-white p-4 mt-6 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Biến thể sản phẩm</h3>
                <div className="mb-4">
                    {variants.length > 0 ? (
                        <table className="min-w-full bg-slate-50 border text-sm">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-center border-b">Hình ảnh</th>
                                    <th className="px-6 py-3 text-center border-b">Màu sắc</th>
                                    <th className="px-6 py-3 text-center border-b">Kích thước</th>
                                    <th className="px-6 py-3 text-center border-b">Giá</th>
                                    <th className="px-6 py-3 text-center border-b">Số lượng</th>
                                    <th className="px-6 py-3 text-center border-b">Trạng thái</th>
                                    <th className="px-6 py-3 text-center border-b">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr
                                        key={variant.id || `new-variant-${index}`}
                                        className={variant.isNew ? 'bg-yellow-100' : ''}
                                    >
                                        <td className="px-6 py-4 border-b text-sm items-center text-center" >
                                            {editingVariantId === variant.id || variant.isNew ? (
                                                <div className=" text-center w-16 h-16 bg-gray-100 border border-dashed border-gray-400 rounded ">
                                                    <label htmlFor={`variant-file-upload-${variant.id || `new-${variant.color.id}-${variant.size.id}`}`} className="cursor-pointer">
                                                        <img
                                                            src={variant.imagePreview || variant.imageVariant || 'placeholder-image-url'}
                                                            alt={variant.description || 'Image'}
                                                            className=" items-end w-16 h-16 object-cover rounded mx-auto transition-shadow duration-200 hover:shadow-light-3"
                                                        />

                                                    </label>
                                                    <input
                                                        id={`variant-file-upload-${variant.id || `new-${variant.color.id}-${variant.size.id}`}`}
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleImageChange(e, variant.id || `new-${variant.color.id}-${variant.size.id}`)}
                                                    />
                                                </div>
                                            ) : (
                                                <img
                                                    src={variant.imageVariant || 'placeholder-image-url'}
                                                    alt={variant.description || 'Image'}
                                                    className=" items-end w-16 h-16 object-cover rounded mx-auto transition-shadow duration-200 hover:shadow-light-3"

                                                />
                                            )}
                                        </td>
                                        {/* <td className="px-6 py-4 border-b">
                                            {editingVariantId === variant.id ? (
                                                <select
                                                    value={variant.color?.id || ''}
                                                    onChange={e => handleFieldChange(variant.id, 'color', { id: e.target.value, colorName: colors.find(c => c.id === e.target.value)?.color_name })}
                                                    className="border rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">Chọn Màu</option>
                                                    {colors.map(color => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.color_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className='w-15 h-15' style={{ backgroundColor: variant.color.colorName }}>.</div>
                                            )}
                                        </td> */}

                                        <td className="text-sm px-6 py-4 border-b text-center">
                                            {editingVariantId === variant.id ? (
                                                <ColorSelect
                                                    selectedColor={variant.color?.id || ''}
                                                    handleChange={selectedOption => handleFieldChange(variant.id, 'color', { id: selectedOption.value, colorName: selectedOption.color })}
                                                    colors={colors} // Danh sách màu sắc từ API
                                                />
                                            ) : (
                                                <div className='w-15 h-15' style={{ backgroundColor: variant.color.colorName }}>.</div>
                                            )}
                                        </td>

                                        <td className="text-sm px-6 py-4 border-b text-center">
                                            {editingVariantId === variant.id ? (
                                                <SizeSelect
                                                    selectedSize={variant.size?.id || ''}
                                                    handleChange={selectedOption => handleFieldChange(variant.id, 'size', { id: selectedOption.value, nameSize: selectedOption.label })}
                                                    sizes={sizes} // Danh sách kích thước từ API
                                                />
                                            ) : (
                                                variant.size.nameSize
                                            )}
                                        </td>


                                        <td className="px-6 py-4 border-b text-center text-sm">
                                            {editingVariantId === variant.id ? (
                                                <div className="relative inline-block w-24">
                                                    {/* Input chính */}
                                                    <input
                                                        type="number"
                                                        value={variant.price || ''}
                                                        onChange={(e) => handleFieldChange(variant.id, 'price', e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(e, variant)}
                                                        className="border rounded-md px-1 py-1 w-full text-center"
                                                    />

                                                    {/* Gợi ý giá trị */}
                                                    {variant.price && (
                                                        <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                            {generateSuggestions(variant.price).map((suggestion, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                                                                    onClick={() => handleSuggestionClick(variant.id, suggestion)}
                                                                >
                                                                    {suggestion.toLocaleString('vi-VN')} đ
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ) : (
                                                variant.price.toLocaleString('vi-VN') + ' đ'
                                            )}
                                        </td>




                                        <td className="px-6 py-4 border-b text-center text-sm">
                                            {editingVariantId === variant.id ? (
                                                <input

                                                    type="number"
                                                    value={variant.quantity || 0}
                                                    onChange={e => handleFieldChange(variant.id, 'quantity', e.target.value)}
                                                    className="border rounded-md px-1 py-1 w-24 text-center"
                                                />
                                            ) : (
                                                variant.quantity
                                            )}
                                        </td>

                                        <td className="px-6 py-4 border-b text-center text-sm">
                                            {editingVariantId === variant.id ? (
                                                <StatusSelect

                                                    variant={variant}
                                                    handleFieldChange={handleFieldChange}
                                                />
                                            ) : (
                                                <span className={variant.status_VP ? 'text-green-500' : 'text-red-500'}>
                                                    {variant.status_VP ? 'Đang bán' : 'Ngừng bán'}
                                                </span>
                                            )}
                                        </td>



                                        <td className="px-6 py-4 border-b text-center text-sm">
                                            {editingVariantId === variant.id || variant.isNew ? (
                                                <>
                                                    <button
                                                        className="text-green-500 hover:underline mr-4"
                                                        onClick={() => handleSaveVariant(variant)}
                                                    >
                                                        <AiOutlineSave className="w-5 h-5 mr-2 flex items-center" />

                                                    </button>
                                                    {variant.isNew && (
                                                        <button
                                                            className="text-red-500 hover:underline"
                                                            onClick={() => handleDeleteVariant(index)}
                                                        >
                                                            <AiOutlineDelete className="w-5 h-5 mr-2 flex items-center" />
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <button
                                                    className="text-blue-500 hover:underline  text-center"
                                                    onClick={() => handleEditVariant(variant.id)}
                                                >
                                                    <AiOutlineEdit className="w-5 h-5 mr-2" />

                                                </button>

                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Không có biến thể nào</p>
                    )}
                </div>
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded flex "
                    onClick={handleAddVariant}
                >
                    <AiOutlinePlus className="w-5 h-5 mr-2 flex items-center" />
                    Thêm biến thể
                </button>
            </div>

            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-6 flex"
                    disabled={uploading}
                >
                    <AiOutlineSave className="w-5 h-5 mr-2 flex items-center" />
                    {uploading ? 'Đang tải lên...' : 'Lưu sản phẩm'}
                </button>
            </div>
        </div>
    );
};

export default UpdateProduct;
