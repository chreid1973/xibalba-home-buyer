// Fix: Update Firebase imports to v8 namespaced API.
import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
// In a real-world application, these would be stored in secure environment variables
// and not be committed to version control. For this simulation, we use placeholders.
const firebaseConfig = {
  apiKey: "AIzaSyC...your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
// Fix: Use v8 namespaced API for initialization.
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
