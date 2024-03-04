import express from 'express'
import { applyForLeave,listLeaves,updateLeave,updateLeaveByPutMethod,deleteLeave,getLeaveDetails,listAllEmployeeLeaves,getLeaveById,getAllLeaves,deleteLeaveByDate,rejectLeave,LeavesSummary, approveLeave,EmployeeLeavesSummary,myLeavesSummary } from '../controllers/leave.js';
import { isAuth } from '../middlewares/isAuth.js';
import { isAdminOrSuperadmin } from '../middlewares/isAdminOrSuperadmin.js';

const router= express.Router();


// Routes which logged in users can access
router.post('/me/leaves',isAuth,applyForLeave)
router.get('/me/leaves',isAuth,listLeaves);
router.patch('/me/leaves/:leaveId',isAuth,updateLeave)
router.put('/me/leaves/:leaveId',isAuth,updateLeaveByPutMethod)
router.delete('/me/leaves/:leaveId',isAuth,deleteLeave)
router.delete('/me/leave/:date',isAuth,deleteLeaveByDate)
router.get('/me/leaves/summary',isAuth,myLeavesSummary)
router.get('/me/leaves/:leaveId',isAuth,getLeaveDetails)

// Routes which superadmin and admin can access
router.get('/employees/:employeeId/leaves',isAuth,isAdminOrSuperadmin,listAllEmployeeLeaves)
router.get('/leaves/:leaveId',isAuth,isAdminOrSuperadmin,getLeaveById)
router.get('/leaves',isAuth,isAdminOrSuperadmin,getAllLeaves)
router.post('/leaves/:leaveId/accept',isAuth,isAdminOrSuperadmin,approveLeave)
router.post('/leaves/:leaveId/reject',isAuth,isAdminOrSuperadmin,rejectLeave)
router.get('/leaves/system/summary',isAuth,isAdminOrSuperadmin,LeavesSummary)
router.get('/leaves/employees/:employeeId/summary',isAuth,isAdminOrSuperadmin,EmployeeLeavesSummary)


export default router;