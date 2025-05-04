import React, { useState, useRef, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const CreateColor = () => {
    const history = useHistory();
    const [colorHex, setColorHex] = useState(); // State to store the color hex value
    const [existingColors, setExistingColors] = useState([]); // To store the list of existing colors
    const colorPickerRef = useRef(null);
    const changeColorBtnRef = useRef(null);
    const inputRef = useRef(null); // Ref for the manual input

    useEffect(() => {
        // Fetch existing colors when the component mounts
        const token = localStorage.getItem('jwtToken');
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
    }, []);

    useEffect(() => {
        const colorPicker = colorPickerRef.current;
        const changeColorBtn = changeColorBtnRef.current;

        if (colorPicker && changeColorBtn) {
            changeColorBtn.style.backgroundColor = colorPicker.value;

            // Listen for color changes and update both button and state
            colorPicker.addEventListener('input', () => {
                const selectedColor = colorPicker.value;
                changeColorBtn.style.backgroundColor = selectedColor;
                setColorHex(selectedColor); // Update the hex color in the state
                if (inputRef.current) {
                    inputRef.current.value = selectedColor; // Synchronize the input value
                }
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const inputColor = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(inputColor)) { // Validates hex color format
            setColorHex(inputColor);
            if (colorPickerRef.current) {
                colorPickerRef.current.value = inputColor; // Synchronize the color picker
            }
            if (changeColorBtnRef.current) {
                changeColorBtnRef.current.style.backgroundColor = inputColor; // Update button background
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for duplicate color
        if (existingColors.includes(colorHex.toLowerCase())) {
            toast("Mã màu đã tồn tại! Vui lòng chọn mã màu khác.", {
                type: 'error',
                position: 'top-right',
                duration: 3000,
                closeButton: true,
                richColors: true
            });
            return; // Prevent form submission
        }

        const token = localStorage.getItem('jwtToken');
        axios.post('http://localhost:8080/admin/api/colors',
            { color_name: colorHex.toString() },
            { headers: { 'Authorization': `Bearer ${token}` } }
        )
            .then(() => {
                toast(`Tạo màu sắc thành công! Mã màu đã chọn: ${colorHex}`, {
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
                console.error('Có lỗi xảy ra khi tạo màu sắc!', error);
                toast("Có lỗi xảy ra khi tạo màu sắc!", {
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
            <div>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo Màu sắc</h2>
                <button onClick={handleGoBack} className="bg-gray-200 px-4 py-2 rounded">Quay lại</button>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold mb-4">Thông tin Màu sắc</h3>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2">
                        <input
                            id="nativeColorPicker1"
                            ref={colorPickerRef}
                            className="w-3/12 min-h-full h-48"
                            type="color"
                            defaultValue="#6590D5"
                        />
                        <div className="w-2/12 text-center mt-20">Màu xem trước</div>
                        <div
                            id="burronNativeColor"
                            ref={changeColorBtnRef}
                            className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg w-7/12 font-bold text-center mt-47"
                        >
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <strong>Mã màu hiện tại: {colorHex}</strong>
                    </div>

                    {/* New input field for manual hex code entry */}
                    <div className=" mt-3">
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
                        Thêm Màu sắc
                    </button>
                </form>
            </div>

       
        </div>
    );
};

export default CreateColor;
