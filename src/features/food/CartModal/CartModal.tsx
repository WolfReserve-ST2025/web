import React from "react";
import { Order } from "../../orders/Orders";
import { BASE_URL } from "../../../api/axios";

interface CartModalProps {
    open: boolean;
    draftOrder: Order | null;
    onClose: () => void;
    onSubmit: () => void;
    onRemove: (food_id: string) => void;
}

const CartModal = ({ open, draftOrder, onClose, onSubmit, onRemove }: CartModalProps) => {
    if (!open) return null;
    console.log(draftOrder)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-2xl h-[80vh] shadow-2xl flex flex-col rounded-xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">Your order</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-3xl">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!draftOrder || !draftOrder.foods ? (
                        <p className="text-gray-500 text-center mt-10">You haven’t added anything yet.</p>
                    ) : draftOrder.foods.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">You haven’t added anything yet.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 px-2 font-semibold text-gray-700"></th>
                                    <th className="py-2 px-2 font-semibold text-gray-700">Name</th>
                                    <th className="py-2 px-2 font-semibold text-gray-700">Quantity</th>
                                    <th className="py-2 px-2 font-semibold text-gray-700">Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {draftOrder.foods.map((f, idx) => (
                                    <tr key={f.food._id || idx} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-2">
                                            {f.food.imageUrl && (
                                                <img
                                                    src={`${BASE_URL}${f.food.imageUrl}`}
                                                    alt={f.food.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-2 font-medium">{f.food.name}</td>
                                        <td className="py-2 px-2">{f.quantity}</td>
                                        <td className="py-2 px-2 font-bold text-blue-700">${f.food.price}</td>
                                        <td className="py-2 px-2">
                                            <button
                                                onClick={() => f.food._id && onRemove(f.food._id)}
                                                className="text-red-600 hover:text-red-800 text-xl font-bold px-2"
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-6 border-t">
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition text-lg"
                        onClick={onSubmit}
                    >
                        Place order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;