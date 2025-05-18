import axios from '../../api/axios';
import React, { useEffect, useState, useContext } from 'react';
import { IReservationModel } from './Models/IReservationModel';
import ReservationsList from './ReservationsList';
import {getUserFromToken} from '../auth/useCurrentUser';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservations, setSelectedReservation] = useState<IReservationModel | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const user = getUserFromToken();
    const canAccept = user?.role === 'Hotel';
    const canDelte = user?.role === 'User';

    const getReservations = async () => {
        setLoading(true);

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found in localStorage');
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        try {
            const response = await axios.get('/reservations');

            const reservationsResponse = response.data.map((reservation: any) =>
                ({
                    id: reservation._id,
                    personCount: reservation.personCount,
                    totalPrice: reservation.totalPrice,
                    reservedDateFrom: reservation.reservedDateFrom,
                    reservedDateTo: reservation.reservedDateTo,
                    roomId: reservation.roomId._id,
                    roomName: reservation.roomId.name,
                    userId: reservation.userId._id,
                    hotelName: reservation.userId.name,
                    isAccepted: reservation.isAccepted,
                    isReserved: reservation.isReserved
                })
            );

            setReservations(reservationsResponse);
            setError('');
        } catch (error) {
            setError('Napaka pri pridobivanju rezervacij.');
        } finally {
            setLoading(false);
        };
    }

    const handleDelete = async (_id: string) => {
        try {
            await axios.delete(`/reservations/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            alert('Rezervacija uspešno izbrisana.');
            getReservations();
        } catch (err) {
            alert('Napaka pri brisanju rezervacije.');
        }
    };

    const handleAccept = async (_id: string) => {
        try {
            await axios.put(`/reservations/reserveRoom/${_id}`, { isAccepted: true }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            alert('Rezervacija uspešno sprejeta.');
            getReservations();
        } catch (err) {
            alert('Napaka pri sprejemanju rezervacije.');
        }
    };

     useEffect(() => {
          getReservations();
        }, []);
    
        if (loading) return <p>Nalaganje...</p>;
        if (error) return <p>{error}</p>;

        return(
            <div>
                <h1 className="text-2xl font-bold mb-4">Seznam rezervacij</h1>
                <ReservationsList
                    reservations={reservations}
                    onDelete={handleDelete}
                    onAccept={handleAccept}
                    canAccept={canAccept}
                    canDelete={canDelte}
                />
            </div>
        );
}

export default Reservations;