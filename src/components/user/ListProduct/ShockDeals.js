import React from 'react';
import LazyLoad from 'react-lazyload'; // Import react-lazyload

class ShockDeals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      pageSize: 8,  // Số sản phẩm mỗi trang
    };
  }

  handleViewVariantDetail = (variant) => {
    this.props.history.push(`/product/${variant.productId}`);
  };

  handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= this.getTotalPages()) {
      this.setState({ currentPage: newPage });
    }
  };

  getTotalPages = () => {
    const { shockDeals } = this.props;
    return Math.ceil(shockDeals.length / this.state.pageSize);
  };

  render() {
    const { shockDeals } = this.props;
    const { currentPage, pageSize } = this.state;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedDeals = shockDeals.slice(startIndex, startIndex + pageSize);

    return (
      <div className="mt-3">
        <h2 className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-xl font-bold text-start mb-4 px-2 py-4 sm:px-2 sm:py-4">
          Sản phẩm giảm giá
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 max-w-7xl px-2 py-4 sm:px-2 sm:py-4">
          {paginatedDeals.length > 0 ? (
            paginatedDeals.map((item, index) => (
              <div className="relative group" key={index}>
                <div
                  className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-sm bg-gray-200 group-hover:opacity-75"
                  onClick={() => this.handleViewVariantDetail(item)}
                >
                  {/* Lazy load ảnh sản phẩm */}
                  <LazyLoad height={200} offset={100} once>
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="object-cover object-center w-full h-full group-hover:opacity-75 cursor-pointer"
                    />
                  </LazyLoad>
                </div>
                <div className="mt-4">
                  <h3 className="text-pretty text-sm text-gray-700">
                    <button onClick={() => this.handleViewVariantDetail(item)}>
                      {item.productName}
                    </button>
                  </h3>
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-sm text-red-600 font-bold flex ">
                      {item.discountedPrice.toLocaleString()} đ
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {item.originalPrice.toLocaleString()} đ
                    </p>
                    <p className="text-red-900 font-bold py-1 text-sm rounded flex-shrink-0">
                      -{item.discountPercent}%
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Hiện tại chưa có chương trình.</p>
          )}
        </div>

        {shockDeals.length > 0 && (
          <div className="flex justify-center items-end space-x-4 mt-4 mb-4">
            <button
              onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-lg text-gray-500 disabled:text-gray-300"
            >
              &laquo;
            </button>

            {Array.from({ length: this.getTotalPages() }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => this.handlePageChange(index + 1)}
                className={`w-6 h-6 flex justify-center rounded-full text-md transition-all ${currentPage === index + 1
                    ? 'bg-slate-600 text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => this.handlePageChange(currentPage + 1)}
              disabled={currentPage === this.getTotalPages()}
              className="text-lg text-gray-500 disabled:text-gray-300"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ShockDeals;
