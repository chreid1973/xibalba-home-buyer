import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
