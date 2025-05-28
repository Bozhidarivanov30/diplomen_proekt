"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { createUserInFirestore } from "../firebase";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        let userData = {};
        if (userDocSnap.exists()) {
          userData = userDocSnap.data();
        }

        const mergedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          ...userData,
        };

        setUser(mergedUser);

        const userCartRef = doc(db, "carts", userId);
        const cartSnapshot = await getDoc(userCartRef);
        setCart(cartSnapshot.exists() ? cartSnapshot.data().items || [] : []);
      } else {
        setUser(null);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userCartRef = doc(db, "carts", userId);
      const cartSnapshot = await getDoc(userCartRef);
      setCart(cartSnapshot.exists() ? cartSnapshot.data().items || [] : []);

      alert("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(`Login failed: ${error.message}`);
    }
  };

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      await createUserInFirestore(user);
      await setDoc(doc(db, "carts", userId), { items: [] });

      setUser(user);
      setCart([]);
      alert("Registration successful!");
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCart([]);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const userId = user.uid;
      const userCartRef = doc(db, "carts", userId);
      const cartDoc = await getDoc(userCartRef);
      let currentItems = cartDoc.exists() ? cartDoc.data().items || [] : [];

      const index = currentItems.findIndex(item => item.id === product.id);

      if (index > -1) {
        currentItems[index].quantity = (currentItems[index].quantity || 1) + quantity;
      } else {
        currentItems.push({ ...product, quantity });
      }

      await updateDoc(userCartRef, { items: currentItems });
      setCart(currentItems);

      alert(`${quantity} ${product.name}(s) added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(`Error adding to cart: ${error.message}`);
    }
  };

  const removeFromCart = async (item) => {
    if (!user) {
      alert("Please log in to remove items from your cart.");
      return;
    }

    try {
      const userId = user.uid;
      const userCartRef = doc(db, "carts", userId);

      await updateDoc(userCartRef, {
        items: arrayRemove(item),
      });

      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
      alert("Item removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error.message);
      alert(`Error removing from cart: ${error.message}`);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        cart,
        setCart,
        loginUser,
        registerUser,
        logoutUser,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}