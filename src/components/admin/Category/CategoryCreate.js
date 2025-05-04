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

const CreateCategory = () => {
    const history = useHistory();
    const [category, setCategory] = useState({
        name_cate: '',
        cate_image: '',  // Store URL of the uploaded image
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [existingCategories, setExistingCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/admin/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setExistingCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                toast("Có lỗi xảy ra khi tải danh mục!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.error('Có lỗi xảy ra khi tải danh mục!');
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // For previewing the image
            try {
                const imageUrl = await uploadImage(file, `category-images/${file.name}`);
                setCategory({ ...category, cate_image: imageUrl }); // Store the image URL in state
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
        if (!category.name_cate || !category.cate_image) {
            toast("Vui lòng điền đầy đủ thông tin và chọn ảnh!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
              });
            // toast.error('Vui lòng điền đầy đủ thông tin và chọn ảnh!');
            return false;
        }

        const isDuplicate = existingCategories.some(existingCategory =>
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
            // toast.error('Danh mục đã tồn tại!');
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
            return;
        }

        try {
            // Send the category data along with the Firebase image URL to the backend
            const response = await axios.post('http://localhost:8080/admin/api/categories', {
                name_cate: category.name_cate,
                cate_image: category.cate_image,  // Send the image URL here
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            toast("Tạo danh mục thành công!", {
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
            toast("Có lỗi xảy ra khi tạo danh mục!", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
              });
            // toast.error('Có lỗi xảy ra khi tạo danh mục!');
            console.error('Error:', error);
        }
    };

    const handleGoBack = () => {
        history.push('/admin/categories');
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen shadow-lg rounded-lg">
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">Tạo danh mục mới</h2>
                <button
                    type="button"
                    className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600"
                    onClick={handleGoBack}
                >
                    Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-lg text-gray-700">Tên danh mục</label>
                        <input
                            type="text"
                            name="name_cate"
                            className="w-full border border-gray-300 px-4 py-3 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={category.name_cate}
                            onChange={handleChange}
                       
                        />
                    </div>

                    <div>

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
                </div>

                {/* <div className="mb-6">
                    {previewUrl && (
                        <div className="flex justify-center mb-4">
                            <img src={previewUrl} alt="Image Preview" className="max-w-[300px] max-h-[300px] object-cover rounded-lg shadow-md" />
                        </div>
                    )}
                </div> */}

                <div className="flex  mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-600"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Đang tải ảnh...' : 'Tạo danh mục'}
                    </button>
                </div>
            </form>

       
        </div>
    );
};

export default CreateCategory;
