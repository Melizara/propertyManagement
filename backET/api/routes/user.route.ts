import { Router } from 'express';
import { register, login, account } from '../controllers/user.controller.ts';
import { registerValidation, loginValidation } from "../validations/auth.ts";
import { handleValidationErrors } from "../validations/errors.ts";
import {protectAuth} from "../middlewares/protectAuth.ts";

const router = Router();

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/account',protectAuth, account);

export default router;