import { Router } from 'express';
import { register, login, account } from '../controllers/user.controller.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/account', account);    

export default router;