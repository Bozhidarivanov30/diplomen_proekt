"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // Track user state
  const [cart, setCart] = useState([]);  // Track cart items in state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userCartRef = doc(db, "carts", userId);
        const cartSnapshot = await getDoc(userCartRef);

        if (cartSnapshot.exists()) {
          setCart(cartSnapshot.data().items || []);
        } else {
          setCart([]);
        }

        setUser(currentUser.email);
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

      if (cartSnapshot.exists()) {
        setCart(cartSnapshot.data().items || []);
      } else {
        setCart([]);
      }

      setUser(userCredential.user.email);
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
      const userId = userCredential.user.uid;

      const userCartRef = doc(db, "carts", userId);
      await setDoc(userCartRef, { items: [] });

      setUser(userCredential.user.email);
      setCart([]);
      alert("Registration successful and cart initialized!");
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

  const addToCart = async (item) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const userCartRef = doc(db, "carts", userId);

      console.log("Adding item to Firestore:", item);

      const cartDoc = await getDoc(userCartRef);
      if (!cartDoc.exists()) {
        await setDoc(userCartRef, { items: [] });
      }

      await updateDoc(userCartRef, {
        items: arrayUnion(item),
      });

      setCart((prevCart) => [...prevCart, item]);
      alert("Item added to cart!");
      console.log("Item added to cart successfully:", item);
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
      const userId = auth.currentUser.uid;
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
        removeFromCart 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
