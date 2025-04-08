import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { User } from 'lucide-react';
import { useApi } from '../context/ApiContext';



const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

const vapidKey = ""

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app)


export const requestFCMToken = async (userId) => {
  try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
          const token = await getToken(messaging,{ vapidKey: vapidKey });
          if (token) {
            console.log("FCM Token:", token);
      
            // Send the token to the backend
            await axios.post(`${useApi().API_URL}/admin/user/update-fcm-token`, { userId, token });
          }
      } else {
          throw new Error("Notification permission denied.");
      }
  } catch (error) {
      console.error("Error getting FCM token:", error);
      throw error
  }
};


export const onMessageListener = ()=>{
    return new Promise((resolve)=>{
        onMessage(messaging,(payload)=>{
            resolve(payload)
        })
    })
}
