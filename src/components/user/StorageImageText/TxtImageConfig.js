  // import { initializeApp } from "firebase/app";
  // import {getStorage} from 'firebase/storage'
  // const firebaseConfig = {
  //   apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
  //   authDomain: "demoimg-2354e.firebaseapp.com",
  //   projectId: "demoimg-2354e",
  //   storageBucket: "demoimg-2354e.appspot.com",
  //   messagingSenderId: "488841107147",
  //   appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // export const storage = getStorage(app)


  import { initializeApp } from "firebase/app";
  import { getStorage } from "firebase/storage";
  import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

  const config2 = {
    apiKey: "AIzaSyBjBJTCwPtU6-7lWZTYDS0eOQ2_8rQbeaU",
    authDomain: "demoimg-2354e.firebaseapp.com",
    projectId: "demoimg-2354e",
    storageBucket: "demoimg-2354e.appspot.com",
    messagingSenderId: "488841107147",
    appId: "1:488841107147:web:b4583ef4023f803f9fed4e"
  };
  
  // Khởi tạo ứng dụng Firebase với tên "storageApp"
  const storageApp = initializeApp(config2, "storageApp");
  export const storage = getStorage(storageApp);

// Initialize Firebase Authentication and Providers
const auth = getAuth(storageApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Function to handle Google sign-in
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result; // Trả về kết quả đăng nhập
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

// Function to handle Facebook sign-in
export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    
    return result; // Trả về kết quả đăng nhập
  } catch (error) {
    console.error("Error during Facebook sign-in:", error);
    throw error;
  }
};