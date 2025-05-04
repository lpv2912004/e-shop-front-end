import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faGift, faAward, faHeadset } from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    icon: faShippingFast,
    title: 'Miễn phí vận chuyển',
    description: 'Nhận hàng trong vòng 3 ngày',
  },
  {
    icon: faGift,
    title: 'Quà tặng hấp dẫn',
    description: 'Nhiều ưu đãi khuyến mãi hot',
  },
  {
    icon: faAward,
    title: 'Bảo đảm chất lượng',
    description: 'Sản phẩm đã được kiểm định',
  },
  {
    icon: faHeadset,
    title: 'Hotline: 19001993',
    description: 'Dịch vụ hỗ trợ bạn 24/7',
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center space-y-2 text-center md:text-left">
      <div className="text-blue-400 text-[clamp(24px, 3vw, 36px)]">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <h3 className="font-semibold text-[clamp(14px, 1.5vw, 18px)]  text-center">{title}</h3>
        <p className="text-gray-500 text-[clamp(12px, 1.2vw, 16px)]  text-center">{description}</p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="flex justify-between items-stretch flex-wrap gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex-1 min-w-[20%] max-w-[23%] p-4  "
          style={{ flexGrow: 1 }}
        >
          <Feature {...feature} />
        </div>
      ))}
    </div>
  );
}

export default Features;
