import React, { useState, useEffect,useCallback } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const Products = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        fetchCategories();
    }, []); 

    useEffect(() => {
        fetchProducts();
    }, [search, category]); 

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories');
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load categories");
        }
    };

    const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
        let queryPath = `/products?search=${search}`;
        if (category) {
            queryPath += `&category=${category}`;
        }
        const { data } = await API.get(queryPath);
        setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch (err) {
        console.error("FetchProducts Error:", err);
    } finally {
        setLoading(false);
    }
}, [search, category]); // Function depends on search and category

useEffect(() => {
    fetchCategories();
}, []); 

useEffect(() => {
    fetchProducts();
}, [fetchProducts]); 
    // const fetchProducts = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         let queryPath = `/products?search=${search}`;
    //         if (category) {
    //             queryPath += `&category=${category}`;
    //         }

    //         const { data } = await API.get(queryPath);
        
    //         if (Array.isArray(data)) {
    //             setProducts(data);
    //         } else if (data.products && Array.isArray(data.products)) {
    //             setProducts(data.products);
    //         } else {
    //             setProducts([]);
    //         }
    //     } catch (err) {
    //         setError("Could not load products. Please check your connection.");
    //         console.error("FetchProducts Error:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleAddToCart = async (product) => {
        try {
            await API.post('/cart/add', { productId: product._id, quantity: 1 });
            alert(`${product.name} added to cart!`);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add to cart");
        }
    };

    return (
        <div className="container">
            <h1>Grocery Catalog</h1>

            <div className="filter-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="product-grid">
                    {products.length === 0 ? (
                        <p>No products found matching your search.</p>
                    ) : (
                        products.map(p => (
                            <div key={p._id} className="product-card">
                                <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} />
                                <h3>{p.name}</h3>
                                <p className="price">₹{p.price}</p>
                                <p className="stock-info">Stock: {p.stock}</p>

                                <div className="product-actions">
                                    <Link to={`/products/${p._id}`} className="btn-view">Details</Link>

                                    {(!user || user.role === 'CUSTOMER') && (
                                        <button
                                            className="btn-add-cart"
                                            onClick={() => handleAddToCart(p)}
                                            disabled={p.stock <= 0}
                                        >
                                            {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;