import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
    apiKey: "AIzaSyBMUmbLONQ_PZUUDq65jgO_eFhlTRBc1y0",
    authDomain: "react-login-signup-profile-app.firebaseapp.com",
    projectId: "react-login-signup-profile-app",
    storageBucket: "react-login-signup-profile-app.appspot.com",
    messagingSenderId: "16424328171",
    appId: "1:16424328171:web:25c8b69a4e51905ba457ae"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);