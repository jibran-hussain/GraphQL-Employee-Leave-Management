import express from 'express';
import { createUser,userSignin } from '../controllers/auth.js';
import {isAuth} from '../middlewares/isAuth.js'
import {isAdminOrSuperadmin} from '../middlewares/isAdminOrSuperadmin.js'

const router=express.Router();

router.post('/signup',isAuth,isAdminOrSuperadmin,createUser);
router.post('/signin',userSignin)

export default router;