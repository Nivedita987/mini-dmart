const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number
    }],
    totalAmount: { type: Number, required: true },
    fulfillmentType: { 
        type: String, 
        enum: ['PICKUP', 'DELIVERY'], // Exact values expected
        required: [true, 'Please specify if this is a Pickup or Delivery'] 
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String
    },
    status: { 
        type: String, 
        enum: ['PLACED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'],
        default: 'PLACED' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);