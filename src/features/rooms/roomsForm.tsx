import { useState, useEffect } from "react";

import { Room } from './models/roomModel';

interface RoomsFormProps {
    room?: Room;
    onClose: () => void;
    onSubmit: (formData: Room) => void;
}

const RoomsForm: React.FC<RoomsFormProps> = ({ room, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Room>({
        _id: "",
        name: "",
        type: "",
        description: "",
        pricePerNight: 0,
        maxPersonCount: 0,
        imgUrl: "",
        userId: "",
        hotelName: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    useEffect(() => {
        if (room) {
            setFormData({
                _id: room._id,
                name: room.name,
                type: room.type,
                description: room.description,
                pricePerNight: room.pricePerNight,
                maxPersonCount: room.maxPersonCount,
                imgUrl: room.imgUrl,
                userId: room.userId,
                hotelName: room.hotelName,
            });
        }
    }, [room]);

    return (
         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h3 className="text-lg font-bold mb-4">
                    {room ? 'Uredi sobo' : 'Dodaj sobo'}
                </h3>
        <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                Ime sobe:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Room Name"
                    className="border rounded w-full py-2 px-3 mt-1"
                />
              </label>
            
            <label className="block mb-2">
                Tip sobe:

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-3 mt-1"
                >
                    <option value="">Izberi tip sobe</option>
                    <option value="suite">Suite</option>
                    <option value="basic">Basic</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="family">Family</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                </select>
            </label>
           
             <label className="block mb-2">
                Opis: 
                <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Room Description"
                className="border rounded w-full py-2 px-3 mt-1"
            />
             </label>
             <label className="block mb-2">
                Cena na noč:
                <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                placeholder="Price Per Night"
                className="border rounded w-full py-2 px-3 mt-1"
            />
             </label>
            
             <label className="block mb-2">
                Maksimalno število oseb:
                <input
                type="number"
                name="maxPersonCount"
                value={formData.maxPersonCount}
                onChange={handleChange}
                placeholder="Max Person Count"
                className="border rounded w-full py-2 px-3 mt-1"
            />
             </label>
            
            <label className="block mb-2">
                Slika:
                <input
                    type="file"
                    accept="image/*"
                    name="imgUrl"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setFormData((prev) => ({
                                    ...prev,
                                    imgUrl: reader.result as string,
                                }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="border rounded w-full py-2 px-3 mt-1"
                />
                {formData.imgUrl && (
                    <img
                        src={formData.imgUrl}
                        alt="Predogled slike"
                        className="mt-2 max-h-32 object-contain"
                    />
                )}
            </label>
            <div className="mt-4 flex justify-between">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Prekliči
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Shrani
                        </button>
                    </div>
        </form>
        </div>
        </div>
    );
};

export default RoomsForm;