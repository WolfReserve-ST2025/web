import { Room } from './models/roomModel';

const RoomsList: React.FC<{ rooms: Room[] }> = ({ rooms }) => {
    return (
        <div>
            {rooms.map((room: Room) => (
                <div key={room._id} className="room-card">
                    <h2 className="room-name">{room.name}</h2>
                    <p className="room-detail"><strong>Type:</strong> {room.type}</p>
                </div>
            ))}
        </div>
    );
}

export default RoomsList;