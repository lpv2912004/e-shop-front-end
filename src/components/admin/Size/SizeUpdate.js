import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

const SizeUpdate = () => {
    const { id } = useParams();
    const history = useHistory();
    const [sizeName, setSizeName] = useState('');
    const [existingSizes, setExistingSizes] = useState([]);

    // Fetch all sizes to check for duplicates
    const fetchSizes = useCallback(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/admin/api/sizes', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setExistingSizes(response.data); // Store existing sizes
            })
            .catch(error => {

                console.error('Có lỗi xảy ra khi lấy danh sách kích thước!', error);

                toast("Có lỗi xảy ra khi lấy danh sách kích thước!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.error('Có lỗi xảy ra khi lấy danh sách kích thước!');
            });
    }, []);

    // Fetch the size info for the size being updated
    const fetchSize = useCallback(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/admin/api/sizes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setSizeName(response.data.name_size);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi lấy thông tin size!', error);
                toast("Có lỗi xảy ra khi lấy thông tin kích thước!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.error('Có lỗi xảy ra khi lấy thông tin size!');
            });
    }, [id]);

    useEffect(() => {
        fetchSizes(); // Fetch sizes for duplicate check
        fetchSize();  // Fetch current size details
    }, [fetchSize, fetchSizes]);

    // Validate the updated size name
    const validateSizeName = (name) => {
        const sizeNameRegex = /^[a-zA-Z0-9]+$/;
        if (name.trim() === '') {
            return 'Tên kích thước không được để trống!';
        }
        if (!sizeNameRegex.test(name)) {
            return 'Không chứa ký tự đặc biệt!';
        }

        // Check if the size name already exists (exclude the current size)
        const isDuplicate = existingSizes.some(size => size.name_size.toLowerCase() === name.toLowerCase() && size.id !== parseInt(id));
        if (isDuplicate) {
            return 'Tên kích thước đã tồn tại!';
        }
        return '';
    };

    // Handle update submission
    const handleUpdate = (e) => {
        e.preventDefault();

        const error = validateSizeName(sizeName);
        if (error) {
            toast(error, {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            // toast.error(error);
            return;
        }

        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/admin/api/sizes/${id}`, { name_size: sizeName }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                toast("Cập nhật size thành công!", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.success('Cập nhật size thành công!');
                setTimeout(() => {
                    history.push('/admin/sizes');
                }, 1000);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi cập nhật size!', error);
                toast("Cập nhật size thành công!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                // toast.error('Có lỗi xảy ra khi cập nhật size!');
            });
    };

    return (
        <div className="p-6 bg-white rounded shadow">
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <h2 className="text-xl font-bold mb-4">Cập Nhật Size</h2>

            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label htmlFor="sizeName" className="block text-gray-700">Tên Size</label>
                    <input
                        type="text"
                        id="sizeName"
                        value={sizeName}
                        onChange={(e) => setSizeName(e.target.value)}
                        className="border px-4 py-2 rounded w-full"
                    />
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Cập Nhật
                    </button>
                </div>
            </form>

        </div>
    );
};

export default SizeUpdate;
