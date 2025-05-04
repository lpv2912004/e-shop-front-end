
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyB3r64mjDNh5avpeSBELfnb83KuOjl-9bw",
//   authDomain: "pushdemo-6b5fe.firebaseapp.com",
//   projectId: "pushdemo-6b5fe",
//   storageBucket: "pushdemo-6b5fe.appspot.com",
//   messagingSenderId: "1081310369615",
//   appId: "1:1081310369615:web:27674bba35312908bc973a",
//   measurementId: "G-K6DQHQKGKC"
// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // messaging.onBackgroundMessage((payload) => {
// //   console.log('Received background message ', payload);
// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     icon: '/firebase-logo.png' // Đường dẫn tới icon của thông báo
// //   };

// //   self.registration.showNotification(notificationTitle, notificationOptions);
// // });





importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const config1 = {
  apiKey: "AIzaSyB3r64mjDNh5avpeSBELfnb83KuOjl-9bw",
  authDomain: "pushdemo-6b5fe.firebaseapp.com",
  projectId: "pushdemo-6b5fe",
  storageBucket: "pushdemo-6b5fe.appspot.com",
  messagingSenderId: "1081310369615",
  appId: "1:1081310369615:web:27674bba35312908bc973a",
  measurementId: "G-K6DQHQKGKC"
};

// Khởi tạo Firebase trong Service Worker
firebase.initializeApp(config1);
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: 'https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg' // Đường dẫn tới icon của thông báo
//   };

//   console.log('Displaying notification:', notificationTitle); // Dòng này để kiểm tra
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Lắng nghe message từ ứng dụng chính
// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SET_TOKEN_AND_USER') {
//     jwtToken = event.data.token;
//     idUser = event.data.idUser;
//     console.log("Token and idUser received in Service Worker:", jwtToken, idUser);
//   }
// });

// Use only the `push` event listener
// self.addEventListener('push', function (event) {
//   const payload = event.data.json();
//   console.log('Push received:', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: 'https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg'
//   };

//   event.waitUntil(
//     self.registration.showNotification(notificationTitle, notificationOptions)
//   );

//   // Send payload back to main app
//   self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
//     for (const client of clients) {
//       client.postMessage({ type: 'NEW_NOTIFICATION', payload: payload });
//     }
//   });
// });


// Service Worker Code
// self.addEventListener('push', function (event) {
//   const payload = event.data.json();
//   console.log('Push received:', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: 'https://thumbs.dreamstime.com/b/bell-notification-alert-vector-logo-design-white-inside-green-circle-template-160606776.jpg'
//   };

//   event.waitUntil(
//     self.registration.showNotification(notificationTitle, notificationOptions)
//   );

//   self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
//     for (const client of clients) {
//       client.postMessage({ type: 'NEW_NOTIFICATION', payload: payload });
//     }
//   });
// });





