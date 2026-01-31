const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const requestController = require('../controllers/request.controller');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Validation rules
const createRequestValidation = [
    body('type')
        .trim()
        .notEmpty()
        .withMessage('Request type is required'),
    body('reason')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Reason must be at least 10 characters'),
    body('resource')
        .trim()
        .notEmpty()
        .withMessage('Resource name is required')
];

// Routes
router.post(
    '/',
    authMiddleware,
    roleCheck('REQUESTER'),
    createRequestValidation,
    requestController.createRequest
);

router.get(
    '/my-requests',
    authMiddleware,
    roleCheck('REQUESTER'),
    requestController.getMyRequests
);

router.get(
    '/all',
    authMiddleware,
    roleCheck('APPROVER'),
    requestController.getAllRequests
);

router.put(
    '/:id/approve',
    authMiddleware,
    roleCheck('APPROVER'),
    requestController.approveRequest
);

router.put(
    '/:id/reject',
    authMiddleware,
    roleCheck('APPROVER'),
    requestController.rejectRequest
);

module.exports = router;
