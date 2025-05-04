import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import LoadingSpinner from './LoadingSpinner';

// import của user
import Home from './pages/User/Home/Home';
import Login from './pages/User/Account/Login';
import ProductDetail from './pages/User/Product/ProductDetail';
import CartDetail from './pages/User/Cart/CartDetail';
import LayoutProfile from './pages/User/Profile/LayoutProfile';
import Checkout from './pages/User/Checkout/Checkout';
import OrderSuccess from './pages/User/Checkout/OrderSuccess';
import MyToastContainer from './MyToastContainer';
import 'react-toastify/dist/ReactToastify.css';
// import Contact from './pages/User/Contact/Contact';
import Slide from './pages/Admin/Slide/Slide';

//phan cua phat
import Dangky from './pages/User/Account/dangky';
import Otp from './pages/User/Account/otpdangky';
import ResetPass from './pages/User/Account/resetpassword';

import Register from './pages/User/Account/Register';
import EmailRegister from './pages/User/Account/EmailRegister';
import OtpRegister from './pages/User/Account/OtpRegister';

//phần của Minh
import AdminBrand from './pages/Admin/Brand/BrandMain';
import BrandCreate from './pages/Admin/Brand/BrandCreate';
import BrandUpdate from './pages/Admin/Brand/BrandUpdate';
import AdminColor from './pages/Admin/Color/ColorMain';
import ColorCreate from './pages/Admin/Color/ColorCreate';
import ColorUpdate from './pages/Admin/Color/ColorUpdate';
import AdminSize from './pages/Admin/Size/SizeMain';
import SizeCreate from './pages/Admin/Size/SizeCreate';
import SizeUpdate from './pages/Admin/Size/SizeUpdate';
import AdminCategory from './pages/Admin/Category/CategoryMain';
import CategoryCreate from './pages/Admin/Category/CategoryCreate';
import CategoryUpdate from './pages/Admin/Category/CategoryUpdate';
import AdminUsers from './pages/Admin/Users/UsersMain';


// import của admin
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import AdminProducts from './pages/Admin/Products/ProductsMain';
import ProductVariantsUpdate from './pages/Admin/Products/ProductVariants';
import ProductCreate from './pages/Admin/Products/ProductCreate';

import PrivateRoute from './components/admin/PrivateRoute/PrivateRoute';
import NotFoundPage from './components/admin/PrivateRoute/404'; // Trang 404
import UpdateProduct from './pages/Admin/Products/ProductsUpdate';
// import ProductVariantCreate from './pages/Admin/Products/ProductCreateVariants';
import Profile from './pages/Admin/Profile/Profile';
import Feedback from './pages/Admin/Feedback/Feedback';
import VouchersCreate from './pages/Admin/Vouchers/VoucherCreate';
import VoucherM from './pages/Admin/Vouchers/VoucherMain';
import Transactions from './pages/Admin/Transactions/Transactions';
import Statistical from './pages/Admin/Statistic/Statistical';
import Order from './pages/Admin/Order/Order';
import FlashSale from './pages/Admin/FlashSale/FlashSaleManagement';
import FlashSaleCreate from './pages/Admin/FlashSale/FlashSaleForm';
import FlashSaleDetail from './pages/Admin/FlashSale/FlashSaleDetail';
import MyFavoritePage from './pages/User/Favorite/MyFavoritePage';
import Blog from './pages/User/Blog/Blog';
import Support from './pages/User/Support/Support';

import Vouchers from './pages/User/AllCouponList/AllCouponList';
import SizeGuide from './pages/User/SizePage/SizePage';
import PrivacyPolicy from './pages/User/Protect/Protect';


// import SettingPage from './pages/Admin/Setting/Setting';
import { ToastContainer, toast } from 'react-toastify';
// tính năng cuộn
import ScrollToTop from './ScrollToTop';
// tính năng load trang

import 'nprogress/nprogress.css';

import SearchProducts from './pages/User/SearchProducts/MainSearch';

navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {

  })
  .catch((err) => {
    console.log("Service Worker registration failed:", err);
  });





