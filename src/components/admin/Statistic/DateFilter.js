import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate, handleFetchStatistics }) => {
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            // Tự động submit 
            handleFetchStatistics();
        }
    }, [selectedStartDate, selectedEndDate]);

    return (
        <div className="flex space-x-4 mb-6">
            <div>
                <label className="block mb-2">Từ ngày:</label>
                <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => {
                        setSelectedStartDate(date);
                        setStartDate(date.toISOString().split('T')[0]); 
                    }}
                    selectsStart
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    dateFormat="dd/MM/yyyy"
                    className="border px-4 py-2 rounded w-full"
                />
            </div>
            <div>
                <label className="block mb-2">Đến ngày:</label>
                <DatePicker
                    selected={selectedEndDate}
                    onChange={(date) => {
                        setSelectedEndDate(date);
                        setEndDate(date.toISOString().split('T')[0]); 
                    }}
                    selectsEnd
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    minDate={selectedStartDate}
                    dateFormat="dd/MM/yyyy"
                    className="border px-4 py-2 rounded w-full"
                />
            </div>
        </div>
    );
};

export default DateFilter;

//npm install react-datepicker