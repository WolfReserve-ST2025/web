import { useEffect, useState } from 'react';
import { getRooms} from './Rooms';
import { Room } from './models/roomModel'; // Correcting the type name to 'RoomResponse'

const Rooms = () => {

    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsData: Room[] = await getRooms();
                setRooms(roomsData);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);
    
    return (
        <div>
            {rooms.map((room, index) => (
                <div key={index}>{room.name}</div> // Assuming room has a 'name' property
            ))}
        </div>
    );
}

export default Rooms;