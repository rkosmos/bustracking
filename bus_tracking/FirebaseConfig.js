// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAobSDuk2PYs3pXRqoxanp2bI3XlLmxJVk",
  authDomain: "bus-tracking-f3e32.firebaseapp.com",
  projectId: "bus-tracking-f3e32",
  storageBucket: "bus-tracking-f3e32.appspot.com",
  messagingSenderId: "315540107658",
  appId: "1:315540107658:web:17f698340e61864002d873",
  measurementId: "G-S3E1Z81B20",
  databaseURL:
    "https://bus-tracking-f3e32-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestoreDB = getFirestore(app); // Initialize firestoreDB here

// let analytics;
// isSupported().then((supported) => {
//   if (supported) {
//     analytics = getAnalytics(app);
//   }
// });

export { app, auth, firestoreDB };
