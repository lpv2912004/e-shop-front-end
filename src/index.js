import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'; // Nhớ import Modal
import reportWebVitals from './reportWebVitals';

// Cấu hình Modal để set element cho screen readers
Modal.setAppElement('#root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

