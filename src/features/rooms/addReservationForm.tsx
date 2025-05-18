import { useState, useEffect } from "react";

import { AddReservationModel } from "./models/addReservationModel";

const AddReservationForm: React.FC<{
    roomId: string, 
    onSubmit:(formData: AddReservationModel) => void,
     onClose: () => void
    }> = ({roomId, onSubmit, onClose}) => {

     const [formData, setFormData] = useState<AddReservationModel>({
        personCount: 0,
        reservedDateFrom: undefined,
        reservedDateTo: undefined,
        roomId: roomId,
        isAccepted: false,
        isReserved: false
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
        setFormData({
            personCount: 0,
            reservedDateFrom: undefined,
            reservedDateTo: undefined,
            roomId: roomId,
            isAccepted: false,
            isReserved: false
        });
    }, [roomId]);

    return(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h3 className="text-lg font-bold mb-4">
                    Dodaj rezervacijo
                </h3>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Število oseb:
                        <input
                            type="number"
                            name="personCount"
                            value={formData.personCount}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        Datum od:
                        <input
                            type="date"
                            name="reservedDateFrom"
                            value={formData.reservedDateFrom?.toString()}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <label className="block mb-2">
                        Datum do:
                        <input
                            type="date"
                            name="reservedDateTo"
                            value={formData.reservedDateTo?.toString()}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </label>
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Prekliči
                        </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Dodaj</button>
                </form>
            </div>
        </div>
    );
};

export default AddReservationForm;