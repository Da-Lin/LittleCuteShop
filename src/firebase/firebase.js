// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ879gVggPaI8eFyAT9fZBhtmyrRn4Kto",
  authDomain: "little-cute-shop.firebaseapp.com",
  projectId: "little-cute-shop",
  storageBucket: "little-cute-shop.appspot.com",
  messagingSenderId: "119022759183",
  appId: "1:119022759183:web:6ba1757ca378937dc5e27a",
  measurementId: "G-BJ921QDLV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
const analytics = getAnalytics(app);


export { app, auth, db, analytics };