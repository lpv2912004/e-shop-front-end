import React, { useState } from 'react';

const NewsSection = () => {
  const [expandedArticleIndex, setExpandedArticleIndex] = useState(null); // State to track the expanded article
  const [expandedRelatedArticleIndex, setExpandedRelatedArticleIndex] = useState(null); // State to track the expanded related article

  const newsArticles = [
    {
      title: '8 Xu hướng thời trang nam mùa hè mới nhất',
      date: 'Th 5 27/06/2024',
      readTime: '7 phút đọc',
      description: 'Mùa hè năm nổi ra nhiều xu hướng thời trang nam mới hướng tới sự thoải mái và năng động...',
      fullContent: `Mùa hè năm nay đánh dấu sự trở lại của nhiều xu hướng thời trang nam độc đáo. Các chất liệu thoáng mát, màu sắc tươi sáng và kiểu dáng năng động là những điểm nhấn chính. Đặc biệt, áo sơ mi ngắn tay, quần short và các phụ kiện thể thao đang rất được ưa chuộng. Các nhà thiết kế đã chú trọng đến việc kết hợp giữa phong cách và sự thoải mái, mang lại sự tự tin cho nam giới trong mùa hè này. Hãy cùng khám phá 8 xu hướng thời trang nam mùa hè mới nhất để luôn nổi bật trong mỗi dịp đi chơi hay dự tiệc.`,
      image: 'https://file.hstatic.net/200000696635/article/frame_15_c2d09cbe4256466092273a971fc19a42.jpg',
    },
    {
      title: '10 Món đồ không thể thiếu trong tủ đồ của nam giới',
      date: 'Th 2 25/06/2024',
      readTime: '5 phút đọc',
      description: 'Khám phá 10 món đồ cần thiết mà mọi chàng trai nên có trong tủ đồ của mình để luôn nổi bật và tự tin...',
      fullContent: `Tủ đồ của một người đàn ông cần phải bao gồm những món đồ cơ bản và thiết yếu. Trong số đó, áo thun trắng, quần jeans, áo khoác blazer, giày thể thao và một chiếc đồng hồ đẹp là những món đồ không thể thiếu. Những món đồ này không chỉ dễ dàng phối hợp mà còn thể hiện phong cách cá nhân của bạn. Bên cạnh đó, hãy luôn chú ý đến chất liệu và kiểu dáng để tạo nên một tổng thể hài hòa và lịch lãm. Khám phá danh sách 10 món đồ cần thiết cho một tủ đồ hoàn hảo!`,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2F10-item-thoi-trang-nam-khong-the-thieu-trong-tu-do.png?alt=media&token=1db90f33-19bb-41ef-b7ba-c34c29eb6903',
    },
    {
      title: 'Hướng dẫn chọn giày phù hợp với trang phục',
      date: 'Th 4 20/06/2024',
      readTime: '6 phút đọc',
      description: 'Một đôi giày phù hợp có thể thay đổi hoàn toàn diện mạo của bạn. Tìm hiểu cách chọn giày cho từng dịp...',
      fullContent: `Giày là một phần không thể thiếu trong trang phục của mỗi người. Tuy nhiên, việc chọn giày phù hợp với từng loại trang phục lại là một nghệ thuật. Đối với trang phục công sở, giày oxford hoặc giày lười là lựa chọn lý tưởng. Khi đi dạo phố, bạn có thể chọn giày thể thao hoặc giày lười. Ngoài ra, trong những dịp trang trọng như tiệc cưới, giày da bóng là sự lựa chọn hoàn hảo. Hãy cùng tìm hiểu sâu hơn về cách chọn giày cho từng dịp để nâng tầm phong cách của bạn!`,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2Fchon-giay-phu-hop-voi-ban-chan.jpg?alt=media&token=4a4d013f-6b92-4b2a-9ab2-332ce05ac238',
    },
    {
      title: 'Mẹo phối đồ cho chàng thêm phong cách',
      date: 'Th 3 15/06/2024',
      readTime: '4 phút đọc',
      description: 'Những mẹo phối đồ đơn giản giúp bạn trở nên nổi bật và thu hút hơn trong mắt mọi người...',
      fullContent: `Để trở nên nổi bật trong mắt mọi người, bạn không chỉ cần một tủ đồ đa dạng mà còn phải biết cách phối đồ thông minh. Hãy chú ý đến sự cân bằng giữa màu sắc và kiểu dáng. Một chiếc áo thun đơn giản kết hợp với quần jeans và giày thể thao sẽ tạo nên một outfit thoải mái nhưng vẫn phong cách. Ngoài ra, đừng quên thêm một số phụ kiện như đồng hồ hay vòng tay để tạo điểm nhấn cho bộ trang phục của bạn. Áo khoác hoặc cardigan cũng là lựa chọn tuyệt vời để làm mới diện mạo. Hãy thử nghiệm với các phong cách khác nhau để tìm ra phong cách riêng cho bạn!`,
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2Fcach-phoi-do-hack-chieu-cao-cho-nam-don-gian-cuc-manly-thumb.jpg?alt=media&token=bf4a822a-f20b-4a54-a9a2-7785445cf33c',
    },
  ];

  const relatedArticles = [
    {
      title: 'Quần short nam và 5 nguyên tắc nam giới cần phải biết',
      date: 'Th 4 12/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_10_8e76dafa7ac04584ba2680109148724d_medium.jpg',
      fullContent: `Quần short là một món đồ không thể thiếu trong tủ đồ mùa hè của nam giới. Tuy nhiên, để diện quần short một cách thời trang và phong cách, bạn cần nắm vững một số nguyên tắc cơ bản như: độ dài quần, chất liệu, màu sắc, và kiểu dáng. Hãy khám phá chi tiết từng nguyên tắc để luôn xuất hiện một cách tự tin và phong cách nhất.`,
    },
    {
      title: '9 Cách phối màu quần áo nam cho chàng thêm phong cách',
      date: 'Th 3 11/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_11_e0f45667b8e343319ebec6e61a6e72d4_medium.jpg',
      fullContent: `Phối màu quần áo có thể giúp bạn tạo nên một bộ trang phục bắt mắt và hài hòa. Có một số quy tắc cơ bản khi phối màu như: kết hợp màu tương phản, sử dụng gam màu trung tính, và cân bằng giữa trang phục và phụ kiện. Hãy cùng tìm hiểu những cách phối màu để nâng tầm phong cách thời trang của bạn.`,
    },
    {
      title: 'Bí mật 6+ cách phối đồ cho nam hiệu quả',
      date: 'Th 3 11/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_12_6a6287f8da4349f7ad0b90c041af42ac_medium.jpg',
      fullContent: `Phối đồ là một nghệ thuật mà bạn cần phải học hỏi để tạo nên phong cách riêng cho mình. Từ việc chọn quần áo, màu sắc, đến phụ kiện, mọi thứ cần được kết hợp một cách khéo léo. Hãy khám phá bí mật để phối đồ hiệu quả cho những dịp khác nhau.`,
    },
    {
      title: 'Cách chọn áo khoác nam theo từng mùa',
      date: 'Th 5 01/06/2024',
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2Fcach-chon-mua-ao-khoac-nam-chuan-dep_-phu-hop-tung-dang-nguoi_c34f75ee767543a7b11e2ee2657cbede.webp?alt=media&token=bfaea186-abda-482b-b975-914b26d792ba',
      fullContent: `Áo khoác là một phần quan trọng trong tủ đồ của nam giới, đặc biệt trong những tháng lạnh giá. Tuy nhiên, không phải ai cũng biết cách chọn áo khoác phù hợp với từng mùa. Hãy cùng khám phá những mẹo đơn giản để chọn áo khoác cho mùa đông, mùa hè và mùa thu, từ chất liệu đến kiểu dáng, để luôn nổi bật và ấm áp trong mọi thời tiết.`,
    },
    {
      title: 'Tìm hiểu về các loại phụ kiện thời trang nam',
      date: 'Th 2 15/06/2024',
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2Fphu-kien-nam-gioi.jpg?alt=media&token=bcca6dd7-acdd-420f-8672-784557c06d7c',
      fullContent: `Phụ kiện là những yếu tố không thể thiếu trong phong cách thời trang của nam giới. Từ cà vạt, thắt lưng đến đồng hồ và mũ, mỗi phụ kiện đều có vai trò riêng trong việc hoàn thiện bộ trang phục. Hãy cùng tìm hiểu về các loại phụ kiện thời trang nam phổ biến và cách phối hợp chúng để tạo nên phong cách riêng biệt.`,
    },
    {
      title: 'Các kiểu giày da nam hot nhất năm 2024',
      date: 'Th 6 20/06/2024',
      image: 'https://firebasestorage.googleapis.com/v0/b/demoimg-2354e.appspot.com/o/images%2F69593782_3010566435685440_2726931734741385216_n.webp?alt=media&token=fa03e8a7-e10d-4b89-9d1a-26562c163ef1',
      fullContent: `Giày da luôn là một lựa chọn thời thượng cho nam giới. Năm 2024, có rất nhiều kiểu giày da mới mẻ và sáng tạo để bạn lựa chọn. Từ giày oxford cổ điển đến giày derby hiện đại, mỗi kiểu giày đều mang lại một phong cách riêng. Hãy cùng tìm hiểu các kiểu giày da hot nhất năm 2024 và cách phối hợp chúng với trang phục để trở nên lịch lãm hơn.`,
    },
  ];
  

  const handleReadMore = (index) => {
    setExpandedArticleIndex(expandedArticleIndex === index ? null : index);
  };

  const handleRelatedArticleClick = (index) => {
    setExpandedRelatedArticleIndex(expandedRelatedArticleIndex === index ? null : index);
  };

  const handleViewDetails = (index) => {
    setExpandedRelatedArticleIndex(expandedRelatedArticleIndex === index ? null : index);
  };
  return (
    <div className="max-w-7xl mx-auto mt-20 bg-white py-8 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">TIN TỨC</h2>
  
      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Main News Article */}
        <div className="w-full lg:w-2/3">
          {newsArticles.map((article, index) => (
            <div key={index} className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-72 object-cover rounded-lg shadow-lg mb-4 hover:opacity-90 transition-opacity duration-300"
              />
              <h3 className="text-2xl font-bold mb-3 hover:text-blue-500 transition-colors duration-300">
                {article.title}
              </h3>
              <div className="flex items-center text-gray-500 mb-4 space-x-4">
                <span>
                  <i className="fas fa-calendar-alt"></i> {article.date}
                </span>
                <span>
                  <i className="fas fa-clock"></i> {article.readTime}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{article.description}</p>
  
              {/* Button to read more or hide content */}
              <button
                onClick={() => handleReadMore(index)}
                className="text-blue-500 hover:underline"
              >
                {expandedArticleIndex === index ? 'Ẩn nội dung' : 'Đọc tiếp'}
              </button>
  
              {/* Display full content if the article is expanded */}
              {expandedArticleIndex === index && (
                <div className="mt-4 text-gray-800">
                  <p>{article.fullContent}</p>
                </div>
              )}
            </div>
          ))}
        </div>
  
        {/* Related Articles */}
        <div className="w-full lg:w-1/3 lg:ml-8">
          <h4 className="text-lg font-semibold mb-6">Bài viết liên quan</h4>
          <div className="space-y-6">
            {relatedArticles.map((relatedArticle, index) => (
              <div key={index} className="flex items-start hover:bg-gray-100 p-3 rounded-lg transition duration-300">
                <img
                  src={relatedArticle.image}
                  alt={relatedArticle.title}
                  className="w-20 h-20 object-cover rounded-lg shadow-lg mr-4"
                />
                <div className="flex-1">
                  <h5 
                    className="text-md font-semibold mb-1 hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                    onClick={() => handleRelatedArticleClick(index)}
                  >
                    {relatedArticle.title}
                  </h5>
                  <p className="text-sm text-gray-500">{relatedArticle.date}</p>
  
                  {/* Button to view details of related articles */}
                  <button
                    onClick={() => handleViewDetails(index)}
                    className="text-blue-500 hover:underline mt-1"
                  >
                    {expandedRelatedArticleIndex === index ? 'Ẩn nội dung' : 'Xem chi tiết'}
                  </button>
  
                  {/* Display full content if related article is expanded */}
                  {expandedRelatedArticleIndex === index && (
                    <div className="mt-2 text-gray-800">
                      <p>{relatedArticle.fullContent}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      <div className="text-center mt-12">
        {/* Optional "View All" button */}
      </div>
    </div>
  );
  
};

export default NewsSection;
