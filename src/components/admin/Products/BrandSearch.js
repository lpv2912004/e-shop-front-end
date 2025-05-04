import { useState } from "react";

function SearchableBrandDropdown({ brands, product, setProduct }) {
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng dropdown
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm

    const handleSelect = (brandId) => {
        setProduct((prev) => ({
            ...prev,
            brandId: brandId.toString(), // Cập nhật brandId dưới dạng chuỗi
        }));
        setIsOpen(false); // Đóng dropdown sau khi chọn
        console.log("Selected brandId:", brandId.toString());
    };

    const filteredBrands = brands.filter((brand) =>
        brand.name_brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative mb-2">
            <label className="block text-gray-700">Thương hiệu</label>
            <div
                className="w-full border border-gray-300 px-4 py-2 rounded cursor-pointer"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
            >
                {product.brandId
                    ? brands.find((b) => b.id.toString() === product.brandId)?.name_brand || "Chọn thương hiệu"
                    : "Chọn thương hiệu"}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow">
                    <input
                        type="text"
                        className="w-full border-b px-4 py-2 focus:outline-none"
                        placeholder="Tìm kiếm thương hiệu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-40 overflow-y-auto">
                        {filteredBrands.map((brand) => (
                            <li
                                key={brand.id.toString()} // Key là chuỗi
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(brand.id.toString())} // Chuyển thành chuỗi
                            >
                                {brand.name_brand}
                            </li>
                        ))}
                        {filteredBrands.length === 0 && (
                            <li className="px-4 py-2 text-gray-500">Không tìm thấy thương hiệu</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableBrandDropdown;
