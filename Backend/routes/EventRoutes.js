import express from 'express';
import { createEvenement, getAllEvenements, getEvenementById, updateEvenement,deleteEvenement } from '../controllers/EventController.js';

const router = express.Router();

router.post('/', createEvenement);
router.get('/', getAllEvenements);
router.get('/:id', getEvenementById);
router.put('/:id', updateEvenement);
router.delete('/:id', deleteEvenement);

export default router;
