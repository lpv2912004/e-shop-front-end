import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { AiOutlineMessage } from 'react-icons/ai';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'sonner';

const STATISTICS_API_URL = 'http://localhost:8080/user/api/products1/all';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent';
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 320, height: 450 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      const cachedData = getStatisticsFromCache();
      if (cachedData) {
        setStatistics(cachedData);
        return;
      }

      try {
        const response = await axios.get(STATISTICS_API_URL);
        setStatistics(response.data);
        cacheStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const getStatisticsFromCache = () => {
    const cachedData = localStorage.getItem('statistics');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const expirationTime = parsedData.expirationTime || 0;
      if (Date.now() - expirationTime < 3600000) {
        return parsedData.data;
      }
    }
    return null;
  };

  const cacheStatistics = (data) => {
    const expirationTime = Date.now();
    const cachedData = { data, expirationTime };
    localStorage.setItem('statistics', JSON.stringify(cachedData));
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const typeOutMessage = async (text) => {
    setTypingMessage('');
    for (let i = 0; i < text.length; i++) {
      setTypingMessage((prev) => prev + text[i]);
      await new Promise((resolve) => setTimeout(resolve, 20)); //dl tx
    }
    setTypingMessage('');
  };
  const handleSendMessage = async () => {
    if (!input.trim() || !statistics || loading) return;

    const userMessage = input.trim();
    setMessages([...messages, { type: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error("Token không tồn tại trong localStorage");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);  // Giải mã token JWT
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return;
    }

    const userId = decoded.id_user; // Lấy userId từ decoded token
    const ten = decoded.hoten || 'bạn';  // Lấy tên người dùng hoặc 'bạn' nếu không có tên

    // Gửi yêu cầu đến API để lấy đơn hàng của người dùng
    try {
      const ordersResponse = await axios.get(`http://localhost:8080/user/api/products1/orders?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Gửi header Authorization với Bearer token
        },
      });

      const orders = ordersResponse.data;

      const ordersText = orders.map(order => {
        return `
          - **Mã đơn hàng**: ${order.id}
          - **Trạng thái**: ${order.state.name_status_order}
          - **Ngày tạo**: ${new Date(order.created_date).toLocaleDateString()}
          - **Tổng tiền**: ${order.total_cash} VND
          - **phí ship**: ${order.delivery_fee} VND
          - **địa chỉ giao hàng**: ${order.address.full_address} 
             - **phương thức thanh toán**: ${order.methodPayment.name_method} 
                - **phí ship**: ${order.delivery_fee} VND
        `;
      }).join('\n');

      const context = `### Dữ liệu của trang web tôi:\n
        - **Thông tin khách hàng**: ${ten}
             - ** dưới đây là dữ liệu mà tôi đưa cho bạn để bạn đặt mình vào người bán hàng tư vấn cho khách hàng, hãy trả lời tinh tế ngắn gọn nhưng đủ ý**
        -**các dữ liệu phía dưới nếu trả về phải trả về dạng dễ đọc, giới thiệu đây là trang web thời trang với các mặt hàng quần áo thời trang**
            -**tên trang web là MAOU hãy xưng hô là MAOU, tên khách hàng là: ${ten} nếu không có thì gọi là bạn **
                 -**khi trả lời tôi cần trả lời chính xác và sát với câu hỏi nhất nếu không cần giải thích thì đừng giải thích chỉ khi hỏi mới giải thích*
        - **đây là dữ liệu Sản phẩm và biến thể chi tiết như sau: productId là mã sản phẩm, productName là tên sản phẩm, productDescription là mô tả sản phẩm thường thì trả lời không cần trả lời cái này chỉ hiện ra nếu được yêu cầu, productQuantity là số lượng tồn kho , categoryName là loại sản phẩm, brandName là thương hiệu sản phẩm, variantId là mã biến thể sản phẩm, variantQuantity là số lượng biến thể dựa theo mã biến thể,variantPrice là giá của biến thể(nó có thể tính bằng k ví dụ 1000đ là 1k), colorName là màu của biến thể nếu trả lời hãy chuyển đổi mã màu đó sang dạng chữ , sizeName là kích thước biến thể nếu có trả lời hãy chuyển đổi sang kiểu dd-MM-yyyy, tóm lại khi trả lời dữ liệu đừng trả về dạng json mà dạng text dễ đọc và nhớ xuống hàng mỗi cái nếu cần, những câu hỏi liên quan đến sản phẩm của trang web xin vui lòng dựa vào dữ liệu để trả lời nếu người dùng hỏi giá cả hoặc số lượng của sản phẩm đó vv, nếu người dùng muốn kham khảo một số sản phẩm thì hãy đề xuất theo nhu cầu của họ **: ${JSON.stringify(statistics.products)}
        - **voucher và chi tiết voucher  thì id là mã voucher, code là mã code dùng để áp dụng voucher , discountValue là phần trăm giảm giá của voucher đó , expirationDate là hạn sử dụng của voucher, typeVoucherName là loại voucher  nếu nó là ORDER có nghĩa là nó sẽ giảm giá cho tổng tiền của sản phẩm còn nếu là SHIPPING  thì nó sẽ giảm giá phí vận chuyển**: ${JSON.stringify(statistics.vouchers)}
        - ** flash sale và chi tiết thì id là mã flashsale, name_FS là tên chương trình giảm giá, variants.variantId  và  có nghĩa là mã biến thể đang được giảm giá(bạn có thể dựa vào mã này để lấy ra chi tiết biến thể nếu người dùng cần có thể tìm trong ${JSON.stringify(statistics.products)}) và discountPercent phần trăm được giảm giá**: ${JSON.stringify(statistics.flashSales)}
  - ** thông tin liên hệ của chủ shop là GMAIL= nnhut2705@gmai.com SĐT & ZALO= 0779602365 (nếu khách hàng không hiểu cần tư vấn hãy đưa thông tin này đừng hỏi cái gì cũng đưa), địa chỉ shop trên gg map =2M2H+F7X, ĐT923, Thị trấn Phong Điền, Phong Điền, Cần Thơ, Việt Nam**
  - **nếu người dùng hỏi cách đặt hàng thì hãy hướng dẫn như sau: bước 1: tìm sản phẩm bằng công cụ tìm kiếm có tích hợp tìm bằng giọng nói,bước 2: thêm sản phẩm vào giỏ hàng, bước 3: ấn đặt hàng, có thể ấn đặt ngay trong chi tiết sản phẩm mà không cho vào giỏ hàng, kiểm tra đơn hàng bằng cách ấn vào biểu tượng avatar chọn tài khoản chọn xem đơn hàng** 
        - **Đơn hàng của người dùng**:
        ${ordersText}
        ### Câu hỏi từ người dùng:
        ${userMessage}`;

      const geminiResponse = await axios.post(
        `${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: context }] }],
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botReply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi hợp lệ từ chatbot';
      await typeOutMessage(botReply);

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: botReply },
      ]);

    } catch (error) {
      console.error('Error fetching orders or generating response:', error);
      const errorMessage = 'Xin lỗi, hiện tại không thể lấy đơn hàng của bạn.';
      await typeOutMessage(errorMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      toast('Bạn cần đăng nhập để sử dụng chatbot');
      return;
    }

    if (!isOpen) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: 'Chào mừng bạn đến với MAOU! Mình có thể giúp gì cho bạn hôm nay?' },
      ]);
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.text !== 'Chào mừng bạn đến với MAOU! Mình có thể giúp gì cho bạn hôm nay?')
      );
    }
    setIsOpen(!isOpen);
  };

  const startResize = (e, direction) => {
    e.preventDefault();
    setStartPos({ x: e.clientX, y: e.clientY });

    const onMouseMove = (event) => handleResize(event, direction);
    const onMouseUp = () => stopResize(onMouseMove, onMouseUp);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleResize = (e, direction) => {
    let newWidth = dimensions.width;
    let newHeight = dimensions.height;

    if (direction.includes('right')) {
      newWidth = Math.min(600, Math.max(320, dimensions.width + (e.clientX - startPos.x)));
    } else if (direction.includes('left')) {
      newWidth = Math.min(600, Math.max(320, dimensions.width - (e.clientX - startPos.x)));
    }

    if (direction.includes('bottom')) {
      newHeight = Math.min(600, Math.max(350, dimensions.height + (e.clientY - startPos.y)));
    } else if (direction.includes('top')) {
      newHeight = Math.min(600, Math.max(350, dimensions.height - (e.clientY - startPos.y)));
    }

    setDimensions({ width: newWidth, height: newHeight });
  };

  const stopResize = (onMouseMove, onMouseUp) => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  //s ck
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('messages'));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);



  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white p-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      >
        {isOpen ? <AiOutlineMessage size={24} /> : <AiOutlineMessage size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-20 right-5 bg-white shadow-xl rounded-lg flex flex-col z-50"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {/* Vùng kéo dãn ở các cạnh */}
          <div
            onMouseDown={(e) => startResize(e, 'top')}
            className="absolute top-0 left-0 w-full h-1 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'bottom')}
            className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'left')}
            className="absolute top-0 left-0 h-full w-1 cursor-ew-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'right')}
            className="absolute top-0 right-0 h-full w-1 cursor-ew-resize"
          />

          {/* Vùng kéo dãn ở các góc */}
          <div
            onMouseDown={(e) => startResize(e, 'top-left')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'top-right')}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'bottom-left')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => startResize(e, 'bottom-right')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
          />

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 mb-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start text-left'} shadow`}
              >
                {msg.type === 'bot' ? (
                  <ReactMarkdown >{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {typingMessage && (
              <div className="p-2 mb-2 rounded-lg bg-gray-100 self-start shadow">
                <ReactMarkdown>{typingMessage}</ReactMarkdown>
              </div>
            )}
          </div>
          <div className="flex border-t p-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 border-none outline-none p-2 rounded-l-lg"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-400 to-blue-400 text-white px-4 py-2 rounded-r-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-7 w-7 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                  />
                </svg>
              ) : (
                'Gửi'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
