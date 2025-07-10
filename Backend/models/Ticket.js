import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Evenement from './Evenement.js'

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: {
                msg: 'Le prix doit être un nombre valide'
            },
            notEmpty: {
                msg: 'Le prix est requis'
            }
        }
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evenement, 
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'La quantité doit être un nombre entier'
            },
            notEmpty: {
                msg: 'La quantité est requise'
            }
        }
    }
}, {
    timestamps: true,
    tableName: 'tickets'
});

export default Ticket;
