import React from 'react';

const BrandLogos = () => {
  const brands = [

    { id: 2, name: 'Fendi', logo: 'https://theme.hstatic.net/200000696635/1001257291/14/brand_2.jpg?v=100' },
    { id: 3, name: 'Dolo Men', logo: 'https://theme.hstatic.net/200000696635/1001257291/14/brand_3.jpg?v=100' },
    { id: 4, name: 'Venice', logo: 'https://theme.hstatic.net/200000696635/1001257291/14/brand_4.jpg?v=100' },
    { id: 5, name: 'Owen', logo: 'https://theme.hstatic.net/200000696635/1001257291/14/brand_5.jpg?v=100' },
  ];

  return (
    <div className=" bg-white mx-auto max-w-7xl mt-2">
      <div className="flex justify-around items-center flex-wrap">
        {brands.map((brand) => (
          <div key={brand.id} className="p-4">
            <img src={brand.logo} alt={brand.name} className="h-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandLogos;
