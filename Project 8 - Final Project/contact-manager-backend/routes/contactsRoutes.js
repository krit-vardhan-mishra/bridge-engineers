import { createContact, deleteContact, getContacts, updateContact } from '../controllers/contactController.js';
import { Router } from 'express';

const router = Router();

router.post('/', createContact);
router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;