const AccessRequest = require('../models/AccessRequest');
const { validationResult } = require('express-validator');

// @desc    Create a new access request
// @route   POST /api/requests
// @access  Private (REQUESTER only)
exports.createRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // Check if user already has a pending request (CRITICAL BUSINESS RULE)
        const existingPendingRequest = await AccessRequest.findOne({
            userId: req.user.id,
            status: 'PENDING'
        });

        if (existingPendingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending access request. Please wait for it to be reviewed before submitting a new one.'
            });
        }

        const { type, reason, resource } = req.body;

        // Create new access request
        const accessRequest = await AccessRequest.create({
            userId: req.user.id,
            requestDetails: {
                type,
                reason,
                resource
            }
        });

        // Populate user details
        await accessRequest.populate('userId', 'username email');

        res.status(201).json({
            success: true,
            message: 'Access request submitted successfully',
            data: {
                request: accessRequest
            }
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating request',
            error: error.message
        });
    }
};

// @desc    Get user's own requests
// @route   GET /api/requests/my-requests
// @access  Private (REQUESTER only)
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await AccessRequest.find({ userId: req.user.id })
            .populate('reviewedBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: {
                requests
            }
        });
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching requests',
            error: error.message
        });
    }
};

// @desc    Get all access requests
// @route   GET /api/requests/all
// @access  Private (APPROVER only)
exports.getAllRequests = async (req, res) => {
    try {
        const { status } = req.query;

        // Build filter
        const filter = {};
        if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            filter.status = status;
        }

        const requests = await AccessRequest.find(filter)
            .populate('userId', 'username email')
            .populate('reviewedBy', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: {
                requests
            }
        });
    } catch (error) {
        console.error('Get all requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching requests',
            error: error.message
        });
    }
};

// @desc    Approve an access request
// @route   PUT /api/requests/:id/approve
// @access  Private (APPROVER only)
exports.approveRequest = async (req, res) => {
    try {
        const request = await AccessRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Access request not found'
            });
        }

        if (request.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve request. Current status: ${request.status}`
            });
        }

        request.status = 'APPROVED';
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();

        await request.save();

        await request.populate('userId', 'username email');
        await request.populate('reviewedBy', 'username email');

        res.status(200).json({
            success: true,
            message: 'Access request approved successfully',
            data: {
                request
            }
        });
    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving request',
            error: error.message
        });
    }
};

// @desc    Reject an access request
// @route   PUT /api/requests/:id/reject
// @access  Private (APPROVER only)
exports.rejectRequest = async (req, res) => {
    try {
        const request = await AccessRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Access request not found'
            });
        }

        if (request.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject request. Current status: ${request.status}`
            });
        }

        request.status = 'REJECTED';
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();

        await request.save();

        await request.populate('userId', 'username email');
        await request.populate('reviewedBy', 'username email');

        res.status(200).json({
            success: true,
            message: 'Access request rejected successfully',
            data: {
                request
            }
        });
    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rejecting request',
            error: error.message
        });
    }
};
