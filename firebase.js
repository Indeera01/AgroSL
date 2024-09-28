// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "agrosl-7abb2.firebaseapp.com",
  projectId: "agrosl-7abb2",
  storageBucket: "agrosl-7abb2.appspot.com",
  messagingSenderId: "321966335054",
  appId: "1:321966335054:web:33f8ab854a66403434cf1f",
  measurementId: "G-SZKME5P15M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
