import express from 'express'
import {deleteEmployee,listAllEmployees,activateAccount,getLoggedUsersDetails,updateProfile,getEmployeeDetails,updateEmployeeProfile,updatedProfileByPutMethod,updateEmployeeProfileByPut,resetPassword, deleteMe} from '../controllers/employee.js'
import { isAuth } from '../middlewares/isAuth.js';
import { isAdminOrSuperadmin } from '../middlewares/isAdminOrSuperadmin.js';
const router=express.Router();

router.get('/employees',isAuth,isAdminOrSuperadmin,listAllEmployees);

router.delete('/employees/:employeeId',isAuth,isAdminOrSuperadmin,deleteEmployee);

router.post('/employees/:employeeId/activate',isAuth,isAdminOrSuperadmin,activateAccount);

router.get('/employees/:employeeId',isAuth,isAdminOrSuperadmin,getEmployeeDetails);

router.patch("/employees/:employeeId",isAuth,isAdminOrSuperadmin,updateEmployeeProfile);

router.put("/employees/:employeeId",isAuth,isAdminOrSuperadmin,updateEmployeeProfileByPut);


// Route which everyone can access

router.get('/me',isAuth,getLoggedUsersDetails);

router.patch('/me',isAuth,updateProfile);

router.put('/me',isAuth,updatedProfileByPutMethod);

router.delete('/me',isAuth,deleteMe);

router.patch('/me/password',isAuth,resetPassword)



export default router;