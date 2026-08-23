const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


// PLACE ORDER

exports.placeOrder = async (req, res) => {
    try {
        const { fulfillmentType, shippingAddress } = req.body;

        // Validate fulfillment type
        if (!['PICKUP', 'DELIVERY'].includes(fulfillmentType)) {
            return res.status(400).json({
                message: 'Please select Pickup or Delivery'
            });
        }

        // Delivery requires address
        if (
            fulfillmentType === 'DELIVERY' &&
            (!shippingAddress ||
                !shippingAddress.fullName ||
                !shippingAddress.phone ||
                !shippingAddress.address)
        ) {
            return res.status(400).json({
                message: 'Please provide complete delivery details'
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Check stock and prepare order items
        for (const item of cart.items) {

            if (!item.product) {
                return res.status(400).json({
                    message: 'A product in your cart no longer exists'
                });
            }

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.product.name}`
                });
            }

            const subtotal =
                item.product.price * item.quantity;

            totalAmount += subtotal;

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: subtotal
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount: totalAmount,
            fulfillmentType: fulfillmentType,
            shippingAddress:
                fulfillmentType === 'DELIVERY'
                    ? shippingAddress
                    : undefined,
            status: 'PLACED'
        });

        // Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);

    } catch (error) {
        console.error('Place Order Error:', error);

        res.status(500).json({
            message: 'Failed to place order',
            error: error.message
        });
    }
};


// GET MY ORDERS

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch orders'
        });
    }
};


// GET ORDER DETAILS

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(
            req.params.id
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Customer can only see their own order
        if (
            req.user.role === 'CUSTOMER' &&
            order.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        res.json(order);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch order'
        });
    }
};



// CANCEL ORDER

exports.cancelOrder = async (req, res) => {
    try {
        console.log("Cancel request received for Order:", req.params.id);
        
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 1. Check Ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only cancel your own orders" });
        }

        // 2. Check Eligibility (Only PLACED orders)
        if (order.status !== 'PLACED') {
            return res.status(400).json({ 
                message: `Order cannot be cancelled because it is already ${order.status}` 
            });
        }

        // 3. Perform Cancellation
        order.status = 'CANCELLED';
        await order.save();

        // 4. Restore Stock to Inventory
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } } 
            );
        }

        console.log("Order cancelled and stock restored successfully");
        res.json({ message: "Order cancelled successfully", order });

    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Server error during cancellation" });
    }
};


// ADMIN - GET ALL ORDERS

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({
                createdAt: -1
            });

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch all orders'
        });
    }
};


// ===============================
// ADMIN - UPDATE ORDER STATUS
// ===============================
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        // --- Order Lifecycle Rules ---
        const validStatuses = ['PLACED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

        if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
            return res.status(400).json({ message: "Cannot change status of a finished order" });
        }

        // Delivery vs Pickup restriction
        if (status === 'OUT_FOR_DELIVERY' && order.fulfillmentType === 'PICKUP') {
            return res.status(400).json({ message: "Pickup orders cannot be set to Out for Delivery" });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

