const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['RETURN', 'EXCHANGE'], required: true },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'], 
        default: 'REQUESTED' 
    },
    replacementProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    adminComment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);