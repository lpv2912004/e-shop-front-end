import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelExport = ({ data, fileName = 'data.xlsx', sheetName = 'Sheet1' }) => {

    const handleExportToExcel = () => {
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

  
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };

    return (
        <button
            onClick={handleExportToExcel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Export to Excel
        </button>
    );
};

export default ExcelExport;
