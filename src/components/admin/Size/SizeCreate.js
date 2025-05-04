import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

const SizeCreate = () => {
    const history = useHistory();
    const [nameSize, setNameSize] = useState('');
    const [existingSizes, setExistingSizes] = useState([]);

    useEffect(() => {
        // Fetch all existing sizes when the component mounts
        const fetchSizes = async () => {
            const token = localStorage.getItem('jwtToken');
            try {
                const response = await axios.get('http://localhost:8080/admin/api/sizes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setExistingSizes(response.data); // Store existing sizes
            } catch (error) {
                toast("Có lỗi xảy ra khi lấy danh sách kích thước!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                console.error('Error fetching sizes:', error);
                // toast.error('Có lỗi xảy ra khi lấy danh sách kích thước!');
            }
        };

        fetchSizes();
    }, []);

    const validateSizeName = (name) => {
        const sizeNameRegex = /^[a-zA-Z0-9]+$/;
        if (name.trim() === '') {
            return 'Tên kích thước không được để trống!';
        }
        if (!sizeNameRegex.test(name)) {
            return 'Không chứa ký tự đặc biệt!';
        }
        // Check if the size name already exists
        const isDuplicate = existingSizes.some(size => size.name_size.toLowerCase() === name.toLowerCase());
        if (isDuplicate) {
            return 'Tên kích thước đã tồn tại!';
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validateSizeName(nameSize);
        if (error) {
            toast(error, {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            // toast.error(error); // Show error notification if validation fails
            return;
        }

        const token = localStorage.getItem('jwtToken');

        axios.post('http://localhost:8080/admin/api/sizes', { name_size: nameSize }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                toast("Tạo kích thước thành công!", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.success('Tạo kích thước thành công!'); // Show success notification
                setTimeout(() => {
                    history.push('/admin/sizes');
                }, 1000);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi tạo kích thước!', error);
                toast("Có lỗi xảy ra khi tạo kích thước!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.error('Có lỗi xảy ra khi tạo kích thước!'); // Show error notification
            });
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6">
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo Kích thước</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Kích thước</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Tên kích thước</label>
                        <input
                            type="text"
                            className="w-full border px-4 py-2 rounded mt-1"
                            value={nameSize}
                            onChange={e => setNameSize(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Thêm Kích thước
                    </button>
                </form>
            </div>

          
        </div>
    );
};

export default SizeCreate;
