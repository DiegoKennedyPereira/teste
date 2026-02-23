import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzL4J22QsWLla-4Fx1efcx10HGh6OT4dw",
  authDomain: "foodtruck-5cadc.firebaseapp.com",
  projectId: "foodtruck-5cadc",
  storageBucket: "foodtruck-5cadc.firebasestorage.app",
  messagingSenderId: "473481182491",
  appId: "1:473481182491:web:edc76107142c0b2dc027be",
  measurementId: "G-N2W7833JF4"
};

let db: Firestore;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Mock db for development/preview if keys are missing
  db = {} as Firestore;
}

export { db };
