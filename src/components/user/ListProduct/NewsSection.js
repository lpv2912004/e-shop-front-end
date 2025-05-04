import React from 'react';

const NewsSection = () => {
  const newsArticles = [
    {
      title: '8 Xu hướng thời trang nam mùa hè mới nhất',
      date: 'Th 5 27/06/2024',
      readTime: '7 phút đọc',
      description: 'Mùa hè năm nổi ra nhiều xu hướng thời trang nam mới hướng tới sự thoải mái và năng động...',
      image: 'https://file.hstatic.net/200000696635/article/frame_15_c2d09cbe4256466092273a971fc19a42.jpg',
    },
  ];

  const relatedArticles = [
    {
      title: 'Quần short nam và 5 nguyên tắc nam giới cần phải biết',
      date: 'Th 4 12/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_10_8e76dafa7ac04584ba2680109148724d_medium.jpg',
    },
    {
      title: '9 Cách phối màu quần áo nam cho chàng thêm phong cách',
      date: 'Th 3 11/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_11_e0f45667b8e343319ebec6e61a6e72d4_medium.jpg',
    },
    {
      title: 'Bí mật 6+ cách phối đồ cho nam hiệu quả',
      date: 'Th 3 11/04/2023',
      image: 'https://file.hstatic.net/200000696635/article/frame_12_6a6287f8da4349f7ad0b90c041af42ac_medium.jpg',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white py-8">

      
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
              <a href="#" className="text-blue-500 hover:underline">Đọc tiếp</a>
            </div>
          ))}
        </div>

        {/* Related Articles */}
        <div className="w-full lg:w-1/3 lg:ml-8">
          <h4 className="text-lg font-semibold mb-6">Bài viết liên quan</h4>
          <div className="space-y-6">
            {relatedArticles.map((article, index) => (
              <div key={index} className="flex items-center hover:bg-gray-100 p-3 rounded-lg transition duration-300">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-20 h-20 object-cover rounded-lg shadow-lg mr-4"
                />
                <div>
                  <h5 className="text-md font-semibold mb-1 hover:text-blue-500 transition-colors duration-300">{article.title}</h5>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        {/* <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Xem tất cả
        </button> */}
      </div>
    </div>
  );
};

export default NewsSection;
