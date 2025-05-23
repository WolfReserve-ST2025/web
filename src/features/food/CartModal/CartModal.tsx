import React from "react";
import { Order } from "../../orders/Orders";


interface CartModalProps {
    open: boolean;
    draftOrder: Order | null;
    onClose: () => void;
    onSubmit: () => void;
    onRemove: (food_id: string) => void;
}

const CartModal = ({ open, draftOrder, onClose, onSubmit, onRemove }: CartModalProps) => {
    if (!open) return null;
    console.log(draftOrder?.foods)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
            <div className="bg-white w-full max-w-sm h-full shadow-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Košarica</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {!draftOrder || !draftOrder.foods ? (
                        <p className="text-gray-500 text-center mt-10">Košarica je prazna.</p>
                    ) :
                        draftOrder.foods.length === 0 ? (
                            <p className="text-gray-500 text-center mt-10">Košarica je prazna.</p>
                        ) : (
                            <ul className="space-y-4">
                                {draftOrder.foods.map((item, idx) => (
                                    <li
                                        key={item._id || idx}
                                        className="flex items-center border-b pb-2"
                                    >
                                        <span>{item.name}</span>
                                        <span className="font-bold text-blue-700 ml-4">${item.price}</span>
                                        <button
                                            onClick={() => item._id && onRemove(item._id)}
                                            className="ml-auto text-red-600 hover:text-red-800 text-xl font-bold px-2"
                                            title="Odstrani"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                </div>
                <div className="p-4 border-t">
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
                        onClick={onSubmit}

                    >
                        Oddaj naročilo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;