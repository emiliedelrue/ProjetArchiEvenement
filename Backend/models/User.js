
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le prénom est requis'
            },
            len: {
                args: [1, 50],
                msg: 'Le prénom ne peut pas dépasser 50 caractères'
            }
        },
        set(value) {
            
            this.setDataValue('firstName', value?.trim());
        }
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le nom est requis'
            },
            len: {
                args: [1, 50],
                msg: 'Le nom ne peut pas dépasser 50 caractères'
            }
        },
        set(value) {
            this.setDataValue('lastName', value?.trim());
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Format d\'email invalide'
            },
            notEmpty: {
                msg: 'L\'email est requis'
            }
        },
        set(value) {
            
            this.setDataValue('email', value?.toLowerCase().trim());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6],
                msg: 'Le mot de passe doit contenir au moins 6 caractères'
            },
            notEmpty: {
                msg: 'Le mot de passe est requis'
            }
        }
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [10],
                msg: 'Le téléphone doit contenir au moins 10 chiffres'
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user' 
    }
}, {
    timestamps: true, 
    tableName: 'users', 
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

export default User;
