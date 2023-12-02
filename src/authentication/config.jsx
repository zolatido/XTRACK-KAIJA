// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2cEJfMLKXDyxBDIB3ybTk0kEJktUDdt0",
    authDomain: "x-track-d326d.firebaseapp.com",
    projectId: "x-track-d326d",
    storageBucket: "x-track-d326d.appspot.com",
    messagingSenderId: "969128673681",
    appId: "1:969128673681:web:52b0a364dd5bb3f5ab1a30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default app

export { db }
