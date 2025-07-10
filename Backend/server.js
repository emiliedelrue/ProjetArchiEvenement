import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ticketRoutes from './routes/TicketRoutes.js';
import evenementRoutes from './routes/EventRoutes.js';
import reservationRoutes from './routes/ReservRoutes.js';

// Configuration
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Endpoint de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    await sequelize.sync();
    console.log('✅ Synchronisation des modèles réussie');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

startServer();
