import React from "react";
import { Food } from "../Foods";

interface FoodModalProps {
    open: boolean;
    onClose: () => void;
    action: string;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    activeFood: Food;
    foodTypes: string[]
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    customType: string;
    setCustomType: (val: string) => void;

}

const FoodModal = ({ open, onClose, action,handleSubmit, activeFood, foodTypes, handleImageChange, handleInputChange, customType, setCustomType }: FoodModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-black"
                >
                    &times;
                </button>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
                >
                    <h2 className="text-xl font-semibold mb-2">{action} Food</h2>
                    <div>
                        <label className="block font-medium mb-1">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={activeFood.name}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={activeFood.price}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Type:</label>
                        <select
                            name="type"
                            value={activeFood.type}
                            onChange={handleInputChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="">Select offer type</option>
                            {foodTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                                </option>

                            ))}
                            <option value="custom">Other</option>

                        </select>

                        {activeFood.type === 'custom' && (
                            <div className="mt-2">
                                <label className="block font-medium mb-1">Custom Type:</label>
                                <input
                                    type="text"
                                    name="customType"
                                    value={customType}
                                    onChange={e => {
                                        setCustomType(e.target.value);
                                    }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Description:</label>
                        <textarea
                            name="description"
                            value={activeFood.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-y"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Image: {activeFood.imageUrl}</label>
                        <input
                            type="file"
                            name="imageUrl"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {action} Food
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FoodModal;