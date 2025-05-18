import { Room } from './models/roomModel';
import { AddReservationModel } from './models/addReservationModel';
import AddReservationForm from './addReservationForm';
import { useState } from 'react';
import axios from '../../api/axios';

const RoomsList: React.FC<{ 
    rooms: Room[], 
    onEdit: (room: Room) => void, 
    onDelete: (_id: string) => void, 
    canEdit: boolean, 
    canAddReservation: boolean}> 
= ({ rooms, onEdit, onDelete, canEdit, canAddReservation }) => {

    const [isFormOpen, setIsFormOpen] = useState(false);

    const addReservation = async (reservation: AddReservationModel) => {
    try {
          await axios.post(`/reservations`, reservation, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          });
          setIsFormOpen(false);
          
          alert('Uspešno dodana rezervacija.');
          } catch (err) {
              alert('Napaka pri dodajanju rezervacije.');
          }
      };
    return (
        <div>
            {rooms.map((room: Room) => (
                <div key={room._id} className="room-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                    <h2 className="room-name">Soba: {room.name}</h2>
                    <p className="room-detail">Tip: {room.type}</p>
                    <p>Opis: {room.description}</p>
                    <p>Hotel: {room.userId}</p>
                    <p>Cena na noč: {room.pricePerNight} €</p>
                    <p>Max število oseb: {room.maxPersonCount}</p>
                    <img src={room.imgUrl} alt={room.name} className="room-image" />
                     <div className="mt-4">
                        {canEdit && (
                            <>
                                <button
                                    onClick={() => onEdit(room)}
                                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-700 mr-2"
                                >
                                    Uredi
                                </button>
                                <button
                                    onClick={() => onDelete(room._id)}
                                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                                >
                                    Izbriši
                                </button>
                            </>
                        )}
                        {canAddReservation && (
                            <button
                                onClick={() => 
                                    setIsFormOpen(true)
                                }
                                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-blue-700 ml-2"
                            >
                                Rezerviraj
                            </button>
                        )}
                        {isFormOpen && (
                            <AddReservationForm
                                roomId={room._id}
                                onSubmit={addReservation}
                                onClose={() => setIsFormOpen(false)}
                            />
                            )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RoomsList;