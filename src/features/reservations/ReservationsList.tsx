import { IReservationModel } from "./Models/IReservationModel";

const ReservationsList: React.FC<{
    reservations: IReservationModel[], 
    onDelete: (_id: string) => void, 
    onAccept: (_id: string) => void,
    canAccept: boolean,
    canDelete: boolean}> = ({reservations, onDelete, onAccept, canAccept, canDelete}) => {
    return(
        <div>
            {reservations.map((reservation: IReservationModel) => (
                <div key={reservation.id} className="reservation-card" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                    <h2 className="reservation-name">Rezervacija: {reservation.id}</h2>
                    <p>Soba: {reservation.roomName}</p>
                    <p>Hotel: {reservation.hotelName}</p>
                    <p className="reservation-detail">Število oseb: {reservation.personCount}</p>
                    <p>Skupna cena: {reservation.totalPrice} €</p>
                    <p>Datum od: {reservation.reservedDateFrom ? new Date(reservation.reservedDateFrom).toLocaleDateString('sl-SI', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</p>
                    <p>Datum do: {reservation.reservedDateTo ? new Date(reservation.reservedDateTo).toLocaleDateString('sl-SI', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</p>
                    <p>Potrjena: {reservation.isAccepted ? 'Da' : 'Ne'}</p>
                    <div className="mt-4">
                        {canDelete && (
                            <button
                            onClick={() => onDelete(reservation.id)}
                            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700 mr-2"
                        >
                            Izbriši
                        </button>
                        )}
                        {!reservation.isAccepted && canAccept && (
                            <button
                                onClick={() => onAccept(reservation.id)}
                                className="px-3 py-1 rounded bg-green-500 text-white hover:bg-blue-700 ml-2"
                            >
                                Sprejmi
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReservationsList;