  "use client";

  import { useState, useEffect } from "react";
  import { useUser } from "../context/UserContext";
  import { addToCart, getCart, getProducts } from "../firebase";
  import { doc, deleteDoc, addDoc, collection } from "firebase/firestore";
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
    const [quantities, setQuantities] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [addingProduct, setAddingProduct] = useState(false);

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

    const handleQuantityChange = (itemId, value) => {
      setQuantities(prev => ({
        ...prev,
        [itemId]: Math.max(1, parseInt(value) || 1)
      }));
    };

    const handleAddToCart = async (item, quantity = 1) => {
      if (!user?.uid) {
        alert("Трябва да влезете в профила си, за да добавите продукти в количката.");
        return;
      }
      
      setAddingToCart(prev => ({ ...prev, [item.id]: true }));
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
        alert(`${quantity} ${item.name}(s) добавени в количката!`);
      } catch (error) {
        console.error("Failed to add to cart:", error.message);
        alert("Грешка при добавяне на продукт в количката.");
      } finally {
        setAddingToCart(prev => ({ ...prev, [item.id]: false }));
      }
    };

    const handleRemoveProduct = async (item) => {
      if (!isAdmin) return;
      if (!window.confirm(`Сигурни ли сте, че искате да изтриете ${item.name}?`)) return;
      
      try {
        await deleteDoc(doc(db, "products", item.id));
        setShopItems((prev) => prev.filter((product) => product.id !== item.id));
        alert(`${item.name} беше премахнат успешно!`);
      } catch (error) {
        console.error("Failed to remove product:", error.message);
        alert("Грешка при премахване на продукт.");
      }
    };

    const handleAddProduct = async (e) => {
      e.preventDefault();
      if (!name || !price || !imgScr) {
        alert("Моля, попълнете всички полета!");
        return;
      }
      
      setAddingProduct(true);
      try {
        const newProduct = { name, price: parseFloat(price), imgScr };
        const docRef = await addDoc(collection(db, "products"), newProduct);
        setShopItems((prev) => [...prev, { id: docRef.id, ...newProduct }]);
        alert("Продуктът беше добавен успешно!");
        setName("");
        setPrice("");
        setImgScr("");
        setShowAddProductModal(false);
      } catch (error) {
        console.error("Failed to add product:", error);
        alert("Грешка при добавяне на продукт.");
      } finally {
        setAddingProduct(false);
      }
    };

    if (loading) {
      return <div className="min-h-screen bg-maroon p-6 text-white">Зареждане...</div>;
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
              <div className="w-full h-48 mb-4 flex items-center justify-center">
                <Image
                  src={item.imgScr}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/default-product.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <p className="text-gray-700 mb-2">{item.price.toFixed(2)} лв.</p>
              
              <div className="flex flex-col items-center space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Намали количество"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-12 text-center border rounded"
                    aria-label="Количество"
                  />
                  <button 
                    onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Увеличи количество"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleAddToCart(item, quantities[item.id] || 1)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors w-full"
                  disabled={addingToCart[item.id]}
                >
                  {addingToCart[item.id] ? 'Добавяне...' : 'Добави в количка'}
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
            className="fixed bottom-8 right-8 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors z-[60]" // Changed to z-[60]
            aria-label="Добави продукт"
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
            <div className="fixed inset-0 z-[100]">{}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowAddProductModal(false)}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center ">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative z-[101]">
                <h2 className="text-xl font-bold mb-6">Добави продукт</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Име на продукта</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Цена</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">URL на изображение</label>
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
                      Отказ
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      disabled={addingProduct}
                    >
                      {addingProduct ? 'Добавяне...' : 'Добави'}
                    </button>
                  </div>
                </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }