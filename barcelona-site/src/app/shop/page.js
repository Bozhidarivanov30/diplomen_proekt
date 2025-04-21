"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { addToCart, getCart, getProducts } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

export default function ShopPage() {
  const { user, setCart } = useUser();
  const [shopItems, setShopItems] = useState([]); // State to store products from Firebase
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [showAddProductModal, setShowAddProductModal] = useState(false); // State to control the modal
  const [name, setName] = useState(""); // State for product name
  const [price, setPrice] = useState(""); // State for product price
  const [imgScr, setImgScr] = useState(""); // State for product image URL

  // Fetch products from Firebase on component mount
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

  // Check if the user is an admin
  useEffect(() => {
    if (user?.email === "admin1@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Fetch user's cart on user change
  useEffect(() => {
    async function fetchCart() {
      if (user?.uid) {
        const userCart = await getCart(user.uid);
        setCart(userCart);
      }
    }
    fetchCart();
  }, [user, setCart]);

  // Handle adding items to cart
  const handleAddToCart = async (item) => {
    if (!user?.uid) {
      alert("You need to be logged in to add items to your cart.");
      return;
    }
    try {
      await addToCart(user.uid, item);
      setCart((prev) => [...prev, item]);
      alert(`${item.name} added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  // Handle removing items from shop (admin only)
  const handleRemoveProduct = async (item) => {
    if (!isAdmin) return; // Only admins can remove products
    try {
      await deleteDoc(doc(db, "products", item.id)); // Use deleteDoc to remove the product
      setShopItems((prev) => prev.filter((product) => product.id !== item.id)); // Update local state
      alert(`${item.name} removed from the shop!`);
    } catch (error) {
      console.error("Failed to remove product:", error.message);
    }
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price: parseFloat(price), imgScr };
      const docRef = await addDoc(collection(db, "products"), newProduct);
      setShopItems((prev) => [...prev, { id: docRef.id, ...newProduct }]); // Update local state
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setImgScr("");
      setShowAddProductModal(false); // Close the modal
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Display loading state while fetching products
  if (loading) {
    return <div className="min-h-screen bg-maroon p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-maroon p-6 relative">
      {/* Yellow Stripes */}
      <div className="stripes-container">
        <div className="yellow-stripe yellow-stripe-1"></div>
        <div className="yellow-stripe yellow-stripe-2"></div>
        <div className="yellow-stripe yellow-stripe-3"></div>
      </div>
      {/* Shop Content */}
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
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Добави в количка
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleRemoveProduct(item)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Премахване
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Plus Button to Add Products (Admin Only) */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAddProductModal(false)} // Close modal when clicking outside
          ></div>

          {/* Modal */}
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
                    Окажи
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Добави продукт
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