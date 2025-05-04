import React, { useState, useRef, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateColor = () => {
    const { id } = useParams(); // Get the color ID from URL parameters
    const history = useHistory();
    const [colorHex, setColorHex] = useState('#6590D5'); // State to store the color hex value
    const [originalColorHex, setOriginalColorHex] = useState(''); // Store the original color hex
    const [existingColors, setExistingColors] = useState([]); // Store existing colors
    const colorPickerRef = useRef(null);
    const changeColorBtnRef = useRef(null);
    const inputRef = useRef(null); // Ref for manual input field

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        // Fetch existing colors when the component mounts
        axios.get('http://localhost:8080/admin/api/colors', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setExistingColors(response.data.map(color => color.color_name.toLowerCase()));
            })
            .catch(error => {
                console.error('Error fetching existing colors:', error);
                toast("Có lỗi xảy ra khi lấy danh sách màu sắc!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            });

        // Fetch the current color details
        const fetchColor = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/api/colors/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data && response.data.color_name) {
                    setColorHex(response.data.color_name); // Set the color hex from the response
                    setOriginalColorHex(response.data.color_name); // Store the original color
                } else {
                    toast("Không tìm thấy thông tin màu sắc!", {
                        type: 'error',
                        position: 'top-right',
                        duration: 3000,
                        closeButton: true,
                        richColors: true
                    });
                }
            } catch (error) {
                console.error('Error fetching color details:', error.response?.data || error.message);
                toast("Có lỗi xảy ra khi lấy thông tin màu sắc!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            }
        };

        fetchColor();
    }, [id]);

    useEffect(() => {
        const colorPicker = colorPickerRef.current;
        const changeColorBtn = changeColorBtnRef.current;

        if (colorPicker) {
            colorPicker.value = colorHex; // Đồng bộ với color picker
        }
        if (changeColorBtn) {
            changeColorBtn.style.backgroundColor = colorHex; // Đồng bộ với nút "Màu xem trước"
        }
        if (inputRef.current) {
            inputRef.current.value = colorHex; // Đồng bộ với input
        }
    }, [colorHex]);

    const handleInputChange = (e) => {
        const inputColor = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(inputColor)) { // Chỉ nhận giá trị hợp lệ
            setColorHex(inputColor); // Cập nhật trạng thái màu
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for duplicate color unless it's the original color
        if (colorHex.toLowerCase() !== originalColorHex.toLowerCase() &&
            existingColors.includes(colorHex.toLowerCase())) {
            toast("Mã màu đã tồn tại! Vui lòng chọn mã màu khác", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return; // Prevent update if duplicate is found
        }

        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/admin/api/colors/${id}`, { color_name: colorHex }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(() => {
                toast("Cập nhật màu sắc thành công!", {
                    type: 'success',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
                setTimeout(() => {
                    history.push('/admin/colors');
                }, 1000);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi cập nhật màu sắc!', error.response?.data || error.message);
                toast("Có lỗi xảy ra khi cập nhật màu sắc!", {
                    type: 'error',
                    position: 'top-right',
                    duration: 3000,
                    closeButton: true,
                    richColors: true
                });
            });
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
                <h2 className="text-xl font-bold">Cập nhật Màu sắc</h2>
                <button className="bg-gray-200 px-4 py-2 rounded" onClick={handleGoBack}>
                    Quay lại
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        <input
                            id="colorPickerUpdate"
                            ref={colorPickerRef}
                            className="w-3/12 min-h-full h-48"
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                        />
                        <div className="w-2/12 text-center mt-20"> Màu xem trước</div>
                        <div
                            id="buttonUpdateColor"
                            ref={changeColorBtnRef}
                            className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
                        >
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <strong>Mã màu hiện tại: {colorHex}</strong>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="colorHexInput" className="block mb-2 font-semibold">Nhập mã màu:</label>
                        <input
                            id="colorHexInput"
                            ref={inputRef}
                            className="px-4 py-2 border border-gray-300 rounded"
                            type="text"
                            defaultValue={colorHex}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Cập nhật Màu sắc
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateColor;
