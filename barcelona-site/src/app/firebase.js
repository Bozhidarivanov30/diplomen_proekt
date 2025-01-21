import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz8376AFk-ADLFYHzjUASfNU1oOqtV9tI",
  authDomain: "fanshop-7915c.firebaseapp.com",
  projectId: "fanshop-7915c",
  storageBucket: "fanshop-7915c.appspot.com",
  messagingSenderId: "803992597977",
  appId: "1:803992597977:web:904ecce17ca84169b755c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Remove an item from the cart in Firestore
export async function removeFromCart(userId, item) {
  const userCartRef = doc(db, "carts", userId);
  await updateDoc(userCartRef, {
    items: arrayRemove(item),
  });
}

// Get the cart for the user
export async function getCart(userId) {
  const userCartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(userCartRef);
  return cartDoc.exists() ? cartDoc.data().items : [];
}

// Add an item to the cart in Firestore
export async function addToCart(userId, item) {
  try {
    const cartRef = doc(db, "carts", userId);
    
    // Check if the document exists
    const cartDoc = await getDoc(cartRef);
    if (!cartDoc.exists()) {
      // Create a new document if it doesn't exist
      await setDoc(cartRef, { items: [] });
    }

    await updateDoc(cartRef, {
      items: arrayUnion(item),
    });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    throw error;
  }
}
