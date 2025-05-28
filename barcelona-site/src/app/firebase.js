import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz8376AFk-ADLFYHzjUASfNU1oOqtV9tI",
  authDomain: "fanshop-7915c.firebaseapp.com",
  projectId: "fanshop-7915c",
  storageBucket: "fanshop-7915c.appspot.com",
  messagingSenderId: "803992597977",
  appId: "1:803992597977:web:904ecce17ca84169b755c8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function removeFromCart(userId, item) {
  if (!userId) return;
  const userCartRef = doc(db, "carts", userId);
  await updateDoc(userCartRef, { items: arrayRemove(item) });
}

export async function getCart(userId) {
  if (!userId) return [];
  const userCartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(userCartRef);
  return cartDoc.exists() ? cartDoc.data().items : [];
}

export async function addToCart(userId, item) {
  if (!userId) return;
  const cartRef = doc(db, "carts", userId);
  const cartDoc = await getDoc(cartRef);
  
  if (!cartDoc.exists()) {
    await setDoc(cartRef, { items: [] });
  }
  
  const currentItems = cartDoc.exists() ? cartDoc.data().items || [] : [];
  const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex].quantity = 
      (updatedItems[existingItemIndex].quantity || 1) + (item.quantity || 1);
    await updateDoc(cartRef, { items: updatedItems });
  } else {
    await updateDoc(cartRef, { 
      items: arrayUnion({
        ...item,
        quantity: item.quantity || 1
      }) 
    });
  }
}

export async function updateCartItem(userId, oldItem, newItem) {
  if (!userId) return;
  const cartRef = doc(db, "carts", userId);
  
  await updateDoc(cartRef, {
    items: arrayRemove(oldItem)
  });
  
  await updateDoc(cartRef, {
    items: arrayUnion(newItem)
  });
}

export const addProduct = async (product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, "products", productId));
};

export const getProducts = async () => {
  const productsSnapshot = await getDocs(collection(db, "products"));
  return productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const adminLogin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export async function createUserInFirestore(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const adminEmails = ["admin1@gmail.com"];
    const isAdmin = adminEmails.includes(user.email);

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      role: isAdmin ? "admin" : "user",
      isAdmin: isAdmin,
      createdAt: new Date().toISOString(),
    });

    console.log("User added to Firestore users collection.");
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
  }
}