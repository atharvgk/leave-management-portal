// Leave routes: all routes require JWT auth + role check
// Employees: apply for leave, view their own leaves
// Employers: view all leaves, approve/reject

const express = require('express')
const router = express.Router()
const {
    applyLeave, getMyLeaves, getAllLeaves, approveLeave, rejectLeave
} = require('../controllers/leaveController')
const authMiddleware = require('../middleware/auth')
const { requireEmployee, requireEmployer } = require('../middleware/roleCheck')

router.post('/', authMiddleware, requireEmployee, applyLeave)
router.get('/my', authMiddleware, requireEmployee, getMyLeaves)
router.get('/all', authMiddleware, requireEmployer, getAllLeaves)
router.patch('/:id/approve', authMiddleware, requireEmployer, approveLeave)
router.patch('/:id/reject', authMiddleware, requireEmployer, rejectLeave)

module.exports = router
