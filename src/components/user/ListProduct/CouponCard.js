import React, { useState, useEffect } from 'react';
import LazyLoad from 'react-lazyload'; 
function CouponCard({ code, discount, description, date, condition,typeVoucherName, max_voucher_apply }) {
  const [copied, setCopied] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);


  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };


  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const expiration = new Date(date); 
    const difference = expiration - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);

      if (days >= 1) {
        setShowExpirationWarning(false);
      } else if (hours > 0) {
        setShowExpirationWarning(true);
        setTimeLeft(`Còn ${hours} giờ`);
      } else if (minutes > 0) {
        setShowExpirationWarning(true);
        setTimeLeft(`Còn ${minutes} phút`);
      } else {
        setTimeLeft('Hết hạn');
      }
    } else {
      setTimeLeft('Hết hạn');
    }
  };

 
  useEffect(() => {
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); 
    return () => clearInterval(timer);
  }, [date]); 

  return (
    
    <div className="perspective-1000 w-full max-w-xs h-full mx-auto">
    <div
      className={`relative w-full h-40 transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''
        }`}
    >
        <LazyLoad height={200} offset={100} once>
      <div className="absolute w-full h-50 backface-hidden p-3 bg-white border rounded-lg shadow-lg flex flex-col justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="text-left ">
       
            <h3 className="text-gray-800 font-bold text-lg">Voucher {discount}%</h3>

            <p className="text-gray-500 text-xs"> {typeVoucherName === 'SHIPPING' ? 'Giảm phí vận chuyển' : 'Giảm giá '} {discount}%, tối đa là {max_voucher_apply.toLocaleString()}đ,  đơn hàng tối thiểu {condition.toLocaleString()} đ </p>
            {showExpirationWarning ? (
              <p className="text-red-500 text-xs">Sắp hết hạn: {timeLeft}</p>
            ) : (
              <p className="text-gray-500 text-xs">
                HSD: {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            )}
          </div>
          <button
            onClick={handleCopyCode}
            className={`${copied ? 'bg-lime-400' : 'bg-teal-400'
              } text-white text-sm px-3 py-2 mt-4 rounded-md transition-all`}
          >
            {copied ? '✓' : 'Lưu'}
          </button>
        </div>
        <button
          onClick={toggleFlip}
          className="text-blue-500 underline text-xs text-center cursor-pointer "
        >
          Điều kiện
        </button>
      </div></LazyLoad>
  

      <div className="absolute w-full h-50 backface-hidden p-4 bg-white border rounded-sm shadow-lg transform rotate-y-180 flex flex-col justify-between">
        <div className="text-gray-600">
          <p className="text-gray-500 text-xs">
            HSD: {new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <ul className="list-disc text-xs mt-1 pl-5">
  <li>Áp dụng hóa đơn từ {condition.toLocaleString()} đ</li>
  <li>Áp dụng 01 mã ưu đãi/ 01 hoá đơn thanh toán/ 01 khách hàng.</li>
  <li>Mã: {code}.</li>
</ul>

        </div>
        <button
          onClick={toggleFlip}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md mt-2 transition-all hover:bg-green-600"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
  
  );
}

export default CouponCard;
