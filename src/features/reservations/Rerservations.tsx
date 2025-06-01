import axios from '../../api/axios';
import React, { useEffect, useState, useContext } from 'react';
import { IReservationModel } from './Models/IReservationModel';
import ReservationsList from './ReservationsList';
import {getUserFromToken} from '../auth/useCurrentUser';
import ErrorMessage from '../../components/Messages/ErrorMessage';
import SuccessMessage from '../../components/Messages/SuccessMessage';
import { showNotification } from '../../utils/notifications';
import { indexedDBService } from '../../utils/indexDB';
import { useOnline } from '../../hooks/useOnline/useOnline';

const Reservations = () => {
    const [reservations, setReservations] = useState<IReservationModel[]>([]);
    const [selectedReservations, setSelectedReservation] = useState<IReservationModel | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const isOnline = useOnline();

    const user = getUserFromToken();
    const canAccept = user?.role === 'Hotel';
    const canDelte = user?.role === 'User';

    const getReservations = async () => {
        setLoading(true);

        try {
            if (!isOnline) {
                //load from IndexedDB when offline
                const cachedReservations = await indexedDBService.getReservations();
                setReservations(cachedReservations);
                
                if (cachedReservations.length === 0) {
                    setError('No cached reservations available. Please connect to the internet.');
                } else {
                    setError(null);
                }
            } else {
                //load from API when online
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('No access token found in localStorage');
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

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
                        isAccepted: reservation.isAccepted,
                        isReserved: reservation.isReserved
                    })
                );

                setReservations(reservationsResponse);
                
                //save to IndexedDB for offline use
                await indexedDBService.saveReservations(reservationsResponse);
                setError(null);
            }
        } catch (error) {
            console.error('Error loading reservations:', error);
            if (!isOnline) {
                setError('Failed to load cached reservations.');
            } else {
                setError('Error while getting reservations.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (_id: string) => {
        if (!isOnline) {
            setError('Cannot delete reservations while offline. Please connect to the internet.');
            return;
        }

        try {
            await axios.delete(`/reservations/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('reservation successfully deleted.');

            // OS notifiaciton za brisanje rezervacije
            showNotification(`Reservation successfully deleted!`);

            getReservations();
        } catch (err) {
            setError('Error while deleting reservation.');
        }
    };

    const handleAccept = async (_id: string) => {
        if (!isOnline) {
            setError('Cannot accept reservations while offline. Please connect to the internet.');
            return;
        }

        try {
            await axios.put(`/reservations/reserveRoom/${_id}`, { isAccepted: true }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('Reservation succesfully accepted');
            
            // OS notifiaciton za potrditev rezervacije
            showNotification(`Reservation accepted!`);

            getReservations();
        } catch (err) {
            setError('Error while accepting reservation.');
        }
    };

    const handleReject = async (_id: string) => {
        if (!isOnline) {
            setError('Cannot reject reservations while offline. Please connect to the internet.');
            return;
        }

        try {
            await axios.put(`/reservations/reject/${_id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
            });
            setSuccess('Reservation succesfully rejected.');

            // OS notifiaciton za zavrnitev rezervacije
            showNotification(`Reservation rejected!`);

            getReservations();
        } catch (err) {
            setError('Error while rejecting reservation.');
        }
    };

     useEffect(() => {
          getReservations();
        }, [isOnline]);
    
        if (loading) return <p>Loading...</p>;

        return(
            <div>
                {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
                {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

                {!isOnline && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                        <strong>Offline Mode:</strong> You are viewing cached data. Reservation actions are disabled until you are back online.
                    </div>
                )}
                <h1 className="text-2xl font-bold mb-4" style={{ display: 'flex', justifyContent: 'center' }}>Seznam rezervacij</h1>
                <ReservationsList
                    reservations={reservations}
                    onDelete={handleDelete}
                    onAccept={handleAccept}
                    onCancel={handleReject}
                    canAccept={canAccept }	
                    canDelete={canDelte }
                />
            </div>
        );
}

export default Reservations;