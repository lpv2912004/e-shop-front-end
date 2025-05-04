import React, { useState } from 'react';
import Select from 'react-select';

const StatusSelect = ({ variant, handleFieldChange }) => {
    const options = [
        { value: 0, label: 'Ngừng bán' },
        { value: 1, label: 'Đang bán' }
    ];

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
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }),
        menuList: (provided) => ({
            ...provided,
            padding: 0,
        })
    };

    return (
        <div>
            <Select

                value={options.find(option => option.value === (variant.status_VP === 1 ? 1 : 0))}
                onChange={selectedOption => handleFieldChange(variant.id, 'status_VP', selectedOption.value)}
                options={options}
                styles={customStyles}
                placeholder="Chọn trạng thái"
                isSearchable={false}
            />
        </div>
    );
};

export default StatusSelect;
