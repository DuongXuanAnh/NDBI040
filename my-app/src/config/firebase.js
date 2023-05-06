import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
    apiKey: "AIzaSyAF8WbiUH6jBQ-6p7etEqSNPzxYFwUIvRU",
    authDomain: "ndbi040-229fb.firebaseapp.com",
    projectId: "ndbi040-229fb",
    storageBucket: "ndbi040-229fb.appspot.com",
    messagingSenderId: "636289671941",
    appId: "1:636289671941:web:0f91403c492a3c952a8d6c",
    measurementId: "G-G88TH69PYY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);