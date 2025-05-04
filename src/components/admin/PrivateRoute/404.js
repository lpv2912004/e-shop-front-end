import React from 'react';
import { useHistory } from 'react-router-dom';

const NotFoundPage = () => {
  const history = useHistory();

  const handleGoBackToLogin = () => {
    history.push('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Trang không tồn tại</h1>
      <p>Xin lỗi, trang bạn đang tìm không tồn tại hoặc bạn không có quyền truy cập.</p>
      <button 
        onClick={handleGoBackToLogin} 
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
        Quay về trang đăng nhập
      </button>
    </div>
  );
};

export default NotFoundPage;
