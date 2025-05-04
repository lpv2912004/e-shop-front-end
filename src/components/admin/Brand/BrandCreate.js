import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const CreateBrand = () => {
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
    const [existingBrands, setExistingBrands] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/admin/api/brands', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setExistingBrands(response.data);
            })
            .catch(error => {
                console.error('Error fetching existing brands:', error);
                toast("Có lỗi xảy ra khi lấy danh sách thương hiệu!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand({ ...brand, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // For previewing the image
            try {
                const imageUrl = await uploadImage(file, `brand-images/${file.name}`);
                setBrand({ ...brand, image_brand: imageUrl });


            } catch (error) {
                toast("Lỗi khi tải hình ảnh!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
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
            return downloadURL;  // Return URL of the uploaded image
        } catch (error) {
            setIsUploading(false);
            throw error;
        }
    };

    const validateInputs = () => {

        if (!brand.name_brand.trim() || !brand.phone.trim() || !brand.email.trim() || !brand.address.trim()) {
            toast("Vui lòng điền đầy đủ thông tin và chọn ảnh!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return false;
        }

        if (!brand.email.includes('@')) {
            toast.error('Email không đúng định dạng.');
            return false;
        }

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(brand.phone)) {
            toast.error('Số điện thoại không hợp lệ! Số điện thoại phải bắt đầu bằng số 0 và có đủ 10 chữ số.');
            return false;
        }

        // Check for duplicates
        const isDuplicate = existingBrands.some(existingBrand =>
            existingBrand.name_brand.toLowerCase() === brand.name_brand.toLowerCase() ||
            existingBrand.phone === brand.phone ||
            existingBrand.email.toLowerCase() === brand.email.toLowerCase()
        );

        if (isDuplicate) {
            toast("Thương hiệu, số điện thoại hoặc Email đã tồn tại!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            toast("Bạn chưa đăng nhập!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return;
        }

        if (!validateInputs()) {
            return; // Stop if validation fails
        }

        try {
            const newBrand = await axios.post('http://localhost:8080/admin/api/brands', brand, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast("Đã thêm nhà cung cấp", {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            setTimeout(() => {
                history.push('/admin/brands');
            }, 1500);
        } catch (error) {
            toast("Có lỗi xảy ra khi thêm nhà cung cấp!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
        }
    };

    const handleGoBack = () => {
        history.push('/admin/brands');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
                <h2 className="text-xl font-bold">Tạo nhà cung cấp mới</h2>
                <button
                    type="button"
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
                                type="text"
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

                    {/* Chọn ảnh */}
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg shadow-lg transition-transform hover:scale-105">
                            <label htmlFor="file-upload" className="cursor-pointer text-gray-500 text-lg font-semibold flex items-center justify-center w-full h-full">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                                ) : (
                                    <span>Chọn ảnh</span>
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
                    <label className="block text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        rows="4"
                        className="w-full border px-4 py-2 rounded mt-1"
                        value={brand.description}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className="bg-blue-500 text-white px-6 py-2 rounded"
                >
                    {isUploading ? 'Đang tải...' : 'Tạo nhà cung cấp'}
                </button>
            </form>
        </div>
    );
};

export default CreateBrand;
