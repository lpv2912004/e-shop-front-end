import React, { useState, useEffect } from "react";
import { FaSearch, FaMicrophone } from 'react-icons/fa';
import axios from "axios";
import { useHistory } from "react-router-dom"; 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; 

const SearchBar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false); 
    const [keyword, setKeyword] = useState(""); 
    const [results, setResults] = useState([]); 
    const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

    const history = useHistory(); 

    
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        setKeyword(transcript); 
    }, [transcript]);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 1000);

        return () => {
            clearTimeout(handler); 
        };
    }, [keyword]);

 
    useEffect(() => {
        if (debouncedKeyword) {
            handleSearch(debouncedKeyword);
        }
    }, [debouncedKeyword]);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <span>Trình duyệt không hỗ trợ nhận diện giọng nói.</span>;
    }


    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen); 
    };


    const handleInputChange = (e) => {
        setKeyword(e.target.value); 
    };

   
    const handleSearch = async (searchKeyword) => {
        const trimmedKeyword = searchKeyword.trim(); 

        if (!trimmedKeyword) {
            setResults([]); 
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/user/api/variants/search?keyword=${encodeURIComponent(trimmedKeyword)}`
            );
            setResults(response.data.slice(0, 5)); 
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            setResults([]); // Clear results nếu có lỗi
        }
    };

    // Hàm điều hướng khi ấn vào sản phẩm
    const handleViewVariantDetail = (productId) => {
        history.push(`/product/${productId}`); // Use history.push for navigation
    };

    // useEffect để xử lý debounce
   // Bắt đầu nhận diện giọng nói và xóa nội dung input
   const handleMicClick = () => {
    resetTranscript(); // Xóa transcript
    setKeyword(""); // Xóa nội dung input
    SpeechRecognition.startListening(); // Bắt đầu nghe
};

return (
    <div className="relative">
        <button
            className="me-4 flex items-center text-neutral-600 dark:text-white"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={toggleSearch}
        >
            <FaSearch className="w-5 h-5" />
        </button>

        {isSearchOpen && (
            <div className="absolute z-50 top-10 left-0 bg-white shadow-lg p-4 rounded-lg w-64">
                <h4 className="text-sm text-center mb-2">TÌM KIẾM</h4>

                <div className="relative">
                    <input
                        type="text"
                        className="w-full border border-blue-100 rounded-lg p-2 pl-10 focus:outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={keyword}
                        onChange={handleInputChange}
                    />

                    <FaSearch onClick={() => handleSearch(debouncedKeyword)} className="absolute left-2 top-3 text-gray-400 cursor-pointer" />
                    <FaMicrophone onClick={handleMicClick} className="absolute right-2 top-3 text-gray-400 cursor-pointer" />

                    {listening && <p className="text-xs text-blue-500 mt-2">Đang lắng nghe...</p>}
                </div>

                {results.length > 0 ? (
                    <div
                        className="mt-4 border-t border-gray-300 pt-2"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                        {results.map(([id, name_prod, image_prod, price]) => (
                            <div key={id} className="flex items-center mb-2 cursor-pointer" onClick={() => handleViewVariantDetail(id)}>
                                <img
                                    src={image_prod}
                                    alt={name_prod}
                                    style={{ width: "48px", height: "48px", marginRight: "8px" }}
                                />
                                <div>
                                    <p className="text-xs">{name_prod}</p>
                                    <p className="text-gray-500 text-xs">{price} VND</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    keyword && <p className="mt-4 text-xs text-gray-500">Không có sản phẩm nào.</p>
                )}
            </div>
        )}
    </div>
);
};

export default SearchBar;
