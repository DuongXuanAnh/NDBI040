// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDyavS2Rm6h1cB2Ft9UGdwjS_cTXtzyjEg",
  authDomain: "ndbi040-fde61.firebaseapp.com",
  projectId: "ndbi040-fde61",
  storageBucket: "ndbi040-fde61.appspot.com",
  messagingSenderId: "881675233386",
  appId: "1:881675233386:web:84b96bf8bc4b7fa9b38213",
  measurementId: "G-YR9D1YCH2J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);