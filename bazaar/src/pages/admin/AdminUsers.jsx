import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { page, size: 10 };
            if (search) params.search = search;

            const response = await api.get('/admin/users', { params });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser({ ...user });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/admin/users/${editingUser.id}`, {
                fullName: editingUser.fullName,
                email: editingUser.email,
                mobile: editingUser.mobile
            });
            toast.success('User updated successfully');
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/admin/users/${userToDelete.id}`);
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'ROLE_ADMIN': return 'status-badge status-admin';
            case 'ROLE_SELLER': return 'status-badge status-seller';
            case 'ROLE_CUSTOMER': return 'status-badge status-customer';
            default: return 'status-badge';
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>User Management</h1>
            </div>

            <div className="admin-filters">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Role</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No users found</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <span className="primary-text">{user.fullName || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile || 'N/A'}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                            className={getRoleBadgeClass(user.role)}
                                            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                        >
                                            <option value="ROLE_CUSTOMER">Customer</option>
                                            <option value="ROLE_SELLER">Seller</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(user)} className="action-btn edit" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(user)} className="action-btn delete" title="Delete">
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

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit User</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    value={editingUser?.fullName || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    value={editingUser?.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    value={editingUser?.mobile || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, mobile: e.target.value })}
                                    className="form-input"
                                />
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
                            <h3>Delete User</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-gray-600">Are you sure you want to delete user <strong>{userToDelete?.email}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleConfirmDelete} className="btn-delete">Delete User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
