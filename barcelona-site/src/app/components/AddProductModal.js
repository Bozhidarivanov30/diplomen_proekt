// components/AddProductModal.js
"use client";

import { useState } from "react";
import { addProduct } from "../firebase";

export default function AddProductModal({ onClose, onAddProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price: parseFloat(price), imgScr };
      const productId = await addProduct(newProduct); // Add the product to Firestore
      onAddProduct({ id: productId, ...newProduct }); // Pass the new product to the parent
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setImgScr("");
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
              onClick={onClose}
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
  );
}