import { register,login,logout,refresh } from "../controllers/auth_controllers.ts"
import { Router } from "express";


const router=Router();
router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.post('/refresh',refresh);


export default router;