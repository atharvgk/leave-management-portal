// Leave controller: handles applying for leave and reviewing requests.
//
// IMPORTANT DATE BUG FIX:
// HTML date inputs send strings like "2025-01-15".
// new Date("2025-01-15") creates a UTC midnight date.
// new Date() for "today" is local time.
// Comparing these directly causes timezone bugs (today's date rejected).
// FIX: normalize both to YYYY-MM-DD ISO strings before comparing.
//
// OVERLAP PREVENTION:
// Before creating a new leave, we check if the employee already has
// a Pending or Approved leave that overlaps with the requested dates.
// This prevents duplicate/conflicting submissions.
//
// SELF-APPROVAL PREVENTION:
// Employers cannot approve/reject leave requests from accounts they own
// (edge case: if someone registers as both employee and employer).

const LeaveRequest = require('../models/LeaveRequest')
const User = require('../models/User')

const VALID_LEAVE_TYPES = [
    'Sick Leave', 'Casual Leave', 'Annual Leave',
    'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'
]

exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body

        // Validate all required fields
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        if (!VALID_LEAVE_TYPES.includes(leaveType)) {
            return res.status(400).json({ message: 'Invalid leave type' })
        }
        if (!reason.trim()) {
            return res.status(400).json({ message: 'Reason cannot be empty' })
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' })
        }

        // Timezone-safe comparison: use ISO date strings (YYYY-MM-DD)
        const todayStr = new Date().toISOString().split('T')[0]
        const startStr = start.toISOString().split('T')[0]
        const endStr = end.toISOString().split('T')[0]

        if (startStr < todayStr) {
            return res.status(400).json({ message: 'Start date cannot be in the past' })
        }
        if (endStr < startStr) {
            return res.status(400).json({ message: 'End date must be on or after start date' })
        }

        // Check for overlapping leave requests (Pending or Approved)
        // Overlap exists if: existing.startDate <= newEnd AND existing.endDate >= newStart
        const overlapping = await LeaveRequest.findOne({
            employeeId: req.user.id,
            startDate: { $lte: end },
            endDate: { $gte: start },
            status: { $in: ['Pending', 'Approved'] }
        })
        if (overlapping) {
            return res.status(400).json({
                message: 'You already have a Pending or Approved leave request overlapping these dates'
            })
        }

        // Fetch user from DB to get email — email is NOT stored in JWT payload
        const userDoc = await User.findById(req.user.id)
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' })
        }

        const leave = await LeaveRequest.create({
            employeeId: req.user.id,
            employeeName: req.user.name,   // from JWT
            employeeEmail: userDoc.email,  // from DB
            leaveType,
            startDate: start,
            endDate: end,
            reason: reason.trim()
        })

        return res.status(201).json({ message: 'Leave applied successfully', leave })
    } catch (err) {
        console.error('ApplyLeave error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.getMyLeaves = async (req, res) => {
    try {
        // Returns only this employee's leave requests, newest first
        const leaves = await LeaveRequest
            .find({ employeeId: req.user.id })
            .sort({ createdAt: -1 })
        return res.status(200).json({ leaves })
    } catch (err) {
        console.error('GetMyLeaves error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.getAllLeaves = async (req, res) => {
    try {
        // Returns all employees' leave requests (employer only), newest first
        const leaves = await LeaveRequest
            .find({})
            .populate('employeeId', 'name email')
            .sort({ createdAt: -1 })
        return res.status(200).json({ leaves })
    } catch (err) {
        console.error('GetAllLeaves error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.approveLeave = async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id)
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' })
        }
        // Prevent double-processing
        if (leave.status !== 'Pending') {
            return res.status(400).json({ message: 'Leave request has already been processed' })
        }
        // Prevent an employer from approving their own leave request (edge case RBAC)
        if (leave.employeeId.toString() === req.user.id) {
            return res.status(403).json({ message: 'You cannot approve your own leave request' })
        }
        leave.status = 'Approved'
        leave.reviewedBy = req.user.id
        leave.reviewedAt = new Date()
        await leave.save()
        return res.status(200).json({ message: 'Leave request approved successfully', leave })
    } catch (err) {
        console.error('ApproveLeave error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

exports.rejectLeave = async (req, res) => {
    try {
        const leave = await LeaveRequest.findById(req.params.id)
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' })
        }
        if (leave.status !== 'Pending') {
            return res.status(400).json({ message: 'Leave request has already been processed' })
        }
        // Prevent an employer from rejecting their own leave request (edge case RBAC)
        if (leave.employeeId.toString() === req.user.id) {
            return res.status(403).json({ message: 'You cannot reject your own leave request' })
        }
        leave.status = 'Rejected'
        leave.reviewedBy = req.user.id
        leave.reviewedAt = new Date()
        await leave.save()
        return res.status(200).json({ message: 'Leave request rejected successfully', leave })
    } catch (err) {
        console.error('RejectLeave error:', err.message)
        return res.status(500).json({ message: 'Server error. Please try again.' })
    }
}
