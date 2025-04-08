importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js");


firebase.initializeApp({
    apiKey: "AIzaSyBwBHVTQy7hm9lrDDTpumlTxgT-fpsr-wU",
    authDomain: "alertx-2024.firebaseapp.com",
    projectId: "alertx-2024",
    storageBucket: "alertx-2024.firebasestorage.app",
    messagingSenderId: "178773306223",
    appId: "1:178773306223:web:bf6e81592f2fe22ac9569a",
    measurementId: "G-6QD8CZK84G"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
});
