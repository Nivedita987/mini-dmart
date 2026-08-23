import React, { useState, useEffect } from 'react';
import API from '../services/api';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load categories when the page opens
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/categories');
            setCategories(data);
        } catch (err) {
            alert("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Update existing category
                await API.put(`/categories/${editId}`, formData);
                alert("Category updated successfully");
            } else {
                // Create new category
                await API.post('/categories', formData);
                alert("Category added successfully");
            }
            // Reset form
            setFormData({ name: '', description: '' });
            setEditId(null);
            fetchCategories(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Error saving category");
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setFormData({ name: cat.name, description: cat.description });
        window.scrollTo(0, 0); // Scroll to form
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? Deleting a category might affect products linked to it.")) {
            try {
                await API.delete(`/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert("Could not delete category");
            }
        }
    };

    const cancelEdit = () => {
        setEditId(null);
        setFormData({ name: '', description: '' });
    };

    return (
        <div className="container">
            <h2>Category Management</h2>

            {/* Category Form */}
            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form">
                    <h3>{editId ? "Edit Category" : "Add New Category"}</h3>
                    <input 
                        type="text" 
                        placeholder="Category Name (e.g. Dairy, Snacks)" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        required 
                    />
                    <textarea 
                        placeholder="Description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                    <div className="form-buttons">
                        <button type="submit" className="btn">
                            {editId ? "Update Category" : "Add Category"}
                        </button>
                        {editId && (
                            <button type="button" onClick={cancelEdit} className="btn-outline">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories Table */}
            {loading ? <p>Loading categories...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="3">No categories created yet.</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat._id}>
                                    <td><strong>{cat.name}</strong></td>
                                    <td>{cat.description || "No description"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(cat)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDelete(cat._id)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageCategories;