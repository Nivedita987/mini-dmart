import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        API.get(`/products/${id}`).then(res => setProduct(res.data));
    }, [id]);

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.productId === product._id);
        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({ productId: product._id, name: product.name, price: product.price, image: product.image, quantity: qty });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert("Added to cart!");
        navigate('/cart');
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container product-details">
            <img src={product.image} alt={product.name} width="300" />
            <div className="info">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <h2>₹{product.price}</h2>
                <p>Stock: {product.stock}</p>
                {product.stock > 0 ? (
                    <>
                        <input type="number" min="1" max={product.stock} value={qty} onChange={(e) => setQty(parseInt(e.target.value))} />
                        <button className="btn" onClick={addToCart}>Add to Cart</button>
                    </>
                ) : <p className="error">Out of Stock</p>}
            </div>
        </div>
    );
};

export default ProductDetails;