import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
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
  if (!userId) {
    console.error("User ID is undefined.");
    return;
  }

  const userCartRef = doc(db, "carts", userId);
  await updateDoc(userCartRef, {
    items: arrayRemove(item),
  });
}

// Get the cart for the user
export async function getCart(userId) {
  if (!userId) {
    console.error("User ID is undefined.");
    return [];
  }

  const userCartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(userCartRef);
  return cartDoc.exists() ? cartDoc.data().items : [];
}

// Add an item to the cart in Firestore
export async function addToCart(userId, item) {
  if (!userId) {
    console.error("User ID is undefined.");
    return;
  }

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

// Add a new product
export const addProduct = async (product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};
// Delete a product
export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, "products", productId)); // Use deleteDoc to remove a product
};


// Admin login
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Admin login error:", error.message);
    throw error;
  }
};

// Fetch all products from the "products" collection
export async function getProducts() {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection);
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the document ID
    ...doc.data(), // Include all fields from the document
  }));
  return products;
}