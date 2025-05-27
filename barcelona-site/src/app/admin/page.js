"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, addProduct, deleteProduct, getProducts } from "../firebase"; // Import deleteProduct and getProducts
import { db } from "../firebase";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");
  const [products, setProducts] = useState([]); // State to store products
  const router = useRouter();

  // Fetch products on component mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(email, password);
      setIsLoggedIn(true);
    } catch (error) {
      alert("Invalid email or password.");
    }
  };

  // Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct({ name, price: parseFloat(price), imgScr });
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setImgScr("");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show the product form and product list
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Add Product Form */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Add Product</h2>
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
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Product List</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}