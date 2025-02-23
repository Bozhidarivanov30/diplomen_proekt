import React from "react";
import Image from "next/image";
import PropTypes from "prop-types"; // Optional: For prop validation

export default function ItemList({ items, handleAddToCart }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Replace <img> with <Image /> */}
          <Image
            src={item.image}
            alt={item.name}
            width={300}
            height={160}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gray-600">${item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Optional: Add PropTypes for better code maintainability
ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleAddToCart: PropTypes.func.isRequired,
};