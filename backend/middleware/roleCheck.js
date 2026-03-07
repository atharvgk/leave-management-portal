// Role-based access control (RBAC) middleware.
// Used after authMiddleware to restrict routes by user role.
// requireEmployee: only employees can access (e.g. apply for leave)
// requireEmployer: only employers can access (e.g. approve/reject)

const requireEmployee = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied. Employees only.' })
    }
    next()
}

const requireEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Access denied. Employers only.' })
    }
    next()
}

module.exports = { requireEmployee, requireEmployer }
