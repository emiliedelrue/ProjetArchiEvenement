import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Evenement = sequelize.define('Evenement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le nom de l\'événement est requis'
            },
            len: {
                args: [1, 100],
                msg: 'Le nom ne peut pas dépasser 100 caractères'
            }
        },
        set(value) {
            this.setDataValue('name', value?.trim());
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: 'La date doit être valide'
            },
            notEmpty: {
                msg: 'La date est requise'
            }
        }
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le lieu est requis'
            }
        }
    }
}, {
    timestamps: true,
    tableName: 'evenements'
});

export default Evenement;
