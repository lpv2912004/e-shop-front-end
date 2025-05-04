import React, { useState } from 'react';
import Select from 'react-select';

const SizeSelect = ({ selectedSize, handleChange, sizes }) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false); // State to control menu visibility

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            padding: 10,
            color: state.isSelected ? '#fff' : '#333',
            backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#e6f7ff' : null,
        }),
        singleValue: (provided) => ({
            ...provided,
            padding: 5,
            color: '#333',
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#007bff' : '#ccc',
            boxShadow: state.isFocused ? '0 0 0 1px #007bff' : null,
            '&:hover': {
                borderColor: '#007bff'
            }
        }),
        menu: (provided) => ({
            ...provided,
            marginTop: 0,
            borderRadius: '0.25rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }),
        menuList: (provided) => ({
            ...provided,
            padding: 0,
        })
    };

    const options = sizes.map(size => ({
        value: size.id,
        label: size.name_size
    }));

    const handleMenuToggle = () => {
        setMenuIsOpen(prev => !prev); // Toggle menu on click
    };

    return (
        <Select
            value={options.find(option => option.value === selectedSize)}
            onChange={handleChange}
            options={options}
            styles={customStyles}
            placeholder="Chọn Kích Thước"
            menuIsOpen={menuIsOpen} // Control menu visibility
            onFocus={handleMenuToggle} // Open menu on focus
            onBlur={() => setMenuIsOpen(false)} // Close menu when focus is lost
        />
    );
};

export default SizeSelect;
