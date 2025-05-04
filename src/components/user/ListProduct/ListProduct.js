import React, { useState, useEffect, Component } from 'react';
import { storage } from '../StorageImageText/TxtImageConfig';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Features from './Features';
import CouponsList from './CouponsList';
import FashionCategories from './FashionCategories';
import BrandLogos from './BrandLogos';
import NewsSection from './NewsSection';
class ListProduct extends Component {
  constructor(props) {

    super(props);
    this.state = {
      imageUpload: null,
      imageList: [],
      listProduct: [],
      shockDeals: [],
      newProducts: [],
     
      currentPage: 1,
      pageSize: 8,  
      totalPages: 0
    };
    this.imageListRef = ref(storage, 'images/');
    this.fetchImageList = this.fetchImageList.bind(this);
  }

  async componentDidMount() {
    try {

    } catch (error) {

    }
    let productRes = await axios.get('http://localhost:8080/user/api/products1');
    const products = productRes ? productRes.data : [];

   
    const totalPages = Math.ceil(products.length / this.state.pageSize);

    this.setState({
      listProduct: products,
      totalPages
    });

 
    let saleRes = await axios.get('http://localhost:8080/user/api/variants/onsale');
    const shockDeals = Array.isArray(saleRes.data) ? saleRes.data : [];
    const newProducts = products.filter(product => product.isNew);
    this.setState({ shockDeals, newProducts });

    this.fetchImageList();
  }

  handleViewDetail = (item) => {
    this.props.history.push(`/product/${item.id}`);
  };
  handleViewVariantDetail = (variant) => {
    this.props.history.push(`/product/${variant.productId}`); 
  };
  fetchImageList() {
    listAll(this.imageListRef).then((response) => {
      const fetchUrls = response.items.map((item) => getDownloadURL(item));
      Promise.all(fetchUrls).then((urls) => {
        this.setState({ imageList: urls });
      });
    });
  }


  handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= this.state.totalPages) {
      this.setState({ currentPage: newPage });
    }
  }

  render() {
    const { listProduct, shockDeals, newProducts, currentPage, pageSize, totalPages } = this.state;
   
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = listProduct.slice(startIndex, startIndex + pageSize);

    return (
      <>
        <div className="deal-section mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">

          <Features />

          <CouponsList />

          <FashionCategories />

          <div className="mt-3">
            <h2 className="text-3xl text-center mb-4">DEAL SỐC</h2>
            {/* <h2 className="text-center-3xl font-bold tracking-tight text-gray-900 mt-8">DEAL SỐC</h2> */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {shockDeals.length > 0 ? (
                shockDeals.map((item, index) => (
                  <div className="relative group" key={index}>
                    <div
                      className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80"
                      onClick={() => this.handleViewVariantDetail(item)} // Thêm sự kiện onClick để chuyển hướng
                    >
                      <img
                        onClick={() => this.handleViewVariantDetail(item)}
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm text-gray-700 ">
                        <button onClick={() => this.handleViewVariantDetail(item)}>
                          {item.productName}
                        </button>
                      </h3>
                      <p className="text-sm text-red-500 font-bold">{item.discountPercent}% OFF</p>
                      <p className="text-sm text-gray-500 line-through">{item.originalPrice} đ</p>
                      <p className="text-sm text-green-500 font-bold">{item.discountedPrice} đ</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Shock Deals Available</p>
              )}
            </div>

          </div>
        </div>

    
        <div className="banner-section mx-auto max-w-7xl">
          <div className="flex justify-center items-center bg-green-100">
            <div className="text-center">
              <h2 className="text-4xl font-bold">Áo Phông Đa Sắc Màu</h2>
              <p className="mt-2 text-lg">Đón nắng hè rực rỡ</p>
              <p>Cotton USA cao cấp - Co giãn đa chiều</p>
            </div>
            <img src="https://media.canifa.com/Simiconnector/Ao_phong_block_home_desktop-29.07.webp" alt="Áo Phông Đa Sắc Màu" className="h-64 object-cover" />
          </div>
        </div>


        <div className="all-products-section mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-3xl text-center mb-4">TẤT CẢ SẢN PHẨM</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {paginatedProducts.map((item, index) => (
              <div className="relative group" key={index}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                  <img onClick={() => this.handleViewDetail(item)} src={item.image_prod} alt={item.name_prod} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm text-gray-700">
                    <button onClick={() => this.handleViewDetail(item)}>{item.name_prod}</button>
                  </h3>
                </div>
              </div>
            ))}
          </div>


          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4">
            {/* Previous Arrow */}
            <button
              onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-lg text-gray-500 disabled:text-gray-300"
            >
              &laquo;
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => this.handlePageChange(index + 1)}
                className={`w-8 h-8 flex justify-center items-center rounded-full text-md transition-all ${currentPage === index + 1
                  ? 'bg-black text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Arrow */}
            <button
              onClick={() => this.handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-lg text-gray-500 disabled:text-gray-300"
            >
              &raquo;
            </button>
          </div>


        </div>


        <div className="banner-section mx-auto max-w-7xl">

          <img src="https://theme.hstatic.net/200000696635/1001257291/14/imgtext_2_img.jpg?v=100" alt="Áo Phông Đa Sắc Màu" />

        </div>
        <BrandLogos />
        <NewsSection />
      </>
    );
  }
}

export default withRouter(ListProduct);
