import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FaHeart } from "react-icons/fa";

class MyFavorite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isLiked: {},
      isSelectingMultiple: false, // Trạng thái cho chế độ chọn nhiều
      selectedProducts: [], // Sản phẩm đã chọn để bỏ thích
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const id_user = decodedToken.id_user;

      axios
        .get(`http://localhost:8080/user/api/like/favorites/${id_user}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const products = response.data.map((product) => ({
            ...product,
            isLiked: true,
          }));
          this.setState({
            products,
          });
        })
        .catch((error) => {
          console.error("Error fetching favorite products:", error);
          toast.error("Không thể tải danh sách sản phẩm yêu thích.");
        });
    } else {
      toast.error("Bạn cần đăng nhập.");
      this.props.history.push("/login");
    }
  }

  toggleLikeProduct = (productId) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const id_user = decodedToken.id_user;

      axios
        .post(
          `http://localhost:8080/user/api/like/${id_user}/${productId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const updatedProduct = response.data;
          this.setState((prevState) => ({
            products: prevState.products.map((product) =>
              product.id === productId
                ? { ...product, isLiked: updatedProduct.isLiked }
                : product
            ),
          }));
          toast.success(
            updatedProduct.isLiked ? "Đã thêm vào yêu thích" : "Đã bỏ thích"
          );
        })
        .catch((error) => {
          console.error("Error liking/unliking the product:", error);
          toast.error("Không thể thay đổi trạng thái thích.");
        });
    } else {
      toast.error("Bạn cần đăng nhập.");
      this.props.history.push("/login");
    }
  };

  toggleSelectMultiple = () => {
    this.setState((prevState) => ({
      isSelectingMultiple: !prevState.isSelectingMultiple,
      selectedProducts: [], // Reset lại danh sách đã chọn khi hủy chọn nhiều
    }));
  };

  handleSelectProduct = (productId) => {
    this.setState((prevState) => {
      const selectedProducts = prevState.selectedProducts.includes(productId)
        ? prevState.selectedProducts.filter((id) => id !== productId)
        : [...prevState.selectedProducts, productId];
      return { selectedProducts };
    });
  };

  handleRemoveSelected = () => {
    const { selectedProducts } = this.state;
    const token = localStorage.getItem("jwtToken");

    if (token && selectedProducts.length > 0) {
      const decodedToken = jwtDecode(token);
      const id_user = decodedToken.id_user;

      axios
        .post(
          `http://localhost:8080/user/api/like/unlike-multiple/${id_user}`,
          { productIds: selectedProducts }, // Đảm bảo gửi đúng định dạng JSON
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Đảm bảo rằng yêu cầu gửi dưới dạng JSON
            },
          }
        )
        .then((response) => {
          // Cập nhật lại danh sách sản phẩm: loại bỏ những sản phẩm đã bỏ thích
          const updatedProducts = this.state.products.filter(
            (product) => !selectedProducts.includes(product.id)
          );
          this.setState({
            products: updatedProducts,
            selectedProducts: [],
            isSelectingMultiple: false,
          });
          toast.success("Đã bỏ thích các sản phẩm đã chọn.");
        })
        .catch((error) => {
          console.error("Error unliking selected products:", error);
          toast.error("Không thể bỏ thích các sản phẩm.");
        });
    }
  };

  render() {
    const { products, isSelectingMultiple, selectedProducts } = this.state;

    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center mt-4">
            <p className="underline decoration-solid text-2xl font-sans mb-5">
              Sản phẩm yêu thích
            </p>
            <button
              type="button"
              onClick={
                selectedProducts.length > 0
                  ? this.handleRemoveSelected
                  : this.toggleSelectMultiple
              }
              className="inline-block rounded-full bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-dark-3 transition duration-150 ease-in-out hover:bg-neutral-700"
            >
              {isSelectingMultiple
                ? selectedProducts.length > 0
                  ? "Bỏ thích"
                  : "Hủy chọn nhiều"
                : "Chọn nhiều"}
            </button>
          </div>
          {products.length === 0 ? (
            <p>Bạn chưa yêu thích sản phẩm nào.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <a href={`/product/${product.id}`} className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        alt={product.name_prod}
                        src={product.image_prod}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                  </a>
                  <div className="flex justify-between items-center mt-4">
                    <h2 className="mt-4 text-sm text-gray-700 font-bold text-xl">
                      {product.name_prod}
                    </h2>
                    {isSelectingMultiple ? (
                      <input
                        type="checkbox"
                        style={{ width: "16px", height: "16px", transform: "scale(1.5)" }}
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => this.handleSelectProduct(product.id)}
                      />
                    ) : (
                      <button
                        onClick={() => this.toggleLikeProduct(product.id)}
                        className="flex items-center space-x-1 text-gray-600"
                      >
                        <FaHeart
                          size={24}
                          className={product.isLiked ? "text-red-500" : ""}
                        />
                        <span>{product.isLiked ? "Đã thích" : "Thích"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(MyFavorite);
