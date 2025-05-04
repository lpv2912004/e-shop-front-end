import React, { useState } from 'react';
import Select from 'react-select';

const ColorSelect = ({ selectedColor, handleChange, colors }) => {
    // Create color options with background colors
    const colorOptions = colors.map(color => ({
        value: color.id,
        label: color.color_name,
        color: color.color_name
    }));

    // Custom styles for displaying background color for each option
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.data.color,
            color: state.isSelected ? 'white' : 'black',
            padding: 10,
        }),
        singleValue: (provided, state) => ({
            ...provided,
            backgroundColor: state.data.color,
            color: 'white',
            padding: 5,
        }),
        menu: (provided) => ({
            ...provided,
            marginTop: 0,
        }),
        menuList: (provided) => ({
            ...provided,
            padding: 0,
        })
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev); // Toggle menu on click
    };

    return (
        <Select
            className="mt-0"
            value={colorOptions.find(option => option.value === selectedColor)}
            onChange={handleChange}
            options={colorOptions}
            styles={customStyles}
            placeholder="Chọn Màu sắc"
            menuIsOpen={isMenuOpen} // Control menu visibility with state
            onFocus={handleMenuToggle} // Open menu on focus (click)
            onBlur={() => setIsMenuOpen(false)} // Close menu on blur (focus out)
        />
    );
};

export default ColorSelect;
