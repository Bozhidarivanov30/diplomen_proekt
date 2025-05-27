"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { addProduct, deleteProduct, getProducts } from "../firebase";

export default function AdminPage() {
  const { user } = useUser();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");

  useEffect(() => {
    if (!user) return;

    if (!user.isAdmin) {
      router.push("/"); // Redirect non-admins
    } else {
      fetchProducts(); // Load products if admin
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct({ name, price: parseFloat(price), imgScr });
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setImgScr("");
      fetchProducts();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (!user || !user.isAdmin) {
    return <p className="text-center mt-10 text-gray-700">Checking admin access...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
