"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { addProduct, deleteProduct, getProducts, getUsers, setAdminStatus } from "../firebase";

export default function AdminPage() {
  const { user, isAdmin, loading } = useUser();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imgScr, setImgScr] = useState("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

 const handleAddProduct = async (e) => {
  e.preventDefault();
  try {
    const newProduct = { 
      name, 
      price: parseFloat(price), 
      imgScr 
    };
    const addedProduct = await addProduct(newProduct); // Now includes `id`
    setProducts(prev => [...prev, addedProduct]); // Update state
    setName("");
    setPrice("");
    setImgScr("");
  } catch (error) {
    alert("Failed to add product: " + error.message);
  }
};

const handleDeleteProduct = async (productId) => {
  try {
    await deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId)); // Remove by ID
  } catch (error) {
    alert("Failed to delete: " + error.message);
  }
};
  const handleToggleAdmin = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? "remove" : "grant"} admin privileges?`)) return;
    
    try {
      await setAdminStatus(userId, !currentStatus);
      alert("Admin status updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update admin status:", error);
      alert("Failed to update admin status. Please try again.");
    }
  };

  if (loading || !user) {
    return <p className="text-center mt-10 text-gray-700">Loading...</p>;
  }

  if (!isAdmin) {
    return <p className="text-center mt-10 text-gray-700">Access denied. Admins only.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Product Section */}
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
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Product
              </button>
            </form>
          </div>

          {/* User Management Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.isAdmin ? "Admin" : "User"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                    className={`px-3 py-1 rounded-lg text-white ${
                      user.isAdmin ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product List Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Product List</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.imgScr && (
                    <img 
                      src={product.imgScr} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p>${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
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