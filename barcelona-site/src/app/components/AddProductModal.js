"use client";

import { useState } from "react";
import { addProduct } from "../firebase.js";

export default function AddProductModal({ onClose, onAddProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddProduct = async (e) => {
     console.log('Add button clicked'); // Debug 1
      e.preventDefault();
      console.log('After preventDefault');
    setError("");
    
    // Validation
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError("Price must be a positive number");
      return;
    }
    
    if (!imgScr.trim() || !isValidUrl(imgScr)) {
      setError("Please enter a valid image URL");
      return;
    }

    setIsSubmitting(true);
    try {
      const newProduct = { 
        name: name.trim(), 
        price: numericPrice, 
        imgScr: imgScr.trim() 
      };
      const productId = await addProduct(newProduct);
      onAddProduct({ id: productId, ...newProduct });
      setName("");
      setPrice("");
      setImgScr("");
      onClose(); // Close modal after successful addition
    } catch (error) {
      console.error("Failed to add product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Add Product</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Price*</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Image URL*</label>
            <input
              type="url"
              value={imgScr}
              onChange={(e) => setImgScr(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}