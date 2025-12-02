import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        image: '',
        level: 1,
        parentCategoryId: null
    });

    useEffect(() => {
        fetchCategories();
        fetchAllCategories();
    }, [page, search]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const params = { page, size: 10 };
            if (search) params.search = search;

            const response = await api.get('/admin/categories', { params });
            setCategories(response.data.categories);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCategories = async () => {
        try {
            const response = await api.get('/admin/categories/all');
            console.log('Fetched all categories:', response.data);
            // Ensure response.data is an array
            setAllCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching all categories:', error);
            setAllCategories([]);
        }
    };

    const handleCreate = () => {
        setNewCategory({
            name: '',
            image: '',
            level: 1,
            parentCategoryId: null
        });
        setShowCreateModal(true);
    };

    const handleSaveCreate = async () => {
        try {
            // Client-side validation
            if (!newCategory.name || newCategory.name.trim() === '') {
                toast.error('Category name is required');
                return;
            }

            if (newCategory.level < 1 || newCategory.level > 3) {
                toast.error('Level must be between 1 and 3');
                return;
            }

            // Validate parent category based on level
            if (newCategory.level === 1 && newCategory.parentCategoryId) {
                toast.error('Parent categories (Level 1) cannot have a parent');
                return;
            }

            if (newCategory.level > 1 && !newCategory.parentCategoryId) {
                toast.error(`Level ${newCategory.level} categories must have a parent category`);
                return;
            }

            // Use CategoryRequest DTO structure
            const categoryData = {
                name: newCategory.name.trim(),
                image: newCategory.image || null,
                level: newCategory.level,
                parentCategoryId: newCategory.parentCategoryId || null
            };

            console.log('Creating category with data:', categoryData);
            const response = await api.post('/admin/categories', categoryData);
            console.log('Category created successfully:', response.data);
            toast.success('Category created successfully');
            setShowCreateModal(false);
            fetchCategories();
            fetchAllCategories();
        } catch (error) {
            console.error('Error creating category:', error);
            console.error('Error response:', JSON.stringify(error.response?.data, null, 2));
            console.error('Error status:', error.response?.status);
            console.error('Error headers:', error.response?.headers);

            // Try to extract meaningful error message
            let errorMessage = 'Failed to create category';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.errors) {
                    // Handle validation errors array
                    errorMessage = Object.values(error.response.data.errors).join(', ');
                }
            }

            toast.error(errorMessage);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory({
            id: category.id,
            name: category.name,
            image: category.image || '',
            level: category.level,
            parentCategoryId: category.parentCategory?.id || null
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            // Use CategoryRequest DTO structure
            const categoryData = {
                name: editingCategory.name,
                image: editingCategory.image
                // Note: level and parentCategoryId cannot be changed after creation
            };
            await api.put(`/admin/categories/${editingCategory.id}`, categoryData);
            toast.success('Category updated successfully');
            setShowEditModal(false);
            fetchCategories();
            fetchAllCategories();
        } catch (error) {
            console.error('Error updating category:', error);
            const errorMessage = error.response?.data?.error || 'Failed to update category';
            toast.error(errorMessage);
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/admin/categories/${categoryToDelete.id}`);
            toast.success('Category deleted successfully');
            setShowDeleteModal(false);
            fetchCategories();
            fetchAllCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            if (error.response?.status === 409 || error.response?.status === 500) {
                toast.error(error.response?.data?.message || 'Cannot delete this category. It may have child categories or products associated with it.');
            } else {
                toast.error('Failed to delete category');
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Category Management</h1>
                <button onClick={handleCreate} className="admin-btn-primary">
                    <Plus size={20} className="mr-2" />
                    Add Category
                </button>
            </div>

            <div className="admin-filters">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or category ID..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category ID</th>
                            <th>Level</th>
                            <th>Parent</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No categories found</td></tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        <div className="user-info">
                                            <span className="primary-text">{category.name}</span>
                                        </div>
                                    </td>
                                    <td>{category.categoryId}</td>
                                    <td>{category.level}</td>
                                    <td>{category.parentCategory?.name || 'None'}</td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(category)} className="action-btn edit" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(category)} className="action-btn delete" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create Category</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input type="text" value={newCategory.image} onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })} className="form-input" placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Level * (1=Parent, 2=Child, 3=Sub)</label>
                                <select value={newCategory.level} onChange={(e) => setNewCategory({ ...newCategory, level: parseInt(e.target.value) })} className="form-select">
                                    <option value={1}>Level 1 - Parent Category</option>
                                    <option value={2}>Level 2 - Child Category</option>
                                    <option value={3}>Level 3 - Sub-category</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Parent Category</label>
                                <select
                                    value={newCategory.parentCategoryId || ''}
                                    onChange={(e) => setNewCategory({ ...newCategory, parentCategoryId: e.target.value ? parseInt(e.target.value) : null })}
                                    className="form-select"
                                    disabled={newCategory.level === 1}
                                >
                                    <option value="">Select Parent Category</option>
                                    {allCategories
                                        .filter(cat => {
                                            // Debug log (remove later)
                                            // console.log(`Checking cat ${cat.name} (Level ${cat.level}) for target level ${newCategory.level}`);

                                            const catLevel = parseInt(cat.level);
                                            const targetLevel = parseInt(newCategory.level);

                                            // If creating Level 2, show only Level 1 parents
                                            if (targetLevel === 2) return catLevel === 1;
                                            // If creating Level 3, show only Level 2 parents
                                            if (targetLevel === 3) return catLevel === 2;
                                            return false;
                                        })
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name} (Level {cat.level})</option>
                                        ))
                                    }
                                </select>
                                {newCategory.level === 1 && <small className="text-gray-500">Parent categories cannot have a parent</small>}
                                {newCategory.level > 1 && (
                                    <div className="text-sm mt-1">
                                        <small className="text-gray-500 block">Select a Level {newCategory.level - 1} category as parent</small>
                                        {allCategories.filter(cat => parseInt(cat.level) === parseInt(newCategory.level) - 1).length === 0 && (
                                            <small className="text-red-500 block">
                                                No Level {newCategory.level - 1} categories found. Please create a Level {newCategory.level - 1} category first.
                                            </small>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowCreateModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleSaveCreate} className="btn-save">Create Category</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Category</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Name *</label>
                                <input type="text" value={editingCategory?.name || ''} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input type="text" value={editingCategory?.image || ''} onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })} className="form-input" placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Level (Cannot be changed)</label>
                                <input type="text" value={`Level ${editingCategory?.level || 1}`} className="form-input" disabled />
                                <small className="text-gray-500">Level and parent category cannot be changed after creation</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowEditModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn-save">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Category</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-gray-600">Are you sure you want to delete category <strong>{categoryToDelete?.name}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleConfirmDelete} className="btn-delete">Delete Category</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
