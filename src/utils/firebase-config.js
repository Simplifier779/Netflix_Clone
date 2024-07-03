// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "netflix-clone-d4b65.firebaseapp.com",
  projectId: "netflix-clone-d4b65",
  storageBucket: "netflix-clone-d4b65.appspot.com",
  messagingSenderId: "404396759960",
  appId: "1:404396759960:web:f6e28420d408dd37fea9ed",
  measurementId: "G-KEX9LC2EEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth=getAuth(app);