const App = () => {
  const [loading, setLoading] = useState(false); // Trạng thái đang tải trang

  return (
    <>
      <MyToastContainer position="top-right" style={{ zIndex: 9999 }} />
      <BrowserRouter>

        <ScrollToTop />
        <NProgressHandler setLoading={setLoading} /> {/* NProgressHandler để quản lý hiệu ứng load */}
        {loading && <LoadingSpinner />} {/* Chỉ hiển thị LoadingSpinner khi đang loading */}
        <div className="App">
          <Switch>
            {/* trang user */}
            {/* trang user */}
            <Route path='/home' exact><Home /></Route>
            <Route path='/login' exact><Login /></Route>
            <Route path='/register' exact><Register /></Route>
            <Route path='/product/:id' exact><ProductDetail /></Route>
            <Route path='/mycart' exact><CartDetail /></Route>
            <Route path='/myprofile' exact><LayoutProfile /></Route>
            <Route path='/checkout' exact><Checkout /></Route>
            <Route path='/success' exact><OrderSuccess /></Route>
            <Route path='/search' exact><SearchProducts /></Route>
            {/* dia chi */}
            <Route path='/myaddress' exact></Route>
            {/* phan cua phat */}
            {/* forgotPassword */}
            <Route path='/forgot' exact><Dangky /></Route>
            <Route path='/otpexact' exact><Otp /></Route>
            <Route path='/resetpass' exact><ResetPass /> </Route>
            {/* Register */}
            <Route path='/emailRG' exact><EmailRegister /></Route>
            <Route path='/otpregis' exact><OtpRegister /></Route>
            <Route path='/register' exact><Register /></Route>
            <Route path='/MyFavorite' exact><MyFavoritePage /></Route>
            <Route path='/blog' exact><Blog /></Route>
            <Route path='/support' exact><Support /></Route>

            <Route path='/vouchers' exact><Vouchers/></Route>
            <Route path='/size-guide' exact><SizeGuide/></Route>
            <Route path='/privacy-policy' exact><PrivacyPolicy/></Route>

            {/* Trang admin */}
            <PrivateRoute path='/admin/dashboard' exact component={AdminDashboard} />
            <PrivateRoute path='/admin/users' exact component={AdminUsers} />
            <PrivateRoute path='/admin/products' exact component={AdminProducts} />
            <PrivateRoute path='/admin/create-product' exact component={ProductCreate} />
            <PrivateRoute path='/admin/update-product' exact component={ProductVariantsUpdate} />
            <PrivateRoute path='/admin/profile' exact component={Profile} />
            <PrivateRoute path='/admin/statistics' exact component={Statistical} />
            <PrivateRoute path='/admin/transactions' exact component={Transactions} />
            <PrivateRoute path='/admin/orders' exact component={Order} />
            <PrivateRoute path='/admin/feedbacks' exact component={Feedback} />
            <PrivateRoute path='/admin/vouchers-create' exact component={VouchersCreate} />
            <PrivateRoute path='/admin/vouchers-main' exact component={VoucherM} />
            <PrivateRoute path='/admin/flash' exact component={FlashSale} />
            <PrivateRoute path='/admin/flash' exact component={FlashSale} />
            <PrivateRoute path='/admin/flash-create' exact component={FlashSaleCreate} />
            <PrivateRoute path="/admin/flash-detail/:id" exact component={FlashSaleDetail} />
            <Route path='/admin/update-product/:id' exact component={UpdateProduct} />
            {/* <Route path="/admin/add-variant/:id" component={ProductVariantCreate} /> */}

            <PrivateRoute path="/admin/slide" exact component={Slide} />

            {/* Phần của Minh */}
            <PrivateRoute path='/admin/categories' exact component={AdminCategory} />
            <PrivateRoute path='/admin/create-category' exact component={CategoryCreate} />
            <PrivateRoute path='/admin/update-category/:id' exact component={CategoryUpdate} /> <PrivateRoute path='/admin/brands' exact component={AdminBrand} />
            <PrivateRoute path='/admin/create-brand' exact component={BrandCreate} />
            <PrivateRoute path='/admin/update-brand/:id' exact component={BrandUpdate} />
            <PrivateRoute path='/admin/colors' exact component={AdminColor} />
            <PrivateRoute path='/admin/create-color' exact component={ColorCreate} />
            <PrivateRoute path='/admin/update-color/:id' exact component={ColorUpdate} />
            <PrivateRoute path='/admin/sizes' exact component={AdminSize} />
            <PrivateRoute path='/admin/create-size' exact component={SizeCreate} />
            <PrivateRoute path='/admin/update-size/:id' exact component={SizeUpdate} />
            <PrivateRoute path='/admin/users' exact component={AdminUsers} />
            <PrivateRoute path='/admin/users/:id/status' exact component={AdminUsers} />
            <PrivateRoute path='/admin/statistics' exact component={Statistical} />


            {/* trang không tồn tại */}
            <Route path="/404" component={NotFoundPage} />

            {/* bắt lỗi trả về */}
            <Redirect from="/admin" to="/admin/dashboard" />
            <Redirect from="/" to="/home" />
            <Redirect to="/404" />
          </Switch>
        </div>
      </BrowserRouter>

    </>
  );
};


// Component để quản lý NProgress và trạng thái loading
const NProgressHandler = ({ setLoading }) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      NProgress.start();
      setLoading(true); // Bắt đầu hiển thị spinner khi điều hướng

      // Kết thúc quá trình loading sau 1 giây (hoặc điều chỉnh tùy ý)
      setTimeout(() => {
        NProgress.done();
        setLoading(false); // Ẩn spinner sau khi trang được tải
      }, 100);
    });

    return () => {
      unlisten();
    };
  }, [history, setLoading]);

  return null; // Không cần render gì cả, chỉ để lắng nghe sự kiện điều hướng
};

export default App;
