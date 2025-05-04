import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AiOutlineDollar } from 'react-icons/ai';
import { FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const FilterBar = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedSort, setSelectedSort] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [overallPriceRange, setOverallPriceRange] = useState([0, 1000]);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [showColorDropdown, setShowColorDropdown] = useState(false);

    const sortOptions = ['Giá tăng dần', 'Giá giảm dần'];

    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        setSearchKeyword(transcript);
        onFilterChange({ search: transcript });
    }, [transcript]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const categoriesResponse = await axios.get('http://localhost:8080/user/api/categories');
                setCategories(categoriesResponse.data);

                const sizesResponse = await axios.get('http://localhost:8080/user/api/sizes');
                setSizes(sizesResponse.data.map(size => size.name_size));

                const colorsResponse = await axios.get('http://localhost:8080/user/api/colors');
                setColors(colorsResponse.data);
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };

        const fetchOverallPriceRange = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/api/variants/overall-price-range');
                setOverallPriceRange([response.data.minPrice, response.data.maxPrice]);
                setPriceRange([response.data.minPrice, response.data.maxPrice]);
            } catch (error) {
                console.error('Error fetching overall price range:', error);
            }
        };

        fetchFilters();
        fetchOverallPriceRange();
    }, []);

    const handleCategoryChange = (category) => {
        if (selectedCategory === category) {
            setSelectedCategory('Tất cả');
            onFilterChange({ category: 'Tất cả' });
        } else {
            setSelectedCategory(category);
            onFilterChange({ category });
        }
    };

    const handleSizeChange = (size) => {
        setSelectedSizes((prevSizes) => {
            const newSizes = prevSizes.includes(size)
                ? prevSizes.filter(s => s !== size)
                : [...prevSizes, size];
            onFilterChange({ sizes: newSizes });
            return newSizes;
        });
    };

    const handleColorChange = (color) => {
        setSelectedColors((prevColors) => {
            const newColors = prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color];
            onFilterChange({ colors: newColors });
            return newColors;
        });
    };

    const handleSortChange = (e) => {
        const sortOption = e.target.value;
        setSelectedSort(sortOption);
        onFilterChange({ sort: sortOption });
    };

    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
        onFilterChange({ priceRange: value });
    };

    const handleSearchChange = (e) => {
        const newKeyword = e.target.value;
        setSearchKeyword(newKeyword);
        onFilterChange({ search: newKeyword });
    };

    const handleMicClick = () => {
        resetTranscript();
        setSearchKeyword('');
        SpeechRecognition.startListening();
    };

    return (
        <div className="filter-bar mx-auto max-w-7xl py-4 px-2 sm:py-4">
        {/* Categories */}
        <div className="flex overflow-x-auto py-2 gap-4">
            {categories.map((category) => (
                <div
                    key={category.id}
                    className={`flex flex-col items-center cursor-pointer transition-transform transform ${
                        selectedCategory === category.name_cate
                            ? 'border-2 border-blue-400 rounded-sm'
                            : 'border hover:scale-105 hover:shadow-sm'
                    }`}
                    onClick={() => handleCategoryChange(category.name_cate)}
                >
                    <img
                        src={category.cate_image}
                        alt={category.name_cate}
                        className="w-16 h-18 md:w-20 md:h-20 lg:w-24 lg:h-32 object-cover rounded-md mb-1 transition-all duration-300"
                    />
                    <span className="text-sm md:text-sm  transition-all duration-300">
                        {category.name_cate}
                    </span>
                </div>
            ))}
        </div>
    
        {/* Filter Options */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-gray-700 text-base md:text-lg">Bộ lọc:</span>
    
                {/* Price Range */}
                <div className="relative cursor-pointer">
                    <button
                        className="flex items-center justify-center px-4 py-2 rounded-md bg-white border border-gray-300"
                        onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                    >
                        Khoảng giá
                        <span className="ml-2">{showPriceDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showPriceDropdown && (
                        <div className="absolute mt-2 bg-white border rounded-md shadow-md p-4 z-50 w-48 sm:w-64 h-auto">
                            <Slider
                                range
                                min={overallPriceRange[0]}
                                max={overallPriceRange[1]}
                                step={1000}
                                value={priceRange}
                                onChange={handlePriceRangeChange}
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <span>{priceRange[0].toLocaleString()}đ</span>
                                <span>{priceRange[1].toLocaleString()}đ</span>
                            </div>
                        </div>
                    )}
                </div>
    
                {/* Sizes */}
                <div className="relative cursor-pointer">
                    <button
                        className="flex items-center justify-center px-4 py-2 rounded-md bg-white border border-gray-300"
                        onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                    >
                        Kích cỡ
                        <span className="ml-2">{showSizeDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showSizeDropdown && (
                        <div className="absolute mt-2 bg-white border rounded-md shadow-md w-48 sm:w-64 h-auto p-4 z-50">
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <label key={size} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={size}
                                            checked={selectedSizes.includes(size)}
                                            onChange={() => handleSizeChange(size)}
                                            className="form-checkbox h-3 w-3 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
    
                {/* Colors */}
                <div className="relative cursor-pointer">
                    <button
                        className="flex items-center justify-center px-4 py-2 rounded-md bg-white border border-gray-300"
                        onClick={() => setShowColorDropdown(!showColorDropdown)}
                    >
                        Màu sắc
                        <span className="ml-2">{showColorDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showColorDropdown && (
                        <div className="absolute mt-2 bg-white border rounded-md shadow-md w-48 sm:w-64 h-auto p-4 z-50">
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {colors.map((color) => (
                                    <label key={color.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={color.color_name}
                                            checked={selectedColors.includes(color.color_name)}
                                            onChange={() => handleColorChange(color.color_name)}
                                            className="form-checkbox h-3 w-3 text-blue-600"
                                        />
                                        <div
                                            className="w-4 h-4 rounded-full border border-gray-300"
                                            style={{
                                                backgroundColor: color.color_name || '#fff',
                                            }}
                                        ></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
    
            {/* Search */}
            <div className="flex w-full md:max-w-md lg:w-96 relative">
                <input
                    type="text"
                    value={listening ? 'Đang lắng nghe...' : searchKeyword}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition"
                    disabled={listening}
                />
                <FaMicrophone
                    onClick={handleMicClick}
                    className="absolute right-2 top-3 text-gray-400 cursor-pointer"
                />
            </div>
    
            {/* Sort */}
            <select
                value={selectedSort}
                onChange={handleSortChange}
                className="p-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition"
            >
                <option value="">Sắp xếp theo</option>
                {sortOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    </div>
    
    );
};

export default FilterBar;
