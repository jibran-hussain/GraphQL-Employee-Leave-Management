import express from 'express'
import {deleteEmployee,listAllEmployees,activateAccount,getLoggedUsersDetails,updateProfile,getEmployeeDetails,updateEmployeeProfile,updatedProfileByPutMethod,updateEmployeeProfileByPut,resetPassword, deleteMe,manageMfaSettings,verifyOTP,getMfaDetailsofUser,sendOTP,resendOTP,getTotpDetailForUser} from '../controllers/employee.js'
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

// Routes related to Multifactor Authentication


// Manages the Multi-factor Authentication
router.patch('/mfa-settings',isAuth,manageMfaSettings)

// Send OTP
router.post('/otp/send',sendOTP)

// Resend OTP (Resend limits functionality)
router.post('/otp/resend',resendOTP)

// Verify OTP
router.post('/otp/verify',verifyOTP);

// Get Multi-factor Authentication details of an employee
router.get('/mfa-details',getMfaDetailsofUser);

// Get TOTP (Time bassed OTP) details for Employee
router.get('/totp-details', getTotpDetailForUser)







export default router;