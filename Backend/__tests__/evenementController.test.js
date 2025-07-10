// __tests__/controllers/evenementController.test.js
import request from 'supertest';
import express from 'express';
import evenementRoutes from '../routes/EventRoutes.js';
import Evenement from '../models/Evenement.js';

// Mock du modèle Evenement
jest.mock('../models/Evenement.js');

// Configuration de l'application de test
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/evenements', evenementRoutes);
  
  // Middleware de gestion d'erreurs pour les tests
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
  
  return app;
};

describe('Evenement Controller', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  describe('createEvenement', () => {
    test('should handle validation errors properly', async () => {
      // Simule une erreur de validation
      const mockError = new Error('Validation failed: titre is required');
      Evenement.create.mockRejectedValue(mockError);

      const invalidData = {
        description: 'Test description',
        date: '2024-01-01'
      };

      const response = await request(app)
        .post('/api/evenements')
        .send(invalidData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Validation failed: titre is required');
    });

    test('should create evenement successfully', async () => {
      const mockEvenement = {
        id: 1,
        titre: 'Test Event',
        description: 'Test description',
        date: '2024-01-01',
        lieu: 'Test Location'
      };

      Evenement.create.mockResolvedValue(mockEvenement);

      const validData = {
        titre: 'Test Event',
        description: 'Test description',
        date: '2024-01-01',
        lieu: 'Test Location'
      };

      const response = await request(app)
        .post('/api/evenements')
        .send(validData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEvenement);
      expect(Evenement.create).toHaveBeenCalledWith(validData);
    });
  });

  describe('getEvenementById', () => {
    test('should return 404 for non-existent evenement', async () => {
      Evenement.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/evenements/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Événement non trouvé');
    });

    test('should return evenement when found', async () => {
      const mockEvenement = {
        id: 1,
        titre: 'Test Event',
        description: 'Test description'
      };

      Evenement.findByPk.mockResolvedValue(mockEvenement);

      const response = await request(app)
        .get('/api/evenements/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvenement);
      expect(Evenement.findByPk).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllEvenements', () => {
    test('should handle database errors properly', async () => {
      const mockError = new Error('Database connection failed');
      Evenement.findAll.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/evenements');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database connection failed');
    });

    test('should return all evenements', async () => {
      const mockEvenements = [
        { id: 1, titre: 'Event 1' },
        { id: 2, titre: 'Event 2' }
      ];

      Evenement.findAll.mockResolvedValue(mockEvenements);

      const response = await request(app)
        .get('/api/evenements');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvenements);
    });
  });

  describe('updateEvenement', () => {
    test('should handle update errors properly', async () => {
      const mockEvenement = {
        id: 1,
        titre: 'Original Title',
        update: jest.fn().mockRejectedValue(new Error('Concurrent modification'))
      };

      Evenement.findByPk.mockResolvedValue(mockEvenement);

      const response = await request(app)
        .put('/api/evenements/1')
        .send({ titre: 'Updated Title' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Concurrent modification');
    });

    test('should update evenement successfully', async () => {
      const mockEvenement = {
        id: 1,
        titre: 'Updated Title',
        update: jest.fn().mockResolvedValue()
      };

      Evenement.findByPk.mockResolvedValue(mockEvenement);

      const updateData = { titre: 'Updated Title' };

      const response = await request(app)
        .put('/api/evenements/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvenement);
      expect(mockEvenement.update).toHaveBeenCalledWith(updateData);
    });
  });

  describe('deleteEvenement', () => {
    test('should delete evenement successfully', async () => {
      const mockEvenement = {
        id: 1,
        destroy: jest.fn().mockResolvedValue()
      };

      Evenement.findByPk.mockResolvedValue(mockEvenement);

      const response = await request(app)
        .delete('/api/evenements/1');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      expect(mockEvenement.destroy).toHaveBeenCalled();
    });

    test('should return 404 when deleting non-existent evenement', async () => {
      Evenement.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/evenements/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Événement non trouvé');
    });
  });

  describe('Invalid ID handling', () => {
    test('should handle invalid ID format', async () => {
      const mockError = new Error('Invalid input syntax for type integer');
      Evenement.findByPk.mockRejectedValue(mockError);

      const response = await request(app)
        .get('/api/evenements/invalid-id');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Invalid input syntax for type integer');
    });
  });
});