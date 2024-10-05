// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQzolczdQddoIRlSqOlXMTBHHrVYTVOME",
  authDomain: "blog-website-da58e.firebaseapp.com",
  projectId: "blog-website-da58e",
  storageBucket: "blog-website-da58e.appspot.com",
  messagingSenderId: "269882203180",
  appId: "1:269882203180:web:89335d33fe6d8cf99d8589"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);        // Firebase Authentication
const db = getFirestore(app);     // Firestore Database
const storage = getStorage(app);  // Firebase Storage

// Export the initialized services for use in other files
export { auth, db, storage };
