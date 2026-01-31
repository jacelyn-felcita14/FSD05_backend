const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestDetails: {
        type: {
            type: String,
            required: [true, 'Request type is required'],
            trim: true
        },
        reason: {
            type: String,
            required: [true, 'Request reason is required'],
            trim: true,
            minlength: [10, 'Reason must be at least 10 characters']
        },
        resource: {
            type: String,
            required: [true, 'Resource name is required'],
            trim: true
        }
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
accessRequestSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
