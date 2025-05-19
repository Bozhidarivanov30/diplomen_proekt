// UserContext.js
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
  const [user, setUser] = useState(null); // Track user state (full user object)
  const [cart, setCart] = useState([]); // Track cart items in state
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const userCartRef = doc(db, "carts", userId);
        const cartSnapshot = await getDoc(userCartRef);

        if (cartSnapshot.exists()) {
          setCart(cartSnapshot.data().items || []); // Set cart from Firestore
        } else {
          setCart([]); // Initialize empty cart if no document exists
        }

        setUser(currentUser); // Set the full user object
      } else {
        setUser(null); // Clear user state if logged out
        setCart([]); // Clear cart state
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Login user
  const loginUser = async (email, password) => {
    try {
      // Check if the email and password match the admin credentials
      if (email === "admin1@gmail.com" && password === "admin123") {
        // Mark the user as an admin
        setUser({ email, isAdmin: true });
        router.push("/admin"); // Redirect to the admin page
        return;
      }

      // Proceed with regular user login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userCartRef = doc(db, "carts", userId);
      const cartSnapshot = await getDoc(userCartRef);

      if (cartSnapshot.exists()) {
        setCart(cartSnapshot.data().items || []); // Set cart from Firestore
      } else {
        setCart([]); // Initialize empty cart if no document exists
      }

      setUser(userCredential.user); // Set the full user object
      alert("Login successful!");
      router.push("/"); // Redirect to home page
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
  
      // 🔥 Създай запис за потребителя в Firestore ("users" колекция)
      await createUserInFirestore(user);
  
      // 🔄 Създай празна количка
      const userCartRef = doc(db, "carts", userId);
      await setDoc(userCartRef, { items: [] });
  
      setUser(user); // Запиши потребителя в стейта
      setCart([]);   // Започни с празна количка
      alert("Registration successful!");
      router.push("/"); // Пренасочване към начална страница
    } catch (error) {
      console.error("Registration failed:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
  };
  

  // Logout user
  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      setCart([]); // Clear cart state
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert(`Logout failed: ${error.message}`);
    }
  };

  // Add item to cart
  const addToCart = async (item) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const userId = user.uid; // Use user.uid from the state
      const userCartRef = doc(db, "carts", userId);

      console.log("Adding item to Firestore:", item);

      // Check if the cart document exists
      const cartDoc = await getDoc(userCartRef);
      if (!cartDoc.exists()) {
        // Create a new cart document if it doesn't exist
        await setDoc(userCartRef, { items: [] });
      }

      // Add the item to the cart
      await updateDoc(userCartRef, {
        items: arrayUnion(item),
      });

      // Update the local cart state
      setCart((prevCart) => [...prevCart, item]);
      alert("Item added to cart!");
      console.log("Item added to cart successfully:", item);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert(`Error adding to cart: ${error.message}`);
    }
  };
  

  // Remove item from cart
  const removeFromCart = async (item) => {
    if (!user) {
      alert("Please log in to remove items from your cart.");
      return;
    }

    try {
      const userId = user.uid; // Use user.uid from the state
      const userCartRef = doc(db, "carts", userId);

      // Remove the item from the cart
      await updateDoc(userCartRef, {
        items: arrayRemove(item),
      });

      // Update the local cart state
      setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
      alert("Item removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error.message);
      alert(`Error removing from cart: ${error.message}`);
    }
  };

  // Provide context values
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

// Custom hook to use the UserContext
export function useUser() {
  return useContext(UserContext);
}
