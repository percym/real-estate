// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-304be.firebaseapp.com",
  projectId: "real-estate-304be",
  storageBucket: "real-estate-304be.appspot.com",
  messagingSenderId: "167763756143",
  appId: "1:167763756143:web:9d1fd9163e76c16d25799a",
  measurementId: "G-Y78SXXRMZT"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app); 

export default app;

//--------------ref-------------------
// Initialize Firebase
//const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
//export const auth = getAuth(app);
// export default app;