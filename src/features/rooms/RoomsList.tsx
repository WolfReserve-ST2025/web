import { Room } from './models/roomModel';
import { AddReservationModel } from './models/addReservationModel';
import AddReservationForm from './addReservationForm';
import { useState } from 'react';
import axios from '../../api/axios';
import {getUserFromToken} from '../auth/useCurrentUser';

const RoomsList: React.FC<{ 
    rooms: Room[], 
    onEdit: (room: Room) => void, 
    onDelete: (_id: string) => void, 
    canEdit: boolean, 
    canAddReservation: boolean}> 
= ({ rooms, onEdit, onDelete, canEdit, canAddReservation }) => {

    const [isFormOpen, setIsFormOpen] = useState(false);

    var user = getUserFromToken();
    const isHotel = user?.role === 'Hotel';

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
        <div className="rooms-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {rooms.map((room: Room) => (
                <div
                    key={room._id}
                    className="room-card"
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        padding: '20px',
                        margin: '10px',
                        width: '340px',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img
                        src={room.imgUrl}
                        alt={room.name}
                        className="room-image"
                        style={{
                            width: '280px',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                        }}
                    />
                    <h2 className="room-name" style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                        {room.name}
                    </h2>
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Tip:</strong> {room.type}
                    </div>
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Opis:</strong> {room.description}
                    </div>
                    {!isHotel && (
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Hotel:</strong> {room.hotelName}
                    </div>
                    )}
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Cena na noč:</strong> {room.pricePerNight} €
                    </div>
                    <div style={{ width: '100%', marginBottom: '16px', color: '#6b7280' }}>
                        <strong>Max oseb:</strong> {room.maxPersonCount}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                        {canEdit && (
                            <>
                                <button
                                    onClick={() => onEdit(room)}
                                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-700"
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
                                onClick={() => setIsFormOpen(true)}
                                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-blue-700"
                            >
                                Rezerviraj
                            </button>
                        )}
                    </div>
                    {isFormOpen && (
                        <AddReservationForm
                            roomId={room._id}
                            onSubmit={addReservation}
                            onClose={() => setIsFormOpen(false)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default RoomsList;