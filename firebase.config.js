
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyDO2emzWg9_0BkRfWR_Y5VHl_0Lx13b0Yk",
  authDomain: "phone-authentication-d4511.firebaseapp.com",
  projectId: "phone-authentication-d4511",
  storageBucket: "phone-authentication-d4511.firebasestorage.app",
  messagingSenderId: "517706888027",
  appId: "1:517706888027:web:e7f8ac9ed661daca31207e",
  measurementId: "G-DYS62RD3R7",
  recaptchaEnterpriseEnabled: false 
};


const app = initializeApp(firebaseConfig);
 export const auth= getAuth(app);
