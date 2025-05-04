import * as React from "react";
import { ToastContainer, Bounce } from 'react-toastify';

function MyToastContainer({
  position = "top-right",
  autoClose = 3000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = false,
  theme = "light",
  transition = Bounce,
  ...props
}) {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      transition={transition}
      
      {...props}
    />
  );
}

export default MyToastContainer;

