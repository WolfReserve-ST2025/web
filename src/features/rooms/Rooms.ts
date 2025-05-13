import axios from '../../api/axios';
import { Room } from './models/roomModel';

export const getRooms = () => {
  // iz local sotrage vzami access token 
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('No access token found in localStorage');
  }
  // set access token v axios headers
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
  return axios.get('/rooms').then((response) => {
     const rooms = response.data.map((room: any) => Room.fromApi(room));
     return rooms;
  });
}
