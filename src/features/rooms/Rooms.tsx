import axios from '../../api/axios';
import { Room } from './models/roomModel';
import RoomsList from './RoomsList';
import RoomsForm from './roomsForm';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import RoomsFormProps from './roomsForm';
import { AddReservationModel } from './models/addReservationModel';
import {getUserFromToken} from '../auth/useCurrentUser';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';


const Rooms = () => {
  const auth = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormOpenReservation, setIsFormOpenReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] =useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

        const roomsResponse = response.data.map((room: any) => ({
          _id: room._id,
          name: room.name,
          type: room.type,
          description: room.description,
          pricePerNight: room.pricePerNight,
          maxPersonCount: room.maxPersonCount,
          imgUrl: room.imgUrl,
          userId: room.userId?._id,
          hotelName: room.userId?.name,
        }));

        setRooms(roomsResponse);
     }
     catch (error) {
      setError('Error getting rooms.');
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
                setSuccess('Room succesfully updated.');
            } else {
                await axios.post(`/rooms`, room, requestHeaders);
                setSuccess('Succesfully added room.');
            }

            getRooms();
            setIsFormOpen(false);
        } catch (err) {
            console.error('Error while adding/updating room:', err);
            setError('Error while adding/updating room');
        }
    };

      const handleDelete = async (_id: string) => {
        try {
            await axios.delete(`/rooms/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('Succesfully deleted room.');
            getRooms();
        } catch (err) {
            setError('Error while deleting room.');
        }
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsFormOpen(true);
    };
   

    useEffect(() => {
      getRooms();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    
  return(
    <div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {canAdd && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                  onClick={() => {
                      setSelectedRoom(null);
                      setIsFormOpen(true);
                  }}
                  className="mb-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700"
                    >
                  Dodaj novo sobo
                    </button>
                </div>
            )}
    <RoomsList 
      rooms={rooms} 
      onEdit={handleEdit} 
      onDelete={handleDelete} 
      canEdit={canEdit} 
      canAddReservation={canAddReservation}/>
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
