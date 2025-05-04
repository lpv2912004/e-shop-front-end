import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material'; // Dùng để tạo loading indicator

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

const AdminProfile = () => {
    const [user, setUser] = useState({
        fullName: '',
        gender: true,
        birthday: '',
        image_user: '',
    });
    const [formUser, setFormUser] = useState({ ...user });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id_user;

            axios.get(`http://localhost:8080/admin/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setUser(response.data);
                    setFormUser(response.data);
                    setPreviewUrl(response.data.image_user);
                })
                .catch((error) => {
                    console.error('Error fetching user information:', error);
                });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormUser({ ...formUser, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            await handleImageUpload(file);
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return formUser.image_user;

        setIsUploading(true);
        const storageRef = ref(storage, `avatars/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setIsUploading(false);

            const token = localStorage.getItem('jwtToken');
            const userId = jwtDecode(token).id_user;

            const updatedUser = {
                ...formUser,
                image_user: downloadURL
            };

            axios.put(`http://localhost:8080/admin/api/users/${userId}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setUser(response.data);
                    toast.success('Ảnh đại diện đã được cập nhật!');
                })
                .catch((error) => {
                    console.error('Error updating user information:', error.response ? error.response.data : error.message);
                    toast.error('Đã có lỗi xảy ra khi cập nhật ảnh.');
                });
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const userId = jwtDecode(token).id_user;

        const updatedUser = {
            ...formUser,
        };

        axios.put(`http://localhost:8080/admin/api/users/${userId}`, updatedUser, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setUser(response.data);
                toast.success('Thông tin đã được cập nhật!');
            })
            .catch((error) => {
                console.error('Error updating user information:', error.response ? error.response.data : error.message);
                toast.error('Đã có lỗi xảy ra khi cập nhật thông tin.');
            });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 flex justify-between items-center relative">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                                    <CircularProgress size={40} />
                                </div>
                            )}
                            <img
                                src={previewUrl}
                                alt="Avatar"
                                className="object-cover w-full h-full hover:opacity-75 transition-opacity duration-300"
                            />
                        </div>
                        <div className="ml-4 text-white">
                            <h2 className="text-4xl font-extrabold">{formUser.fullName}</h2>
                            <p className="text-lg font-medium opacity-75">Quản trị viên</p>
                        </div>
                    </div>
                    <div className="absolute right-6 bottom-6">
                        <label htmlFor="file-upload" className="bg-white text-teal-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 shadow transition-all">
                            Thay đổi ảnh đại diện
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tên đầy đủ */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-semibold">Tên đầy đủ</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formUser.fullName}
                                onChange={handleInputChange}
                                className="w-full border px-4 py-3 rounded-lg mt-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Giới tính */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-semibold">Giới tính</label>
                            <select
                                name="gender"
                                value={formUser.gender}
                                onChange={handleInputChange}
                                className="w-full border px-4 py-3 rounded-lg mt-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                        </div>

                        {/* Ngày sinh */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-semibold">Ngày sinh</label>
                            <input
                                type="date"
                                name="birthday"
                                value={formUser.birthday}
                                onChange={handleInputChange}
                                className="w-full border px-4 py-3 rounded-lg mt-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>

                        {/* Email (chỉ hiển thị) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-semibold">Email</label>
                            <div className="w-full border px-4 py-3 rounded-lg mt-2 bg-gray-100 text-gray-800">
                                {formUser.email}
                            </div>
                        </div>

                        {/* Số điện thoại (chỉ hiển thị) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xl font-semibold">Số điện thoại</label>
                            <div className="w-full border px-4 py-3 rounded-lg mt-2 bg-gray-100 text-gray-800">
                                {formUser.phone}
                            </div>
                        </div>
                    </div>

                    {/* Nút Cập nhật */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-600 transition-all"
                        >
                            Cập nhật thông tin
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AdminProfile;
