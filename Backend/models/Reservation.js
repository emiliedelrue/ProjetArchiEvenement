import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Ticket from './Ticket.js';
import User from './User.js';

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ticket, // Utilisation du modèle directement
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Utilisation du modèle directement
            key: 'id'
        }
    },
    reservationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: 'La date de réservation doit être valide'
            },
            notEmpty: {
                msg: 'La date de réservation est requise'
            }
        }
    }
}, {
    timestamps: true,
    tableName: 'reservations'
});

export default Reservation;
