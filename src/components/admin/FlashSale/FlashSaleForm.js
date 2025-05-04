import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Switch } from '@headlessui/react';
import { Toaster, toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { AiOutlineSync, AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus, AiOutlineSave, AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai';

const FlashSaleCreate = () => {
  const history = useHistory();


  const [flashSale, setFlashSale] = useState({
    name_FS: '',
    discountPercent: '',
    created_date: '',
    expiration_date: '',
    status: '',
    displayOnWebsite: true,
  });


  const [selectedVariants, setSelectedVariants] = useState([]);


  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const onSelectProduct = (variant, productName) => {
    let updatedVariants = [...selectedVariants];


    const isSelected = updatedVariants.some((item) => item.variantId === variant.id);

    if (isSelected) {

      updatedVariants = updatedVariants.filter((item) => item.variantId !== variant.id);
    } else {

      updatedVariants.push({
        variantId: variant.id,
        productName: productName,
        color: variant.color.color_name,
        size: variant.size.name_size,
        quantity: variant.quantity,
        price: variant.price,
      });
    }

    setSelectedVariants(updatedVariants);
    localStorage.setItem('selectedVariants', JSON.stringify(updatedVariants));
  };



  const removeSelectedVariant = (variantId) => {
    const updatedVariants = selectedVariants.filter((item) => item.variantId !== variantId);
    setSelectedVariants(updatedVariants);
    localStorage.setItem('selectedVariants', JSON.stringify(updatedVariants));
  };
  const onSelectAllProductVariants = (productVariants, productName) => {
    let updatedVariants = [...selectedVariants];

    // Kiểm tra nếu tất cả các biến thể của sản phẩm đã được chọn
    const allSelected = productVariants.every((variant) =>
      updatedVariants.some((item) => item.variantId === variant.id)
    );

    if (allSelected) {
      // Nếu tất cả đã được chọn, bỏ chọn tất cả các biến thể
      updatedVariants = updatedVariants.filter((item) =>
        !productVariants.some((variant) => variant.id === item.variantId)
      );
    } else {
      // Nếu chưa chọn tất cả, thêm tất cả các biến thể vào danh sách
      productVariants.forEach((variant) => {
        if (!updatedVariants.some((item) => item.variantId === variant.id)) {
          updatedVariants.push({
            variantId: variant.id,
            productName: productName,
            color: variant.color.color_name,
            size: variant.size.name_size,


          });
        }
      });
    }

    setSelectedVariants(updatedVariants);
    localStorage.setItem('selectedVariants', JSON.stringify(updatedVariants));
  };


  const handleGoBack = () => {
    history.push('/admin/flash');
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlashSale({ ...flashSale, [name]: value });
  };

  // Validate
  // const validateForm = () => {
  //   if (!flashSale.name_FS) {
  //     toast.error('Tên chương trình không được để trống!');
  //     return false;
  //   }
  //   if (!flashSale.discountPercent || isNaN(flashSale.discountPercent) || flashSale.discountPercent <= 0) {
  //     toast.error('Phần trăm giảm giá phải là một số dương!');
  //     return false;
  //   }
  //   if (flashSale.discountPercent > 100) {
  //     toast.error('Phần trăm giảm giá không được lớn hơn 100!');
  //     return false;
  //   }
  //   if (!flashSale.created_date || !flashSale.expiration_date) {
  //     toast.error('Ngày bắt đầu và kết thúc không được để trống!');
  //     return false;
  //   }
  //   if (new Date(flashSale.created_date) > new Date(flashSale.expiration_date)) {
  //     toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
  //     return false;
  //   }
  //   if (selectedVariants.length === 0) {
  //     toast.error('Bạn phải chọn ít nhất một sản phẩm biến thể!');
  //     return false;
  //   }
  //   // Kiểm tra trùng lặp biến thể và khoảng thời gian
  //   const variantIds = selectedVariants.map(variant => variant.variantId);
  //   const hasDuplicateWithTimeConflict = selectedVariants.some((currentVariant, index) => {
  //     const duplicateIndex = variantIds.indexOf(currentVariant.variantId);

  //     if (duplicateIndex !== index) {
  //       const duplicateVariant = selectedVariants[duplicateIndex];

  //       // So sánh khoảng thời gian
  //       const currentStartDate = new Date(flashSale.created_date);
  //       const currentEndDate = new Date(flashSale.expiration_date);
  //       const duplicateStartDate = new Date(duplicateVariant.created_date);
  //       const duplicateEndDate = new Date(duplicateVariant.expiration_date);

  //       // Kiểm tra xem ngày bắt đầu hoặc ngày kết thúc có nằm trong khoảng ngày của biến thể trùng không
  //       if (
  //         (currentStartDate >= duplicateStartDate && currentStartDate <= duplicateEndDate) ||
  //         (currentEndDate >= duplicateStartDate && currentEndDate <= duplicateEndDate)
  //       ) {
  //         return true; // Có trùng cả id và khoảng thời gian
  //       }
  //     }
  //     return false;
  //   });

  //   if (hasDuplicateWithTimeConflict) {
  //     toast.error('Biến thể này đã tồn tại với khoảng thời gian giao nhau!');
  //     return false;
  //   }





  //   return true;
  // };
  // Kiểm tra trùng lặp biến thể và khoảng thời gian
  const validateForm = async () => {
    if (!flashSale.name_FS) {
      toast.error('Tên chương trình không được để trống!');
      return false;
    }
    if (!flashSale.discountPercent || isNaN(flashSale.discountPercent) || flashSale.discountPercent <= 0) {
      toast.error('Phần trăm giảm giá phải là một số dương!');
      return false;
    }
    if (flashSale.discountPercent > 100) {
      toast.error('Phần trăm giảm giá không được lớn hơn 100!');
      return false;
    }
    if (!flashSale.created_date || !flashSale.expiration_date) {
      toast.error('Ngày bắt đầu và kết thúc không được để trống!');
      return false;
    }
    if (new Date(flashSale.created_date) > new Date(flashSale.expiration_date)) {
      toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return false;
    }
    if (selectedVariants.length === 0) {
      toast.error('Bạn phải chọn ít nhất một sản phẩm biến thể!');
      return false;
    }
  
     // Kiểm tra trùng lặp trên backend cho các biến thể đã chọn
  try {
    const token = localStorage.getItem('jwtToken');
    const formatDate = (dateString) => new Date(dateString).toISOString();

    const response = await axios.post(
      'http://localhost:8080/admin/api/flashsales/check-conflict',
      {
        variantIds: selectedVariants.map((v) => v.variantId),
        startDate: formatDate(flashSale.created_date),
        endDate: formatDate(flashSale.expiration_date),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('Response from backend:', response.data); // Thêm log để kiểm tra phản hồi từ backend

    if (response.data.conflict) {
      const conflictingIds = response.data.conflictingVariantIds;
      const message = `${response.data.message}\nID các biến thể bị xung đột: ${conflictingIds.join(', ')}`;
      toast.error(message);
      return false;
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra xung đột:', error);
    toast.error('Lỗi khi kiểm tra xung đột!');
    return false;
  }

  return true;
};
  
  

  // const handleCreate = () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   const token = localStorage.getItem('jwtToken');

  //   // Chuyển đổi thời gian nhập về đúng múi giờ GMT+7 (Việt Nam)
  //   const createdDateVietnam = new Date(flashSale.created_date);
  //   createdDateVietnam.setHours(createdDateVietnam.getHours());

  //   const expirationDateVietnam = new Date(flashSale.expiration_date);
  //   expirationDateVietnam.setHours(expirationDateVietnam.getHours());

  //   const flashSaleData = {
  //     name_FS: flashSale.name_FS,
  //     discountPercent: flashSale.discountPercent,
  //     createdDate: createdDateVietnam.toISOString(),
  //     expirationDate: expirationDateVietnam.toISOString(),
  //     activitySales: selectedVariants.map(variant => ({
  //       discountPercent: flashSale.discountPercent,
  //       createdDate: createdDateVietnam.toISOString(),
  //       expirationDate: expirationDateVietnam.toISOString(),
  //       variantProductId: variant.variantId
  //     })),
  //     id_user: 1,
  //     status: flashSale.status
  //   };

  //   axios.post('http://localhost:8080/admin/api/flashsales', flashSaleData, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then(response => {
  //       console.log('Chương trình khuyến mãi tạo thành công:', response.data);
  //       localStorage.removeItem('selectedVariants');
  //       history.push('/admin/flash');
  //     })
  //     .catch(error => {
  //       console.error('Lỗi khi tạo chương trình khuyến mãi:', error);
  //       toast.error('Lỗi khi tạo chương trình!');
  //     });
  // };

  const handleCreate = async () => {
    const isValid = await validateForm(); // Đợi validateForm() hoàn tất và trả về kết quả
    if (!isValid) {
      return; // Nếu không hợp lệ, dừng việc tạo chương trình
    }
  
    const token = localStorage.getItem('jwtToken');
  
    const createdDateVietnam = new Date(flashSale.created_date);
    createdDateVietnam.setHours(createdDateVietnam.getHours());
  
    const expirationDateVietnam = new Date(flashSale.expiration_date);
    expirationDateVietnam.setHours(expirationDateVietnam.getHours());
  
    const flashSaleData = {
      name_FS: flashSale.name_FS,
      discountPercent: flashSale.discountPercent,
      createdDate: createdDateVietnam.toISOString(),
      expirationDate: expirationDateVietnam.toISOString(),
      activitySales: selectedVariants.map(variant => ({
        discountPercent: flashSale.discountPercent,
        createdDate: createdDateVietnam.toISOString(),
        expirationDate: expirationDateVietnam.toISOString(),
        variantProductId: variant.variantId
      })),
      id_user: 1,
      status: flashSale.status
    };
  
    axios.post('http://localhost:8080/admin/api/flashsales', flashSaleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        toast.success('Chương trình khuyến mãi tạo thành công:');
        localStorage.removeItem('selectedVariants');
        history.push('/admin/flash');
      })
      .catch(error => {
        console.error('Lỗi khi tạo chương trình khuyến mãi:', error);
        toast.error('Lỗi khi tạo chương trình!');
      });
  };
  




  const handleStatusChange = () => {
    setFlashSale({ ...flashSale, status: flashSale.status === 1 ? 0 : 1 });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isProductModalOpen) {
      fetchProducts();
    }
  }, [isProductModalOpen]);


  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.get('http://localhost:8080/user/api/variants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };


  const groupVariantsByProduct = (variants) => {
    const productMap = {};

    variants.forEach(variant => {
      const productId = variant.product.id;
      if (!productMap[productId]) {
        productMap[productId] = {
          product: variant.product,
          variants: [],
        };
      }
      productMap[productId].variants.push(variant);
    });

    return Object.values(productMap);
  };
  const handleDeleteActivitySale = (variantId) => {
    const token = localStorage.getItem('jwtToken');
    axios
      .delete(`http://localhost:8080/admin/api/activities/${variantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Xóa thành công, cập nhật lại danh sách sản phẩm
        toast.success('Đã xóa sản phẩm thành công!');
        removeSelectedVariant(variantId); // Xóa sản phẩm từ danh sách selectedVariants
      })
      .catch((error) => {
        console.error('Lỗi khi xóa sản phẩm biến thể:', error);
        toast.error('Lỗi khi xóa sản phẩm biến thể!');
      });
  };


  const filteredProducts = groupVariantsByProduct(products).filter((group) =>
    group.product.name_prod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="p-6 bg-gray-50 min-h-screen shadow-lg rounded-lg">
           <Toaster position="top-right"/>
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold flex items-center text-blue-600">
          Tạo chương trình giảm giá

        </h2>

        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleGoBack}
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 rounded-lg">

        <div className="col-span-2">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-medium">Tên Chương Trình</label>
              <input
                type="text"
                name="name_FS"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={flashSale.name_FS}
                onChange={handleChange}
                placeholder="Nhập tên chương trình"
              />
            </div>

            <div>
              <label className="block font-medium">Phần Trăm Giảm Giá (%)</label>
              <input
                type="number"
                name="discountPercent"
                className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"

                value={flashSale.discountPercent}
                onChange={handleChange}
                placeholder="Nhập phần trăm giảm giá"
              />
            </div>

            <div>
              <label className="block font-medium">Thời Gian Hiệu Lực</label>
              <div className="flex items-center gap-4">
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="created_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={flashSale.created_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="datetime-local"
                    name="expiration_date"
                    className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300 outline-none"
                    value={flashSale.expiration_date}
                    onChange={handleChange}
                  />
                </div>
              </div>


            </div>



            <div>
              <label className="block font-medium">Sản Phẩm Đã Chọn</label>
              <div className="space-y-2">
  {selectedVariants.length > 0 ? (
    selectedVariants.map((variant) => (
      <div
        key={variant.variantId}
        className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
      >
        <p>
          {/* Hiển thị thêm ID biến thể */}
          ID: {variant.variantId} - {variant.productName} - 
          <span
            className="w-4 h-4 rounded-full inline-block"
            style={{ backgroundColor: variant.color }}
          ></span> 
          {variant.color} - {variant.size}
        </p>
        <button
          onClick={() => removeSelectedVariant(variant.variantId)}
          className="text-red-500 hover:text-red-700 text-sm tab-button"
        >
          Xóa
        </button>
      </div>
    ))
  ) : (
    <p>Chưa có sản phẩm nào được chọn</p>
  )}
  <button
    type="button"
    onClick={() => setIsProductModalOpen(true)}  // Opens the modal when clicked
    className="bg-blue-500 text-white right px-4 py-2 rounded hover:bg-blue-600 transition tab-button"
  >
    Chọn sản phẩm
  </button>
</div>

            </div>
          </form>
        </div>

        {/* Summary Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center mb-2">Tóm tắt</h3>

          <p><strong>Chương trình:</strong> {flashSale.name_FS || '--'}</p>
          <p><strong>Giảm giá:</strong> {flashSale.discountPercent}%</p>
          <p>
            <strong>Thời hạn:</strong>
            {flashSale.created_date
              ? `Từ ${new Date(flashSale.created_date).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} ${new Date(flashSale.created_date).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}`
              : '--'}
            đến {flashSale.expiration_date
              ? `${new Date(flashSale.expiration_date).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} ${new Date(flashSale.expiration_date).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}`
              : '--'}
          </p>



          <p><strong>Sản phẩm biến thể:</strong> {selectedVariants.length > 0 ? selectedVariants.map(v => `${v.productName} (${v.color}, ${v.size})`).join(', ') : '--'}</p>

          {/* Status Switch */}
          <div className="flex items-center mt-6">
            <Switch
              checked={flashSale.status === 1}
              onChange={handleStatusChange}
              className={`${flashSale.status === 1 ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className={`${flashSale.status === 1 ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition`} />
            </Switch>
            <span className="ml-2 text-gray-700">Hiển thị trên website</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <button
          type="button"
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition tab-button"
        >
          Tạo Chương Trình
        </button>

        {/* <button
          type="button"
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition tab-button"
        >
          Quay lại
        </button> */}
      </div>

      {/* Product Search Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onRequestClose={() => setIsProductModalOpen(false)}
        contentLabel="Chọn sản phẩm"
        style={{
          content: {
            width: '600px',  // Smaller width
            height: '500px', // Control the height
            margin: 'auto',  // Center it
            padding: '20px', // Add some padding
            borderRadius: '8px',  // Rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Soft shadow for elevation
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',  // Dimmed background
          }
        }}
      >
        <h2 className="text-xl mb-4 text-center font-semibold">Tìm sản phẩm</h2>

        {/* Search bar inside modal */}
        <div className="mb-4 flex items-center justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên sản phẩm"
            className="border px-4 py-2 rounded-lg w-full max-w-md"
            style={{ fontSize: '14px', marginBottom: '10px' }}  // Adjust font size
          />
        </div>

        {/* Loading state */}
        {loading && <p>Đang tải sản phẩm...</p>}

        {/* Display product list */}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b text-left text-sm font-medium">Sản phẩm</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium">Tồn kho</th>
              <th className="px-4 py-2 border-b text-left text-sm font-medium">Giá</th>
              <th className="px-4 py-2 border-b text-center text-sm font-medium">Chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((group) => (
              <React.Fragment key={group.product.id}>
                {/* Display Product Info */}
                <tr className="bg-white hover:bg-gray-50 transition duration-150">
                  <td colSpan="3" className="px-4 py-2">
                    <div className="flex items-center">
                      <img src={group.product.image_prod} alt={group.product.name_prod} width="40" className="mr-2 rounded-lg" />
                      <div>
                        <p className="font-semibold text-gray-700">{group.product.name_prod}</p>
                        <p className="text-sm text-gray-500">ID sản phẩm: {group.product.id}</p> {/* Display Product ID */}
                        <p className="text-sm text-gray-500">Danh mục: {group.product.category.name_cate}</p>
                        <p className="text-sm text-gray-500">Thương hiệu: {group.product.brand.name_brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => onSelectAllProductVariants(group.variants, group.product.name_prod)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                    >
                      Chọn tất cả
                    </button>

                  </td>
                </tr>

                {/* Display Variants */}
                {group.variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-2 border-b text-sm">
                      {variant.color.color_name}       <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: variant.color.color_name }}
                      ></span> - {variant.size.name_size}
                      <p className="text-xs text-gray-500">ID: {variant.id}</p> {/* Display Variant ID */}
                    </td>
                    <td className="px-4 py-2 border-b text-sm">{variant.quantity}</td>
                    <td className="px-4 py-2 border-b text-sm">{variant.price.toLocaleString()} đ</td>
                    <td className="px-4 py-2 border-b text-center">
                      <input
                        type="checkbox"
                        checked={selectedVariants.some((item) => item.variantId === variant.id)}
                        onChange={() => onSelectProduct(variant, group.product.name_prod)}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Hoàn tất chọn
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashSaleCreate;
