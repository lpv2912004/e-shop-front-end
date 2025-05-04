import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chatbot from "./chatbotUser";
import { faFacebookF, faInstagram, faYoutube, faTiktok, faCcVisa, faCcMastercard, faCcPaypal } from '@fortawesome/free-brands-svg-icons';
class Footer extends React.Component {
    render() {
        return (
            <footer className="text-gray-800  pt-8 pb-4 border-t bg-white ">
                <div className="container mx-auto max-w-7xl px-2 py-4 sm:px-2 sm:py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h6 className="font-bold text-lg mb-4">CÔNG TY CỔ PHẦN MAOU</h6>
                            <p>Địa chỉ: ĐT923, Thị trấn Phong Điền, Phong Điền, Cần Thơ, Việt Nam</p>
                            <p>Điện thoại: +84779- 602.365</p>
                            <p>Email: nnhut2705@gmail.com</p>
                            <p className="mt-4 text-gray-600">© 2024 MAOU</p>
                        </div>

                        <div>
                            <h6 className="font-bold text-lg mb-4">THƯƠNG HIỆU</h6>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-700 hover:underline">Giới thiệu</a></li>
                                <li><a href="/blog" className="text-gray-700 hover:underline">Tin tức</a></li>
                                <li><a href="/support" className="text-gray-700 hover:underline">Liên hệ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h6 className="font-bold text-lg mb-4">HỖ TRỢ</h6>
                            <ul className="space-y-2">
                                <li><a href="/support" className="text-gray-700 hover:underline">Hỏi đáp</a></li>
                                <li><a href="/size-guide" className="text-gray-700 hover:underline">Lựa chọn kích thước</a></li>
                                <li><a href="/privacy-policy" className="text-gray-700 hover:underline">Chính sách bảo mật</a></li>
                            </ul>
                        </div>

                        <div>

                            <h6 className="font-bold text-lg">PHƯƠNG THỨC THANH TOÁN</h6>
                            <div className="flex space-x-4 mt-4">
                                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" alt="VNPay" className="h-16 w-16"  />
                                <img src="https://tse3.mm.bing.net/th?id=OIP.lQKSh_bWd30iZodgKEpueQHaHa&pid=Api&P=0&h=180" alt="VNPay" className="h-16 w-16"  />
                             
                                <chatbot/>
                     
                                {/* Thêm các logo ngân hàng khác nếu cần */}
                            </div>
                          
                        </div>
                    </div>

                    <div className="mt-2 flex justify-center space-x-4 text-2xl text-gray-700">
                        <a href="#" className="hover:text-blue-600 transition"><FontAwesomeIcon icon={faFacebookF} /></a>
                        <a href="#" className="hover:text-pink-500 transition"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="hover:text-red-600 transition"><FontAwesomeIcon icon={faYoutube} /></a>
                        <a href="#" className="hover:text-black transition"><FontAwesomeIcon icon={faTiktok} /></a>
                    </div>
                </div>
      
            </footer>
        );
    }
}

export default Footer;
