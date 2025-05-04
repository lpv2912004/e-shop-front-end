// import React, { useState, useEffect } from 'react';
// import { useHistory, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
// import {jwtDecode} from 'jwt-decode'; 
// import { toast, ToastContainer } from 'react-toastify'; // Import từ react-toastify
// import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
//     authDomain: "demoimg-2354e.firebaseapp.com",
//     projectId: "demoimg-2354e",
//     storageBucket: "demoimg-2354e.appspot.com",
//     messagingSenderId: "488841107147",
//     appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// const ProductVariantCreate = () => {
//     const history = useHistory();
//     const { id } = useParams();
//     const [productName, setProductName] = useState('');
//     const [colors, setColors] = useState([]);
//     const [sizes, setSizes] = useState([]);
//     const [flashSales, setFlashSales] = useState([]); // State để lưu danh sách Flash Sales
//     const [variants, setVariants] = useState([{
//         color: { id: '' },
//         size: { id: '' },
//         price: '',
//         quantity: '',
//         image_variant: '',
//         status_VP: 1,
//         description: '',
//         id_FlashSale: '', // Thêm Flash Sale ID
//     }]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [previewUrls, setPreviewUrls] = useState([]);
//     const [isUploading, setIsUploading] = useState([]);

//     useEffect(() => {
//         const token = localStorage.getItem('jwtToken');

//         if (!token) {
//             toast.error('Bạn chưa đăng nhập!');
//             history.push('/login');
//             return;
//         }

//         try {
//             const decodedToken = jwtDecode(token);
//             const currentTime = Date.now() / 1000;
//             if (decodedToken.exp < currentTime) {
//                 toast.error('Phiên đăng nhập đã hết hạn!');
//                 history.push('/login');
//                 return;
//             }
//         } catch (error) {
//             toast.error('Lỗi trong quá trình giải mã token!');
//             history.push('/login');
//             return;
//         }

//         if (id) {
//             // Fetch product name
//             axios.get(`http://localhost:8080/admin/api/products/${id}`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             })
//                 .then(response => setProductName(response.data.name_prod))
//                 .catch(() => toast.error('Lỗi khi lấy thông tin sản phẩm!'));

//             // Fetch colors
//             axios.get('http://localhost:8080/admin/api/colors', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             })
//                 .then(response => setColors(response.data))
//                 .catch(() => toast.error('Lỗi khi lấy danh sách màu sắc!'));

//             // Fetch sizes
//             axios.get('http://localhost:8080/admin/api/sizes', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             })
//                 .then(response => setSizes(response.data))
//                 .catch(() => toast.error('Lỗi khi lấy danh sách kích thước!'));

//             // Fetch Flash Sales
//             axios.get('http://localhost:8080/admin/api/flashsales', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             })
//                 .then(response => setFlashSales(response.data))
//                 .catch(() => toast.error('Lỗi khi lấy danh sách chương trình giảm giá!'));
//         }
//     }, [id, history]);

//     const handleChange = (index, e) => {
//         const { name, value } = e.target;
//         const updatedVariants = [...variants];
//         updatedVariants[index][name] = name === 'color' || name === 'size' || name === 'id_FlashSale' ? { id: value } : value;
//         setVariants(updatedVariants);
//     };

//     const handleImageChange = (index, e) => {
//         if (e.target.files[0]) {
//             const file = e.target.files[0];
//             const updatedImageFiles = [...imageFiles];
//             updatedImageFiles[index] = file;
//             setImageFiles(updatedImageFiles);

//             const updatedPreviewUrls = [...previewUrls];
//             updatedPreviewUrls[index] = URL.createObjectURL(file);
//             setPreviewUrls(updatedPreviewUrls);
//         }
//     };

//     const handleImageUpload = async (index) => {
//         if (!imageFiles[index]) {
//             toast.error('Vui lòng chọn hình ảnh trước khi tải lên!');
//             return '';
//         }

//         const updatedIsUploading = [...isUploading];
//         updatedIsUploading[index] = true;
//         setIsUploading(updatedIsUploading);

//         const storageRef = ref(storage, `images/${imageFiles[index].name}`);
//         try {
//             const snapshot = await uploadBytes(storageRef, imageFiles[index]);
//             const downloadURL = await getDownloadURL(snapshot.ref);

//             updatedIsUploading[index] = false;
//             setIsUploading([...updatedIsUploading]);

//             return downloadURL;
//         } catch (error) {
//             toast.error('Lỗi khi tải hình ảnh!');
//             updatedIsUploading[index] = false;
//             setIsUploading([...updatedIsUploading]);
//             return '';
//         }
//     };

//     const handleAddVariant = () => {
//         for (let variant of variants) {
//             if (!variant.color.id || !variant.size.id || !variant.price || !variant.quantity) {
//                 toast.error('Vui lòng hoàn tất thông tin biến thể hiện tại trước khi thêm biến thể mới!');
//                 return;
//             }
//         }

