
import React, { useState } from 'react';
import './SupportForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SupportForm = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeContent, setActiveContent] = useState(null); // State to track the active content

    const categories = [
        {
            icon: "🛒",
            title: "Mua Sắm Cùng Maou",
            content: [
                {
                    title: "Người dùng mới",
                    description: "Hướng dẫn cho người dùng mới",
                    fullContent: "Chào mừng bạn đến với Maou! Đây là hướng dẫn dành cho người dùng mới, giúp bạn tìm hiểu cách sử dụng dịch vụ của chúng tôi."
                },
                {
                    title: "Thao tác",
                    description: "Hướng dẫn thao tác mua hàng",
                    fullContent: "Để thực hiện thao tác mua hàng trên Maou, bạn cần làm theo các bước sau: tìm kiếm sản phẩm, thêm vào giỏ hàng, và thanh toán."
                },
                {
                    title: "Tính năng của Maou",
                    description: "Tìm hiểu tính năng của Maou",
                    fullContent: "Maou cung cấp nhiều tính năng tiện lợi như tìm kiếm sản phẩm, so sánh giá, và theo dõi đơn hàng."
                },
                {
                    title: "Khám phá",
                    description: "Khám phá thêm về Shopee",
                    fullContent: "Khám phá các tính năng mới và ưu đãi đặc biệt từ Shopee để tối ưu hóa trải nghiệm mua sắm của bạn."
                },
                {
                    title: "Thanh toán đơn hàng",
                    description: "Hướng dẫn thanh toán đơn hàng",
                    fullContent: "Để thanh toán đơn hàng, bạn có thể chọn nhiều phương thức khác nhau như chuyển khoản, thẻ tín dụng hoặc thanh toán khi nhận hàng."
                },
                {
                    title: "Phổ biến",
                    description: "Thông tin phổ biến",
                    fullContent: "Xem các thông tin phổ biến mà người dùng thường quan tâm để có cái nhìn tổng quan về dịch vụ của Maou."
                },
                {
                    title: "Maou Mall",
                    description: "Tìm hiểu về Maou Mall",
                    fullContent: "Maou Mall là nơi bạn có thể tìm thấy hàng hóa chính hãng với nhiều ưu đãi hấp dẫn. Hãy khám phá ngay!"
                },
                {
                    title: "Maou Mart",
                    description: "Tìm hiểu về Maou Mart",
                    fullContent: "Maou Mart mang đến cho bạn trải nghiệm mua sắm hàng hóa thiết yếu với giá cả phải chăng và chất lượng tốt."
                },
                {
                    title: "SEasy Vay Tiêu Dùng",
                    description: "Thông tin về SEasy Vay Tiêu Dùng",
                    fullContent: "SEasy Vay Tiêu Dùng cung cấp giải pháp tài chính giúp bạn dễ dàng tiếp cận các khoản vay phù hợp với nhu cầu của mình."
                }
            ]
        },
        {
            icon: "💸",
            title: "Trả Hàng & Hoàn Tiền",
            content: [
                {
                    title: "Hướng dẫn trả hàng",
                    description: "Hướng dẫn cách trả hàng",
                    fullContent: "Nếu bạn muốn trả hàng, hãy làm theo hướng dẫn từng bước trong mục này để đảm bảo quy trình diễn ra thuận lợi."
                },
                {
                    title: "Hoàn tiền sau khi trả",
                    description: "Thông tin hoàn tiền",
                    fullContent: "Sau khi bạn hoàn trả sản phẩm, quá trình hoàn tiền sẽ được thực hiện trong vòng 7-14 ngày làm việc."
                },
                {
                    title: "Các trường hợp không được hoàn tiền",
                    description: "Thông tin các trường hợp không được hoàn tiền",
                    fullContent: "Có một số trường hợp mà bạn sẽ không được hoàn tiền, bao gồm sản phẩm bị hư hại hoặc không còn nguyên seal."
                }
            ]
        },
        {
            icon: "🎁",
            title: "Khuyến Mãi & Ưu Đãi",
            content: [
                {
                    title: "Cách sử dụng mã giảm giá",
                    description: "Hướng dẫn sử dụng mã giảm giá",
                    fullContent: "Để sử dụng mã giảm giá, bạn chỉ cần nhập mã tại bước thanh toán để nhận ưu đãi cho đơn hàng của mình."
                },
                {
                    title: "Cách săn ưu đãi",
                    description: "Hướng dẫn săn ưu đãi",
                    fullContent: "Hãy thường xuyên theo dõi trang ưu đãi của Maou để không bỏ lỡ các chương trình giảm giá và khuyến mãi hấp dẫn."
                },
                {
                    title: "Khuyến mãi Maou Mall",
                    description: "Khuyến mãi dành cho Maou Mall",
                    fullContent: "Khám phá các khuyến mãi đặc biệt chỉ có tại Maou Mall và tận hưởng mức giá siêu ưu đãi."
                },
                {
                    title: "Giảm giá vận chuyển",
                    description: "Thông tin giảm giá vận chuyển",
                    fullContent: "Maou cung cấp nhiều chương trình giảm giá vận chuyển cho đơn hàng nhất định. Xem chi tiết để biết thêm thông tin."
                }
            ]
        },
        {
            icon: "💳",
            title: "Thanh Toán",
            content: [
                {
                    title: "Phương thức thanh toán",
                    description: "Thông tin về các phương thức thanh toán",
                    fullContent: "Chúng tôi hỗ trợ nhiều phương thức thanh toán như thẻ tín dụng, ví điện tử và thanh toán khi nhận hàng."
                },
                {
                    title: "Hướng dẫn thanh toán khi nhận hàng",
                    description: "Hướng dẫn thanh toán khi nhận hàng",
                    fullContent: "Khi lựa chọn thanh toán khi nhận hàng, bạn chỉ cần chuẩn bị tiền mặt hoặc thẻ để thanh toán cho nhân viên giao hàng."
                },
                {
                    title: "Vấn đề khi thanh toán thẻ",
                    description: "Giải quyết vấn đề khi thanh toán thẻ",
                    fullContent: "Nếu gặp vấn đề khi thanh toán thẻ, vui lòng kiểm tra thông tin thẻ và liên hệ với ngân hàng của bạn."
                }
            ]
        },
        {
            icon: "🚚",
            title: "Đơn Hàng & Vận Chuyển",
            content: [
                {
                    title: "Kiểm tra trạng thái đơn hàng",
                    description: "Cách kiểm tra trạng thái đơn hàng",
                    fullContent: "Bạn có thể kiểm tra trạng thái đơn hàng của mình bằng cách nhập mã đơn hàng vào mục theo dõi trên trang web."
                },
                {
                    title: "Phí vận chuyển",
                    description: "Thông tin về phí vận chuyển",
                    fullContent: "Phí vận chuyển sẽ được tính dựa trên trọng lượng và địa chỉ giao hàng của bạn. Kiểm tra chi tiết trong mục vận chuyển."
                },
                {
                    title: "Cách theo dõi đơn hàng",
                    description: "Hướng dẫn theo dõi đơn hàng",
                    fullContent: "Theo dõi đơn hàng của bạn bằng cách sử dụng mã theo dõi mà chúng tôi cung cấp sau khi đơn hàng được giao."
                },
                {
                    title: "Giao hàng nhanh",
                    description: "Thông tin về giao hàng nhanh",
                    fullContent: "Chúng tôi cung cấp dịch vụ giao hàng nhanh trong vòng 1-2 giờ cho một số sản phẩm nhất định. Xem thêm chi tiết trong mục giao hàng."
                },
                {
                    title: "Dịch vụ vận chuyển",
                    description: "Các dịch vụ vận chuyển",
                    fullContent: "Chúng tôi hợp tác với nhiều đơn vị vận chuyển để đảm bảo đơn hàng của bạn được giao đến nhanh chóng và an toàn."
                }
            ]
        },
        {
            icon: "ℹ️",
            title: "Thông Tin Chung",
            content: [
                {
                    title: "Câu hỏi thường gặp",
                    description: "Các câu hỏi thường gặp",
                    fullContent: "Trong phần này, bạn có thể tìm thấy các câu hỏi thường gặp và câu trả lời liên quan đến dịch vụ của Maou."
                },
                {
                    title: "Liên hệ hỗ trợ",
                    description: "Thông tin liên hệ hỗ trợ",
                    fullContent: "Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua số điện thoại hoặc email được cung cấp trên trang liên hệ."
                },
                {
                    title: "Chính sách bảo mật",
                    description: "Chính sách bảo mật của Maou",
                    fullContent: "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và sẽ không chia sẻ với bên thứ ba mà không có sự đồng ý của bạn."
                },
                {
                    title: "Điều khoản sử dụng",
                    description: "Các điều khoản sử dụng dịch vụ",
                    fullContent: "Vui lòng đọc kỹ các điều khoản sử dụng dịch vụ của Maou để đảm bảo bạn hiểu rõ quyền lợi và nghĩa vụ của mình."
                }
            ]
        }



    ];



    const handleCategoryClick = (index) => {
        setActiveCategory(index);
        setActiveContent(null); // Reset active content when a category is selected
    };

    const handleContentClick = (content) => {
        setActiveContent(content);
    };

    const handleBackClick = () => {
        setActiveContent(null); // Reset active content when back is clicked
    };

    const handleBackToCategories = () => {
        setActiveCategory(null); // Reset active category
        setActiveContent(null); // Also reset active content
    };

    return (
        <div className="maou">
            <header className="support-header">
                <h1>Xin chào, MAOU có thể giúp gì cho bạn?</h1>
            </header>

            <div className="support-form">
                {/* Hiển thị danh mục nếu không có category hoặc content được chọn */}
                {activeCategory === null ? (
                    <div className="categories">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="category-item"
                                onClick={() => handleCategoryClick(index)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-title">{category.title}</span>
                            </div>
                        ))}
                    </div>
                ) : activeContent === null ? (
                    <div className="category-detail">
                        <button className="back-button" onClick={handleBackToCategories}>
                            <i className="fa fa-arrow-left"></i> Quay lại
                        </button>
                        <div className="category-content-header">
                            <span className="category-icon">{categories[activeCategory].icon}</span>
                            <span className="category-title">{categories[activeCategory].title}</span>
                        </div>
                        <div className="category-content">
                            {categories[activeCategory].content.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="category-content-item"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.title}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="content-detail">
                        <button className="back-button" onClick={handleBackClick}>
                            <i className="fa fa-arrow-left"></i> Quay lại
                        </button>
                        <h1 className="content-title">{activeContent.title}</h1>
                        <p>{activeContent.fullContent}</p>
                    </div>
                )}

                {/* Phần liên hệ (Không thay đổi kích thước khi chọn danh mục) */}
                <div className="contact-info">
                    <h3>Liên hệ</h3>
                    <p>
                        <i className="fa fa-map-marker"></i>
                        Địa chỉ: 688 Đường Quang Trung, Hà Nội
                    </p>
                    <p>
                        <i className="fa fa-phone"></i>
                        Điện thoại: +84779-602.365
                    </p>
                    <p>
                        <i className="fa fa-envelope"></i>
                        Email: <a href="mailto:nnhut2705@gmail.com">nnhut2705@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );

};

export default SupportForm;

