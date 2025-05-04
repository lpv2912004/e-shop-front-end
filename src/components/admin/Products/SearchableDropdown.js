import { useState } from "react";

function SearchableDropdown({ categories, product, setProduct }) {
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng dropdown
    const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm

    const handleSelect = (categoryId) => {
        setProduct((prev) => ({
            ...prev,
            categoryId: categoryId.toString(), // Chuyển thành chuỗi
        }));
        setIsOpen(false); // Đóng dropdown sau khi chọn
        console.log("Selected categoryId:", categoryId.toString()); // Log chuỗi
    };

    const filteredCategories = categories.filter((category) =>
        category.name_cate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative mb-2">
            <label className="block text-gray-700">Loại sản phẩm</label>
            <div
                className="w-full border border-gray-300 px-4 py-2 rounded cursor-pointer"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
            >
                {product.categoryId
                    ? categories.find((cat) => cat.id.toString() === product.categoryId)?.name_cate || "Chọn loại sản phẩm"
                    : "Chọn loại sản phẩm"}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow">
                    <input
                        type="text"
                        className="w-full border-b px-4 py-2 focus:outline-none"
                        placeholder="Tìm kiếm loại sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="max-h-40 overflow-y-auto">
                        {filteredCategories.map((category) => (
                            <li
                                key={category.id.toString()} // Sử dụng chuỗi làm key
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(category.id.toString())} // Chuyển thành chuỗi khi gọi handleSelect
                            >
                                {category.name_cate}
                            </li>
                        ))}
                        {filteredCategories.length === 0 && (
                            <li className="px-4 py-2 text-gray-500">Không tìm thấy loại sản phẩm</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableDropdown;