//         setVariants([
//             ...variants,
//             {
//                 color: { id: '' },
//                 size: { id: '' },
//                 price: '',
//                 quantity: '',
//                 image_variant: '',
//                 status_VP: 1,
//                 description: '',
//                 id_FlashSale: '', // Thêm ID Flash Sale
//             }
//         ]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         for (let variant of variants) {
//             if (!variant.color.id || !variant.size.id || variant.price <= 0 || variant.quantity <= 0) {
//                 toast.error('Vui lòng nhập thông tin hợp lệ cho các biến thể!');
//                 return;
//             }
//         }

//         const token = localStorage.getItem('jwtToken');
//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken.id_user;

//         const variantPromises = variants.map(async (variant, index) => {
//             let imageUrl = variant.image_variant;

//             if (imageFiles[index]) {
//                 imageUrl = await handleImageUpload(index);
//                 if (!imageUrl) {
//                     toast.error(`Tải ảnh lên thất bại cho biến thể thứ ${index + 1}!`);
//                     return;
//                 }
//             }

//             const variantData = {
//                 ...variant,
//                 image_variant: imageUrl,
//                 product: { id: id },
//                 createdBy: userId,
//             };

//             return axios.post('http://localhost:8080/admin/api/variant_products', variantData, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//         });

//         Promise.all(variantPromises)
//             .then(() => {
//                 toast.success('Tạo các biến thể thành công!');
//                 history.push('/admin/products');
//             })
//             .catch(() => toast.error('Tạo biến thể thất bại! Vui lòng thử lại.'));
//     };

//     return (
//         <div className="p-6">
//             <ToastContainer />
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Tạo biến thể mới cho sản phẩm: {productName}</h2>
//                 <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => history.goBack()}>
//                     Quay lại
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
//                 {variants.map((variant, index) => (
//                     <div key={index} className="grid grid-cols-3 gap-4 mb-4">
//                         <div className="col-span-2">
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Màu sắc</label>
//                                 <select 
//                                     name="color"
//                                     className="w-full border px-4 py-2 rounded mt-1"
//                                     value={variant.color.id}
//                                     onChange={(e) => handleChange(index, e)}
//                                 >
//                                     <option value="">Chọn màu sắc</option>
//                                     {colors.map(color => (
//                                         <option key={color.id} value={color.id}>
                                           
//                                             <div className='w-15 h-15' style={{backgroundColor: color.color_name}}></div>
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Kích thước</label>
//                                 <select 
//                                     name="size"
//                                     className="w-full border px-4 py-2 rounded mt-1"
//                                     value={variant.size.id}
//                                     onChange={(e) => handleChange(index, e)}
//                                 >
//                                     <option value="">Chọn kích thước</option>
//                                     {sizes.map(size => (
//                                         <option key={size.id} value={size.id}>
//                                             {size.name_size}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Flash Sale</label>
//                                 <select 
//                                     name="id_FlashSale"
//                                     className="w-full border px-4 py-2 rounded mt-1"
//                                     value={variant.id_FlashSale.id}
//                                     onChange={(e) => handleChange(index, e)}
//                                 >
//                                     <option value="">Chọn chương trình giảm giá</option>
//                                     {flashSales.map(flashSale => (
//                                         <option key={flashSale.id} value={flashSale.id}>
//                                             {flashSale.name_FS}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="flex flex-col items-center">
//                             <label className="block text-gray-700">Hình ảnh</label>
//                             <input 
//                                 type="file" 
//                                 name="image_variant"
//                                 className="hidden"
//                                 id={`imageUpload-${index}`}
//                                 onChange={(e) => handleImageChange(index, e)}
//                             />
//                             <label 
//                                 htmlFor={`imageUpload-${index}`}
//                                 className="w-32 h-32 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center rounded cursor-pointer"
//                             >
//                                 {previewUrls[index] ? (
//                                     <img src={previewUrls[index]} alt="Preview" className="w-full h-full object-cover rounded" />
//                                 ) : (
//                                     <span className="text-gray-500">Chọn ảnh</span>
//                                 )}
//                             </label>
//                             {isUploading[index] && <p>Đang tải lên...</p>}
//                         </div>
//                         <div className="col-span-3">
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Giá</label>
//                                 <input 
//                                     type="number" 
//                                     name="price"
//                                     className="w-full border px-4 py-2 rounded mt-1" 
//                                     value={variant.price} 
//                                     onChange={(e) => handleChange(index, e)}
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Số lượng</label>
//                                 <input 
//                                     type="number" 
//                                     name="quantity"
//                                     className="w-full border px-4 py-2 rounded mt-1" 
//                                     value={variant.quantity} 
//                                     onChange={(e) => handleChange(index, e)}
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700">Mô tả biến thể</label>
//                                 <textarea 
//                                     name="description"
//                                     className="w-full border px-4 py-2 rounded mt-1" 
//                                     value={variant.description} 
//                                     onChange={(e) => handleChange(index, e)}
//                                 ></textarea>
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 <button type="button" className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={handleAddVariant}>
//                     Thêm biến thể mới
//                 </button>

//                 <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded ${isUploading.some(status => status) ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isUploading.some(status => status)}>
//                     Tạo các biến thể
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default ProductVariantCreate;
