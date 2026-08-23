const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
            if (itemIndex > -1) {
                let newQty = cart.items[itemIndex].quantity + quantity;
                if (product.stock < newQty) return res.status(400).json({ message: "Cannot add more than available stock" });
                cart.items[itemIndex].quantity = newQty;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartQty = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const item = cart.items.find(p => p.product.toString() === productId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        cart.items = cart.items.filter(p => p.product.toString() !== req.params.productId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};