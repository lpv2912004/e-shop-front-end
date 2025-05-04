import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { AiOutlineMessage } from 'react-icons/ai';


const STATISTICS_API_URL = 'http://localhost:8080/admin/api/statistics/all';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
const API_KEY = 'AIzaSyAckk0QploZvr8kFcSgE5rt7ImxNyo5IRA';

const Chatbot = () => {
  // const [input, setInput] = useState('');
  // const [messages, setMessages] = useState([]);
  // const [typingMessage, setTypingMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [statistics, setStatistics] = useState(null);
  // const [isOpen, setIsOpen] = useState(false);
  // const [dimensions, setDimensions] = useState({ width: 320, height: 450 });
  // const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const fetchStatistics = async () => {
  //     try {
  //       const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage

  //       const response = await axios.get(STATISTICS_API_URL, {
  //         headers: {
  //           Authorization: `Bearer ${token}` // Thêm token vào header Authorization
  //         }
  //       });

  //       setStatistics(response.data);
  //     } catch (error) {
  //       console.error('Error fetching statistics:', error);
  //     }
  //   };

  //   fetchStatistics();
  // }, []);



  // const handleInputChange = (e) => setInput(e.target.value);

  // const typeOutMessage = async (text) => {
  //   setTypingMessage(''); // Clear previous typing message
  //   for (let i = 0; i < text.length; i++) {
  //     setTypingMessage((prev) => prev + text[i]); // Add one character at a time
  //     await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for each character
  //   }
  //   setTypingMessage(''); // Clear typing message once done
  // };

  // const handleSendMessage = async () => {
  //   if (!input.trim() || !statistics || loading) return;

  //   const userMessage = input.trim();
  //   setMessages([...messages, { type: 'user', text: userMessage }]);
  //   setInput('');
  //   setLoading(true);

  //   const context = `### Dữ liệu thống kê hiện tại:\n
  //     -**các dữ liệu phía dưới nếu trả về phải trả về dạng text dễ đọc**
  //         -**tên trang web là MAOU hãy xưng hô là MAOU**
  //              -**khi trả lời tôi cần trả lời chính xác và sát với câu hỏi nhất nếu không cần giải thích thì đừng giải thích chỉ khi hỏi mới giải thích*
  //     - **đây là dữ liệu Sản phẩm đã bán, productId là mã sản phẩm, nameProd là tên sản phẩm, variantName là biến thể bao gồm màu sắc và kích thước(nếu có trả lời hãy quy đổi mã màu sang tiếng việt), price là giá tiền của biến thể đó, quantity là số lượng của biến thể đó, soldDate là ngày bán nếu có trả lời hãy chuyển đổi sang kiểu dd-MM-yyyy, tóm lại khi trả lời dữ liệu đừng trả về dạng json mà dạng text dễ đọc và nhớ xuống hàng mỗi cái nếu cần **: ${JSON.stringify(statistics.salesProducts)}
  //     - **Doanh thu ở đây là tổng tất cả đơn hàng đã bán có trạng thái hoàn thành**: ${statistics.revenue}
  //     - **Tồn kho là số lượng biến thể của các sản phẩm hãy trình bày gọn gàng**: ${JSON.stringify(statistics.inventory)}
  //     - **Thống kê người dùng và những gì người dùng đó đã mua **: ${JSON.stringify(statistics.userStatistics)}
  //     - **Thống kê voucher và chi tiết voucher đó có gì**: ${JSON.stringify(statistics.voucherStatistics)}
  //     - **Thống kê flash sale và chi tiết fl đó có gì**: ${JSON.stringify(statistics.flashSaleStatistics)}
  //     - **Doanh thu hàng ngày là đơn hàng thời gian được lấy theo ngày giờ VIỆT NAM**: ${JSON.stringify(statistics.dailyRevenue)}
  //     - **Số đơn hàng hàng ngày là tổng số lượng đơn hàng của ngày hôm đó, được lấy theo giờ Việt Nam**: ${JSON.stringify(statistics.dailyOrderCount)}\n\n
  //     -**Thông tin tất cả sản phẩm đây là thông tin sản phẩm có id(mã sản phẩm) và id biến thể bạn có thể dựa vào dữ liệu này để truy xuất ra cái câu hỏi của người dùng**: ${JSON.stringify(statistics.products)}\n\n
  //     -**Thông tin tất cả đơn hàng có id (mã đơn hàng) đơn hàng và các chi tiết đơn hàng bạn có thể dựa vào dữ liệu này để truy xuất ra cái câu hỏi của người dùng **: ${JSON.stringify(statistics.orders)}\n\n
  //     ### Câu hỏi từ người dùng:
  //     ${userMessage}`;

  //   try {
  //     const geminiResponse = await axios.post(
  //       `${GEMINI_API_URL}?key=${API_KEY}`,
  //       {
  //         contents: [{ parts: [{ text: context }] }],
  //       },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //       }
  //     );

  //     const botReply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có phản hồi hợp lệ từ chatbot';

  //     await typeOutMessage(botReply); // Call the typeOutMessage function to display the bot's response

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { type: 'bot', text: botReply },
  //     ]);
  //   } catch (error) {
  //     console.error('Error fetching response from Gemini:', error);
  //     const errorMessage = 'Xin lỗi, tôi không thể trả lời câu hỏi của bạn vào lúc này.';
  //     await typeOutMessage(errorMessage); // Display error message character by character
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { type: 'bot', text: errorMessage },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSendMessage();
  //   }
  // };

  // const toggleChatbot = () => {
  //   if (!isOpen) {
  //     // Nếu chatbot được mở lần đầu tiên, thêm lời chào
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { type: 'bot', text: 'Chào mừng bạn đến với MAOU! Mình có thể giúp gì cho bạn hôm nay?' },
  //     ]);
  //   } else {
  //     // Khi đóng, xóa lời chào
  //     setMessages((prevMessages) =>
  //       prevMessages.filter((message) => message.text !== 'Chào mừng bạn đến với MAOU! Mình có thể giúp gì cho bạn hôm nay?')
  //     );
  //   }
  //   setIsOpen(!isOpen); // Thay đổi trạng thái mở/đóng của chatbot
  // };


  // const startResize = (e, direction) => {
  //   e.preventDefault();
  //   setStartPos({ x: e.clientX, y: e.clientY });

  //   const onMouseMove = (event) => handleResize(event, direction);
  //   const onMouseUp = () => stopResize(onMouseMove, onMouseUp);

  //   document.addEventListener('mousemove', onMouseMove);
  //   document.addEventListener('mouseup', onMouseUp);
  // };

  // const handleResize = (e, direction) => {
  //   let newWidth = dimensions.width;
  //   let newHeight = dimensions.height;

  //   if (direction.includes('right')) {
  //     newWidth = Math.min(600, Math.max(320, dimensions.width + (e.clientX - startPos.x)));
  //   } else if (direction.includes('left')) {
  //     newWidth = Math.min(600, Math.max(320, dimensions.width - (e.clientX - startPos.x)));
  //   }

  //   if (direction.includes('bottom')) {
  //     newHeight = Math.min(600, Math.max(350, dimensions.height + (e.clientY - startPos.y)));
  //   } else if (direction.includes('top')) {
  //     newHeight = Math.min(600, Math.max(350, dimensions.height - (e.clientY - startPos.y)));
  //   }

  //   setDimensions({ width: newWidth, height: newHeight });
  // };

  // const stopResize = (onMouseMove, onMouseUp) => {
  //   document.removeEventListener('mousemove', onMouseMove);
  //   document.removeEventListener('mouseup', onMouseUp);
  // };

  // return (
  //   <div>
     
  //   </div>

  // );
};

export default Chatbot;
