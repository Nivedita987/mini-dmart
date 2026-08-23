import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        try {
            const { data } = await API.get('/cart');
            setCart(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const handleQtyChange = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await API.put('/cart/update', { productId, quantity: newQty });
            fetchCart();
        } catch (err) { alert("Error updating quantity"); }
    };

    const removeItem = async (id) => {
        try {
            await API.delete(`/cart/remove/${id}`);
            fetchCart();
        } catch (err) { alert("Error removing item"); }
    };

    if (loading) return <div className="container">Loading Cart...</div>;

    const total = cart?.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;

    return (
        <div className="container">
            <h1>Shopping Cart</h1>
            {(!cart || cart.items.length === 0) ? (
                <div className="center-content">
                    <p>Your cart is empty.</p>
                    <Link to="/products" className="btn">Browse Catalog</Link>
                </div>
            ) : (
                <>
                    <div className="cart-list">
                        {cart.items.map(item => (
                            <div key={item.product._id} className="cart-item">
                                <img src={item.product.image} alt={item.product.name} width="80" />
                                <div className="cart-item-info">
                                    <h3>{item.product.name}</h3>
                                    <p>Price: ₹{item.product.price}</p>
                                    <div className="qty-controls">
                                        <button onClick={() => handleQtyChange(item.product._id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQtyChange(item.product._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <p>Subtotal: ₹{item.product.price * item.quantity}</p>
                                    <button className="btn-delete" onClick={() => removeItem(item.product._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <h2>Total: ₹{total}</h2>
                        <button className="btn-submit" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;