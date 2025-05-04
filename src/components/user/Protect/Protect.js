import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">BẢO MẬT THÔNG TIN KHÁCH HÀNG</h1>
      <p className="text-lg mb-4">
        MAOU cam kết xây dựng và công bố chính sách bảo mật thông tin khi thu thập và sử dụng thông tin cá nhân của người tiêu dùng với đầy đủ các nội dung sau:
      </p>

      {/* A. General Principles */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">A. Nguyên Tắc Chung</h2>
        <p className="mb-4">
          Chính sách bảo mật thông tin này (“Chính Sách Bảo Mật MAOU”) mô tả cách thức MAOU thu thập, tiếp nhận, tổng hợp, lưu giữ, sử dụng, xử lý, tiết lộ, chia sẻ và bảo đảm an toàn thông tin của các tổ chức, cá nhân (“Người dùng” hoặc “Quý Khách”) qua các kênh như ứng dụng di động, website, hội nhóm mạng xã hội, và các dịch vụ chăm sóc khách hàng.
        </p>
        <p className="mb-4">
          Vui lòng đọc kỹ Chính Sách Bảo Mật này, các điều khoản điều kiện tương ứng và các quy định khác (nếu có).
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Sự chấp thuận</li>
          <li>Mục đích thu thập</li>
          <li>Phạm vi thu thập</li>
          <li>Thời gian lưu trữ</li>
          <li>Không chia sẻ thông tin cá nhân khách hàng</li>
          <li>An toàn dữ liệu</li>
          <li>Quyền của Khách hàng đối với thông tin cá nhân</li>
          <li>Trách nhiệm của khách hàng để đảm bảo bảo mật thông tin</li>
          <li>Cách thức liên hệ với MAOU</li>
          <li>Đơn vị thu thập và quản lý thông tin</li>
          <li>Hiệu lực</li>
        </ul>
      </section>

      {/* B. Detailed Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">B. Nội dung chi tiết</h2>

        {/* Consent */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Sự Chấp Thuận</h3>
          <p className="mb-4">
            Vui lòng đọc kỹ chính sách bảo mật này. Bằng việc nhấp vào các tùy chọn “Đồng ý”, “Tiếp tục”, Quý Khách xác nhận rằng đã đọc và hiểu các điều khoản của chính sách bảo mật này và đồng ý với việc thu thập, sử dụng, lưu trữ thông tin cá nhân như đã nêu.
          </p>
          <p className="mb-4">
            Nếu không đồng ý, Quý khách có thể dừng cung cấp thông tin cá nhân và sử dụng các quyền nêu tại mục "Quyền của Khách hàng".
          </p>
        </div>

        {/* Purpose */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Mục đích thu thập thông tin cá nhân khách hàng</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Đơn hàng: Xử lý đơn đặt hàng.</li>
            <li>Duy trì tài khoản: Tạo và quản lý tài khoản khách hàng.</li>
            <li>Dịch vụ Người Dùng, chăm sóc khách hàng.</li>
            <li>An ninh: Phát hiện, ngăn chặn hành vi giả mạo, gian lận.</li>
            <li>Yêu cầu pháp luật: Thu thập, lưu trữ và cung cấp theo yêu cầu cơ quan nhà nước có thẩm quyền.</li>
          </ul>
        </div>

        {/* Data Storage */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Thời gian lưu trữ</h3>
          <p className="mb-4">
            Thông tin cá nhân của khách hàng sẽ được lưu trữ và bảo mật trên hệ thống của MAOU cho đến khi khách hàng yêu cầu hủy bỏ hoặc theo các quy định pháp luật.
          </p>
        </div>

        {/* Data Sharing */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Không chia sẻ thông tin cá nhân khách hàng</h3>
          <p className="mb-4">
            MAOU không cung cấp thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào, trừ các trường hợp: dịch vụ vận chuyển, yêu cầu pháp lý hoặc chuyển giao kinh doanh.
          </p>
        </div>

        {/* Data Safety */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">An toàn dữ liệu</h3>
          <p className="mb-4">
            MAOU thực hiện nhiều biện pháp để bảo mật thông tin cá nhân của khách hàng, bao gồm lưu trữ trong môi trường an toàn, thông báo ngay khi xảy ra sự cố, và tuân thủ các tiêu chuẩn ngành.
          </p>
        </div>

        {/* Customer Rights */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Quyền của Khách hàng đối với thông tin cá nhân</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Truy cập, kiểm tra, cập nhật, điều chỉnh hoặc xóa thông tin cá nhân.</li>
            <li>Rút lại sự đồng ý đối với việc sử dụng dữ liệu.</li>
            <li>Khiếu nại, tố cáo hoặc khởi kiện theo quy định pháp luật.</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Cách thức liên hệ với MAOU</h3>
          <p className="mb-4">
            <strong>Hỗ trợ mua Online:</strong> 1800.6061 | Email: saleonline@maou.com <br />
            <strong>Liên hệ Chăm sóc KH:</strong> 1800.6061 | Email: support@maou.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center mt-12">
        <p className="text-gray-500">
          Chính sách bảo mật thông tin này có hiệu lực từ ngày 01/12/2024. Vui lòng liên hệ với chúng tôi nếu cần hỗ trợ thêm.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
