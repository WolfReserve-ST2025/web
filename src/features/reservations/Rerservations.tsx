import axios from '../../api/axios';
import React, { useEffect, useState, useContext } from 'react';
import { IReservationModel } from './Models/IReservationModel';
import ReservationsList from './ReservationsList';
import {getUserFromToken} from '../auth/useCurrentUser';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservations, setSelectedReservation] = useState<IReservationModel | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
            setSuccess('Rezervacija uspešno izbrisana.');
            getReservations();
        } catch (err) {
            setError('Napaka pri brisanju rezervacije.');
        }
    };

    const handleAccept = async (_id: string) => {
        try {
            await axios.put(`/reservations/reserveRoom/${_id}`, { isAccepted: true }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('Rezervacija uspešno sprejeta.');
            getReservations();
        } catch (err) {
            setError('Napaka pri sprejemanju rezervacije.');
        }
    };

    const handleReject = async (_id: string) => {
        try {
            await axios.put(`/reservations/cancelReservation/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('Rezervacija uspešno zavrnjena.');
            getReservations();
        } catch (err) {
            setError('Napaka pri zavrnitvi rezervacije.');
        }
    };

     useEffect(() => {
          getReservations();
        }, []);
    
        if (loading) return <p>Nalaganje...</p>;
        if (error) return <p>{error}</p>;

        return(
            <div>
                {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
                {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
                <h1 className="text-2xl font-bold mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Seznam rezervacij</h1>
                <ReservationsList
                    reservations={reservations}
                    onDelete={handleDelete}
                    onAccept={handleAccept}
                    onCancel={handleReject}
                    canAccept={canAccept}
                    canDelete={canDelte}
                />
            </div>
        );
}

export default Reservations;