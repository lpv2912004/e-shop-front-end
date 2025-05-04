import React from 'react';

const SizeGuide = () => {
  const sizeData = [
    {
      title: 'BẢNG SIZE CHUNG CHO NỮ',
      description: '* Đơn vị tính: cm, kg',
      table: [
        {
          headers: ['Size', 'XS', 'S', 'M', 'L', 'XL'],
          rows: [
            ['Chiều cao', '147-153', '150-155', '155-163', '160-165', '162-166'],
            ['Cân nặng', '38-43 kg', '41-46 kg', '47-52 kg', '53-58 kg', '59-64 kg'],
            ['Vòng ngực', '74-80', '79-82', '82-87', '88-94', '94-99'],
            ['Vòng mông', '82-88', '88-90', '90-94', '94-98', '98-102'],
          ],
        },
      ],
    },
    {
      title: 'BẢNG SIZE CHUNG CHO Nam',
      description: '* Đơn vị tính: cm, kg',
      table: [
        {
          headers: ['Size', 'S', 'M', 'L', 'XL', 'XXL'],
          rows: [
            ['Chiều cao', '162-168', '169-173', '171-175', '173-177', '175-179'],
            ['Cân nặng', '57-62 kg', '63-67 kg', '68-72 kg', '73-77 kg', '78-82 kg'],
            ['Vòng ngực', '84-88', '88-94', '94-98', '98-104', '104-107'],
            ['Vòng mông', '85-89', '90-94', '95-99', '100-104', '104-108'],
          ],
        },
      ],
    },
    {
      title: 'BẢNG SIZE CHUNG TRẺ EM',
      description: '* Đơn vị tính: cm, kg',
      table: [
        {
          headers: [
            'Size',
            '98 (2-2Y)',
            '104 (3-4Y)',
            '110 (4-5Y)',
            '116 (6Y)',
            '122 (7Y)',
            '128 (8Y)',
            '134 (9Y)',
            '140 (10-11Y)',
            '152 (11-12Y)',
            '164 (13-14Y)',
          ],
          rows: [
            ['Chiều cao (cm)', '95-101', '101-107', '107-113', '113-119', '119-125', '125-131', '131-137', '137-145', '145-157', '157-169'],
            ['Cân nặng (kg)', '13-15', '15-18', '18-22', '22-25', '25-28', '28-32', '32-36', '36-39', '39-46', '46-55'],
          ],
        },
      ],
    },
    // Add other categories as needed...
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">HƯỚNG DẪN CHỌN SIZE</h1>
      {sizeData.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          <p className="text-gray-500 italic mb-4">{section.description}</p>
          {section.table.map((table, idx) => (
            <div key={idx} className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {table.headers.map((header, headerIdx) => (
                      <th
                        key={headerIdx}
                        className="border border-gray-300 px-4 py-2 text-left bg-gray-200 font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border border-gray-300 px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SizeGuide;
