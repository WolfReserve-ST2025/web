import axios from '../../api/axios';
import { Room } from './models/roomModel';
import RoomsList from './RoomsList';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

const Rooms = () => {
  const auth = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // const canEdit = auth?.accessToken === 1;
  // const canAdd = auth.token.role === 1;

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

  useEffect(() => {
    getRooms();
  }, []);

  return(
    <RoomsList rooms={rooms}></RoomsList>
  )
}

export default Rooms;
