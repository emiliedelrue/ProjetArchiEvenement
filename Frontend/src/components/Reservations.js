// src/components/Reservations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const response = await axios.get('/api/reservations');
            setReservations(response.data);
        };
        fetchReservations();
    }, []);

    return (
        <div>
            <h1>Réservations</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        {reservation.userId} a réservé {reservation.ticketId} le {reservation.reservationDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reservations;
