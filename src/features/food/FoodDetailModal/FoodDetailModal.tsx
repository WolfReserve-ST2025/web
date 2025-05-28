import React, { useState } from "react";
import { Food } from "../Foods";
import { BASE_URL } from "../../../api/axios";

interface FoodDetailModalProps {
    open: boolean;
    food: Food | null;
    quantity: number;
    setQuantity: (q: number) => void;
    onClose: () => void;
    onAddToCart: (food_id: string, quantity: number) => void;
}

const FoodDetailModal = ({ open, food, quantity, setQuantity, onClose, onAddToCart }: FoodDetailModalProps) => {

    if (!open || !food) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-black"
                >
                    &times;
                </button>
                <img
                    src={`${BASE_URL}${food.imageUrl}`}
                    alt={food.name}
                    className="w-64 h-64 object-cover rounded mb-4 mx-auto"
                />
                <h2 className="text-2xl font-bold mb-2">{food.name}</h2>
                <p className="mb-2 text-gray-700">{food.description}</p>
                <div className="mb-4">
                    <span className="font-semibold">Type:</span> {food.type}
                </div>
                <div className="mb-4">
                    <span className="font-semibold text-blue-700 text-xl">${food.price}</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <button
                        className="bg-gray-200 px-3 py-1 rounded text-xl font-bold"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >−</button>
                    <span className="text-lg">{quantity}</span>
                    <button
                        className="bg-gray-200 px-3 py-1 rounded text-xl font-bold"
                        onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                </div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                    onClick={() => food._id && onAddToCart(food._id, quantity)}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default FoodDetailModal;