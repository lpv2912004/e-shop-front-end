import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
// import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

// Cấu hình Firebase
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

const UpdateBrandForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [brand, setBrand] = useState({
        name_brand: '',
        phone: '',
        email: '',
        address: '',
        description: '',
        image_brand: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [existingBrands, setExistingBrands] = useState([]); // Thêm state cho danh sách thương hiệu hiện có

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        // Fetch brand details
        axios.get(`http://localhost:8080/admin/api/brands/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setBrand(response.data);
            setPreviewUrl(response.data.image_brand);  // Hiển thị ảnh hiện có
        })
        .catch(error => {
            console.error('Error fetching brand details:', error);
            toast('Có lỗi xảy ra khi tải dữ liệu thương hiệu!', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            

        });

        // Fetch all brands for duplicate checking
        axios.get(`http://localhost:8080/admin/api/brands`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            setExistingBrands(response.data);
        })
        .catch(error => {
            console.error('Error fetching existing brands:', error);
            toast('Có lỗi xảy ra khi tải danh sách thương hiệu!', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error('Có lỗi xảy ra khi tải danh sách thương hiệu!');
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand((prevBrand) => ({
            ...prevBrand,
            [name]: value,
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // Tạo URL xem trước ảnh

            // Upload ảnh lên Firebase
            try {
                const imageUrl = await uploadImage(file, `brand-images/${file.name}`);
                setBrand({ ...brand, image_brand: imageUrl }); // Lưu URL ảnh vào state
            } catch (error) {
                toast('Lỗi khi tải hình ảnh!', {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                })
                // toast.error('Lỗi khi tải hình ảnh!');
            }
        }
    };

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
            throw error;
        }
    };

    const validateInputs = () => {
        if (!brand.name_brand.trim() || !brand.phone.trim() || !brand.email.trim() || !brand.address.trim()) {
            toast('Vui lòng điền đầy đủ tất cả thông tin.', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error();
            return false;
        }
    
        if (!/^0\d{9}$/.test(brand.phone)) {
            toast('Số điện thoại phải bắt đầu bằng số 0 và đúng 10 số.', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error();
            return false;
        }
    
        if (!brand.email.includes('@')) {
            toast('Email không đúng định dạng.', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error();
            return false;
        }
    
        // Kiểm tra trùng lặp
        const isDuplicate = existingBrands.some(existingBrand =>
            existingBrand.id !== parseInt(id) && // Không phải thương hiệu hiện tại
            (existingBrand.name_brand.toLowerCase() === brand.name_brand.toLowerCase() ||
            existingBrand.phone === brand.phone ||
            existingBrand.email.toLowerCase() === brand.email.toLowerCase())
        );
    
        if (isDuplicate) {
            toast('Thương hiệu, số điện thoại hoặc email đã tồn tại!', {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error();
            return false;
        }
    
        return true;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!validateInputs()) {
            return;
        }
    
        const token = localStorage.getItem('jwtToken');
        const url = `http://localhost:8080/admin/api/brands/${id}`;
    
        // Gửi dữ liệu cập nhật
        axios.put(url, brand, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            toast('Cập nhật thương hiệu thành công!', {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.success();
            setTimeout(() => {
                history.push('/admin/brands');
            }, 1000); 
        })
        .catch(error => {
            console.error('Error updating brand:', error);
            toast('Có lỗi xảy ra khi cập nhật thương hiệu!', {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            })
            // toast.error();
        });
    };
    
    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cập nhật thương hiệu</h2>
                <button 
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={handleGoBack}
                >
                    Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Tên thương hiệu */}
                        <div>
                            <label className="block text-gray-700">Tên thương hiệu</label>
                            <input
                                type="text"
                                name="name_brand"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={brand.name_brand}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Điện thoại */}
                        <div>
                            <label className="block text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={brand.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={brand.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label className="block text-gray-700">Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                className="w-full border px-4 py-2 rounded mt-1"
                                value={brand.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Chọn hình ảnh */}
                    <div className="flex flex-col items-center mt-6">
                        <div className="w-60 h-60 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded" />
                                ) : (
                                    "Chọn ảnh"
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

                {/* Mô tả */}
                <div className="mb-6">
                    <label className="block text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        className="w-full border px-4 py-2 rounded mt-1"
                        value={brand.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex space-x-4">
                    <button 
                        type="submit" 
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Đang tải...' : 'Cập nhật thương hiệu'}
                    </button>
                </div>
            </form>
            {/* <ToastContainer /> */}
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default UpdateBrandForm;
