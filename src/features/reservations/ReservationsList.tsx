import { IReservationModel } from "./Models/IReservationModel";

const ReservationsList: React.FC<{
    reservations: IReservationModel[], 
    onDelete: (_id: string) => void, 
    onAccept: (_id: string) => void,
    onCancel: (_id: string) => void,
    canAccept: boolean,
    canDelete: boolean}> = ({reservations, onDelete, onAccept, onCancel, canAccept, canDelete}) => {
    return(
        <div>
            {reservations.map((reservation: IReservationModel) => (
                <div className="flex justify-center">
                    <div key={reservation.id} className="w-full max-w-xl bg-white shadow rounded-lg p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-2">Rezervacija #{reservation.id}</h2>
                            <div className="text-gray-600 mb-1">Soba: <span className="font-medium">{reservation.roomName}</span></div>
                            <div className="text-gray-600 mb-1">Hotel: <span className="font-medium">{reservation.hotelName}</span></div>
                            <div className="text-gray-600 mb-1">Število oseb: <span className="font-medium">{reservation.personCount}</span></div>
                            <div className="text-gray-600 mb-1">Skupna cena: <span className="font-medium">{reservation.totalPrice} €</span></div>
                            <div className="text-gray-600 mb-1">Datum od: <span className="font-medium">{reservation.reservedDateFrom ? new Date(reservation.reservedDateFrom).toLocaleDateString('sl-SI', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span></div>
                            <div className="text-gray-600 mb-1">Datum do: <span className="font-medium">{reservation.reservedDateTo ? new Date(reservation.reservedDateTo).toLocaleDateString('sl-SI', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</span></div>
                            <div className="text-gray-600">Potrjena: <span className={`font-medium ${reservation.isAccepted ? 'text-green-600' : 'text-red-600'}`}>{reservation.isAccepted ? 'Da' : 'Ne'}</span></div>
                        </div>
                        <div className="flex mt-4 md:mt-0 md:ml-6 space-x-2">
                            {canDelete && (
                                <button
                                    onClick={() => onDelete(reservation.id)}
                                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                >
                                    Izbriši
                                </button>
                            )}
                            {!reservation.isAccepted && canAccept && (
                                <>
                                    <button
                                        onClick={() => onAccept(reservation.id)}
                                        className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                                    >
                                        Sprejmi
                                    </button>
                                    <button
                                        onClick={() => onCancel(reservation.id)}
                                        className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                    >
                                        Zavrni
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReservationsList;