const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createReturnRequest = async (req, res) => {
    try {
        const { orderId, productId, type, reason, replacementProductId } = req.body;

        // 1. Check eligibility
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.status !== 'COMPLETED') {
            return res.status(400).json({ message: "Only completed orders are eligible for return/exchange." });
        }

        // 2. Prevent duplicates
        const existing = await ReturnRequest.findOne({ order: orderId, product: productId });
        if (existing) return res.status(400).json({ message: "Request already exists for this item." });

        const request = await ReturnRequest.create({
            user: req.user._id,
            order: orderId,
            product: productId,
            type,
            reason,
            replacementProduct: type === 'EXCHANGE' ? replacementProductId : undefined
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyReturns = async (req, res) => {
    const requests = await ReturnRequest.find({ user: req.user._id }).populate('product order').sort({ createdAt: -1 });
    res.json(requests);
};

exports.getAllReturns = async (req, res) => {
    const requests = await ReturnRequest.find().populate('user product order replacementProduct').sort({ createdAt: -1 });
    res.json(requests);
};

exports.updateReturnStatus = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const request = await ReturnRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Prevent double processing
        if (request.status === 'COMPLETED') return res.status(400).json({ message: "Already completed" });

        // INVENTORY LOGIC
        if (status === 'COMPLETED') {
            const originalProduct = await Product.findById(request.product);
            
            if (request.type === 'RETURN') {
                originalProduct.stock += 1; // Simplify to 1 item for interview logic
                await originalProduct.save();
            } else if (request.type === 'EXCHANGE') {
                const replacement = await Product.findById(request.replacementProduct);
                if (replacement.stock < 1) return res.status(400).json({ message: "Replacement out of stock" });
                
                originalProduct.stock += 1;
                replacement.stock -= 1;
                await originalProduct.save();
                await replacement.save();
            }
        }

        request.status = status;
        request.adminComment = adminComment;
        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};