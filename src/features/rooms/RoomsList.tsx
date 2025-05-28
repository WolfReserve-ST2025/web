import { Room } from './models/roomModel';
import { AddReservationModel } from './models/addReservationModel';
import AddReservationForm from './addReservationForm';
import { useState } from 'react';
import axios from '../../api/axios';
import {getUserFromToken} from '../auth/useCurrentUser';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';

const RoomsList: React.FC<{ 
    rooms: Room[], 
    onEdit: (room: Room) => void, 
    onDelete: (_id: string) => void, 
    canEdit: boolean, 
    canAddReservation: boolean}> 
= ({ rooms, onEdit, onDelete, canEdit, canAddReservation }) => {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    var user = getUserFromToken();
    const isHotel = user?.role === 'Hotel';

    const addReservation = async (reservation: AddReservationModel) => {
    try {
          await axios.post(`/reservations`, reservation, {
              headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          });
          setIsFormOpen(false);
          
          setSuccess('Succesfully added reservation.');
          } catch (err) {
              setError('Error while adding reservation.');
          }
      };
    return (
        <div className="rooms-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
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
                        <strong>Type:</strong> {room.type}
                    </div>
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Description:</strong> {room.description}
                    </div>
                    {!isHotel && (
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Hotel:</strong> {room.hotelName}
                    </div>
                    )}
                    <div style={{ width: '100%', marginBottom: '8px', color: '#6b7280' }}>
                        <strong>Price per night:</strong> {room.pricePerNight} €
                    </div>
                    <div style={{ width: '100%', marginBottom: '16px', color: '#6b7280' }}>
                        <strong>Max person:</strong> {room.maxPersonCount}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                        {canEdit && (
                            <>
                                <button
                                    onClick={() => onEdit(room)}
                                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(room._id)}
                                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        {canAddReservation && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-blue-700"
                            >
                                Reserve
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