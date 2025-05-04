import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

const UpdateCategory = () => {
    const { id } = useParams();
    const history = useHistory();
    const [category, setCategory] = useState({
        name_cate: '',
        cate_image: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        // Fetch all categories for duplicate checking
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/api/categories', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setExistingCategories(response.data);
            } catch (error) {
                console.error('Có lỗi xảy ra khi tải danh mục!', error);
                toast("Có lỗi xảy ra khi tải danh mục!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            }
        };

        // Fetch the current category details
        const fetchCategoryDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/api/categories/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCategory(response.data);
                setPreviewUrl(response.data.cate_image); // Keep the existing image URL
            } catch (error) {
                console.error('Có lỗi xảy ra khi lấy thông tin danh mục!', error);
                toast("Có lỗi xảy ra khi lấy thông tin danh mục!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            }
        };

        fetchCategories();
        fetchCategoryDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // Update preview
            try {
                const imageUrl = await uploadImage(file, `category-images/${file.name}`);
                setCategory({ ...category, cate_image: imageUrl }); // Update cate_image state
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
            return downloadURL;
        } catch (error) {
            setIsUploading(false);
            throw error;
        }
    };

    const validateInputs = () => {
        if (!category.name_cate || !category.cate_image) {
            toast("Vui lòng điền đầy đủ thông tin và chọn ảnh!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return false;
        }

        const isDuplicate = existingCategories.some(existingCategory =>
            existingCategory.id !== parseInt(id) &&
            existingCategory.name_cate.toLowerCase() === category.name_cate.toLowerCase()
        );

        if (isDuplicate) {
            toast("Danh mục đã tồn tại!", {
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
        if (!validateInputs()) {
            return;
        }

        try {
            await axios.put(`http://localhost:8080/admin/api/categories/${id}`, category, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast("Cập nhật danh mục thành công!", {
                type: 'success',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            setTimeout(() => {
                history.push('/admin/categories');
            }, 1500);
        } catch (error) {
            
            toast("Có lỗi xảy ra khi cập nhật danh mục!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
        }
    };

    const handleGoBack = () => {
        history.push('/admin/categories');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cập nhật danh mục</h2>
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
                    <div>
                        <label className="block text-gray-700">Tên danh mục</label>
                        <input
                            type="text"
                            name="name_cate"
                            className="w-full border px-4 py-2 rounded mt-1"
                            value={category.name_cate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col items-center">
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

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isUploading}
                >
                    {isUploading ? 'Đang tải...' : 'Cập nhật danh mục'}
                </button>
            </form>

        </div>
    );
};

export default UpdateCategory;
