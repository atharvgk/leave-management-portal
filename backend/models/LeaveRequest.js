// LeaveRequest model: each document represents one leave application.
// employeeName and employeeEmail are stored directly (denormalized) to avoid
// extra DB lookups when the employer views the list.
// reviewedBy and reviewedAt are set when the employer takes action.
// timestamps: true auto-creates createdAt and updatedAt fields.
//
// Indexes:
//   employeeId index: speeds up GET /api/leaves/my (filter by employee)
//   status index:     speeds up employer dashboard filtered views

const mongoose = require('mongoose')

const leaveRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'],
        required: [true, 'Leave type is required']
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    reason: { type: String, required: [true, 'Reason is required'], trim: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null }
}, { timestamps: true })

// Performance indexes — important for production-scale queries
leaveRequestSchema.index({ employeeId: 1 })
leaveRequestSchema.index({ status: 1 })

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema)
