import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: 0, stock: 0, category: '', image: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const { data } = await API.get('/products');
        setProducts(data);
    };

    const fetchCategories = async () => {
        const { data } = await API.get('/categories');
        setCategories(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await API.put(`/products/${editId}`, formData);
            } else {
                await API.post('/products', formData);
            }
            setFormData({ name: '', description: '', price: 0, stock: 0, category: '', image: '' });
            setEditId(null);
            fetchProducts();
        } catch (err) {
            alert("Error saving product");
        }
    };

    const handleEdit = (p) => {
        setEditId(p._id);
        setFormData({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category._id, image: p.image });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product?")) {
            await API.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div className="container">
            <h2>Inventory Management</h2>
            <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editId ? "Edit Product" : "Add New Product"}</h3>

        <div className="form-group">
            <label>Product Name</label>
            <input 
                type="text" 
                placeholder="e.g. Amul Gold Milk" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
            />
        </div>

    <div className="form-group">
        <label>Description</label>
        <textarea 
            placeholder="Describe the product..." 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            required 
        />
    </div>

    <div className="form-row">
        <div className="form-group">
            <label>Price (₹)</label>
            <input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
            />
        </div>

        <div className="form-group">
            <label>Stock Quantity</label>
            <input 
                type="number" 
                value={formData.stock} 
                onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                required 
            />
        </div>
    </div>

    <div className="form-group">
        <label>Category</label>
        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
            <option value="">-- Select a Category --</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
    </div>

    <div className="form-group">
        <label>Image URL</label>
        <input 
            type="text" 
            placeholder="https://example.com/image.jpg" 
            value={formData.image} 
            onChange={(e) => setFormData({...formData, image: e.target.value})} 
        />
    </div>

    <button type="submit" className="btn-submit">
        {editId ? "Update Product" : "Add Product"}
    </button>
</form>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;