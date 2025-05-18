import axios from '../../api/axios';
import { Room } from './models/roomModel';
import RoomsList from './RoomsList';
import RoomsForm from './roomsForm';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import RoomsFormProps from './roomsForm';
import { AddReservationModel } from './models/addReservationModel';
import {getUserFromToken} from '../auth/useCurrentUser';


const Rooms = () => {
  const auth = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormOpenReservation, setIsFormOpenReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = getUserFromToken();

  const canAdd = user?.role === 'Hotel';
  const canEdit = user?.role === 'Hotel';
  const canAddReservation = user?.role === 'User';

  const getRooms = async () => {
    setLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found in localStorage');
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
     try{
        const response = await axios.get('/rooms');

        const roomsResponse = response.data.map((room: any) => Room.fromApi(room));

        setRooms(roomsResponse);
        setError('');
     }
     catch (error) {
      setError('Napaka pri pridobivanju sob.');
    }
    finally{
      setLoading(false);
    };
  }

   const handleAddOrEdit = async (room: Room) => {
        try {
            const requestHeaders = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            };
            debugger;
            if (room._id ) {
                await axios.put(`/rooms/${room._id}`, room, requestHeaders);
                alert('Soba uspešno posodobljena.');
            } else {
                await axios.post(`/rooms`, room, requestHeaders);
                alert('Soba uspešno dodana.');
            }

            getRooms();
            setIsFormOpen(false);
        } catch (err) {
            console.error('Napaka pri dodajanju/urejanju sobe:', err);
            alert('Napaka pri dodajanju/urejanju sobe.');
        }
    };

      const handleDelete = async (_id: string) => {
        try {
            await axios.delete(`/rooms/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            alert('Soba uspešno izbrisana.');
            getRooms();
        } catch (err) {
            alert('Napaka pri brisanju sobe.');
        }
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsFormOpen(true);
    };
   

    useEffect(() => {
      getRooms();
    }, []);

    if (loading) return <p>Nalaganje...</p>;
    if (error) return <p>{error}</p>;
    
  return(
    <div>
      {canAdd && (
                <button
                    onClick={() => {
                        setSelectedRoom(null);
                        setIsFormOpen(true);
                    }}
                    className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700"
                >
                    Dodaj novo sobo
                </button>
            )}
    <RoomsList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} canEdit={canEdit} canAddReservation={canAddReservation} ></RoomsList>
    {isFormOpen && (
                <RoomsForm
                    room={selectedRoom || undefined}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddOrEdit}
                />
            )}

    </div>
     
  )
}

export default Rooms;
