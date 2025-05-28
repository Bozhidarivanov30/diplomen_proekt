"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart, getCart, getProducts } from "../firebase";
import {  doc, deleteDoc, addDoc, collection} from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

export default function ShopPage() {
  const { user, setCart } = useUser();
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setShopItems(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user?.email === "admin1@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    async function fetchCart() {
      if (user?.uid) {
        const userCart = await getCart(user.uid);
        setCart(userCart);
      }
    }
    fetchCart();
  }, [user, setCart]);

  const handleAddToCart = async (item, quantity = 1) => {
    if (!user?.uid) {
      alert("You need to be logged in to add items to your cart.");
      return;
    }
    try {
      const itemWithQuantity = { ...item, quantity };
      await addToCart(user.uid, itemWithQuantity);
      setCart((prev) => {
        const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
        if (existingItemIndex >= 0) {
          const updatedCart = [...prev];
          updatedCart[existingItemIndex].quantity = 
            (updatedCart[existingItemIndex].quantity || 1) + quantity;
          return updatedCart;
        }
        return [...prev, itemWithQuantity];
      });
      alert(`${quantity} ${item.name}(s) added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  const handleRemoveProduct = async (item) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "products", item.id));
      setShopItems((prev) => prev.filter((product) => product.id !== item.id));
      alert(`${item.name} removed from the shop!`);
    } catch (error) {
      console.error("Failed to remove product:", error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price: parseFloat(price), imgScr };
      const docRef = await addDoc(collection(db, "products"), newProduct);
      setShopItems((prev) => [...prev, { id: docRef.id, ...newProduct }]);
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setImgScr("");
      setShowAddProductModal(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-maroon p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-maroon p-6 relative">
      <div className="stripes-container">
        <div className="yellow-stripe yellow-stripe-1"></div>
        <div className="yellow-stripe yellow-stripe-2"></div>
        <div className="yellow-stripe yellow-stripe-3"></div>
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-6 relative z-10 [text-shadow:_1px_1px_1px_rgb(0_0_0_/_100%)]">
        Магазин
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {shopItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-2">{item.name}</h2>
            <Image
              src={item.imgScr}
              alt={item.name}
              width={200}
              height={200}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-gray-700 mb-2">${item.price}</p>
            
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const quantityInput = document.getElementById(`quantity-${item.id}`);
                    if (quantityInput.value > 1) quantityInput.value--;
                  }}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-12 text-center border rounded"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const quantityInput = document.getElementById(`quantity-${item.id}`);
                    quantityInput.value++;
                  }}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => {
                  const quantity = parseInt(document.getElementById(`quantity-${item.id}`).value);
                  handleAddToCart(item, quantity);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors w-full"
              >
                Добави в количка
              </button>
            </div>
            
            {isAdmin && (
              <button
                onClick={() => handleRemoveProduct(item)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full"
              >
                Премахване
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <button
          onClick={() => setShowAddProductModal(true)}
          className="fixed bottom-8 right-8 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {showAddProductModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAddProductModal(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-6">Add Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={imgScr}
                    onChange={(e) => setImgScr(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}