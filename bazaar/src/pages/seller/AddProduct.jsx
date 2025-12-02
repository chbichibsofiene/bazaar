import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Wand2 } from 'lucide-react';
import api from '../../services/api';
import './AddProduct.css';

const AddProduct = ({ onClose, onProductAdded, editMode = false, initialData = null }) => {
    const [formData, setFormData] = useState(
        editMode && initialData
            ? {
                title: initialData.title || '',
                description: initialData.description || '',
                mrpPrice: initialData.mrpPrice || '',
                sellingPrice: initialData.sellingPrice || '',
                quantity: initialData.quantity || '',
                color: initialData.color || '',
                category: initialData.category?.categoryId || '',
                category2: '',
                category3: '',
                size: initialData.sizes || '',
                images: initialData.images?.length ? [...initialData.images, '', ''].slice(0, 3) : ['', '', '']
            }
            : {
                title: '',
                description: '',
                mrpPrice: '',
                sellingPrice: '',
                quantity: '',
                color: '',
                category: '',
                category2: '',
                category3: '',
                size: '',
                images: ['', '', '']
            }
    );
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        const imageUrl = formData.images[0];
        if (!imageUrl) {
            toast.error('Please add an image URL first');
            return;
        }

        setGenerating(true);
        try {
            // In a real app, this would call an AI endpoint
            // const response = await api.post('/api/ai/generate-description', { imageUrl, title: formData.title });

            // Simulating AI delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiDescription = `Premium quality ${formData.title || 'product'} designed for excellence. ` +
                `This item features a modern design in ${formData.color || 'various colors'} ` +
                `and is crafted with attention to detail. Perfect for ${formData.category || 'daily use'}, ` +
                `it combines style with functionality. The ${formData.size ? `available sizes (${formData.size}) ensure` : 'versatile design ensures'} ` +
                `a perfect fit for your needs.`;

            setFormData(prev => ({ ...prev, description: aiDescription }));
            toast.success('Description generated with AI ✨');
        } catch (error) {
            console.error('Error generating description:', error);
            toast.error('Failed to generate description');
        } finally {
            setGenerating(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (editMode && initialData) {
                // For updates, send the complete product object
                const updatedProduct = {
                    ...initialData, // Keep all existing fields
                    title: formData.title,
                    description: formData.description,
                    mrpPrice: parseFloat(formData.mrpPrice),
                    sellingPrice: parseFloat(formData.sellingPrice),
                    quantity: parseInt(formData.quantity) || 0,
                    color: formData.color,
                    sizes: formData.size,
                    images: formData.images.filter(img => img.trim() !== '')
                };

                response = await api.put(`/api/sellers/products/${initialData.id}`, updatedProduct);
                toast.success('Product updated successfully!');
            } else {
                // For new products, use the create request format
                const productData = {
                    title: formData.title,
                    description: formData.description,
                    mrpPrice: parseInt(formData.mrpPrice),
                    sellingPrice: parseInt(formData.sellingPrice),
                    quantity: parseInt(formData.quantity) || 0,
                    color: formData.color,
                    category: formData.category,
                    category2: formData.category2,
                    category3: formData.category3,
                    size: formData.size,
                    images: formData.images.filter(img => img.trim() !== '')
                };

                response = await api.post('/api/sellers/products', productData);
                toast.success('Product created successfully!');
            }

            onProductAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            console.error('Error details:', error.response?.data);
            toast.error(editMode ? 'Failed to update product' : 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label>Product Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter product title"
                        />
                    </div>

                    <div className="form-group">
                        <div className="label-with-action">
                            <label>Description *</label>
                            <button
                                type="button"
                                className="ai-generate-btn"
                                onClick={handleGenerateDescription}
                                disabled={generating}
                                title="Generate description based on image and title"
                            >
                                <Wand2 size={14} />
                                {generating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter product description"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>MRP Price *</label>
                            <input
                                type="number"
                                name="mrpPrice"
                                value={formData.mrpPrice}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Selling Price *</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                required
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity *</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="e.g., Red, Blue"
                            />
                        </div>

                        <div className="form-group">
                            <label>Size</label>
                            <input
                                type="text"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="e.g., S, M, L, XL"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category (Level 1) *</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="e.g., clothing"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category (Level 2)</label>
                            <input
                                type="text"
                                name="category2"
                                value={formData.category2}
                                onChange={handleChange}
                                placeholder="e.g., mens_clothing"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category (Level 3)</label>
                            <input
                                type="text"
                                name="category3"
                                value={formData.category3}
                                onChange={handleChange}
                                placeholder="e.g., shirts"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product Images (URLs)</label>
                        {formData.images.map((img, index) => (
                            <input
                                key={index}
                                type="url"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                placeholder={`Image URL ${index + 1}`}
                                style={{ marginBottom: '0.5rem' }}
                            />
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
