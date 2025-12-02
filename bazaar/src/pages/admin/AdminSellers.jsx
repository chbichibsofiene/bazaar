import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, Trash2, Mail } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sellerToDelete, setSellerToDelete] = useState(null);

    useEffect(() => {
        fetchSellers();
    }, [page, search, statusFilter]);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const params = { page, size: 10 };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;

            const response = await api.get('/admin/sellers', { params });
            setSellers(response.data.sellers);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching sellers:', error);
            toast.error('Failed to load sellers');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (sellerId, newStatus) => {
        try {
            await api.patch(`/admin/sellers/${sellerId}/status`, { status: newStatus });
            toast.success(`Seller ${newStatus.toLowerCase()} successfully`);
            fetchSellers();
        } catch (error) {
            console.error('Error updating seller status:', error);
            toast.error('Failed to update seller status');
        }
    };

    const handleViewDetails = (seller) => {
        setSelectedSeller(seller);
        setShowDetailsModal(true);
    };

    const handleVerifyEmail = async (sellerId) => {
        try {
            await api.patch(`/admin/sellers/${sellerId}/verify-email`);
            toast.success('Email verified successfully');
            fetchSellers();
        } catch (error) {
            console.error('Error verifying email:', error);
            toast.error('Failed to verify email');
        }
    };

    const handleDeleteClick = (seller) => {
        setSellerToDelete(seller);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/admin/sellers/${sellerToDelete.id}`);
            toast.success('Seller deleted successfully');
            setShowDeleteModal(false);
            fetchSellers();
        } catch (error) {
            console.error('Error deleting seller:', error);
            if (error.response?.status === 500) {
                toast.error('Cannot delete this seller. They may have products or orders associated with them.');
            } else {
                toast.error('Failed to delete seller');
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING_VERIFICATION': return 'status-badge status-pending';
            case 'ACTIVE': return 'status-badge status-active';
            case 'SUSPENDED': return 'status-badge status-suspended';
            case 'DEACTIVATED': return 'status-badge status-customer';
            case 'BANNED': return 'status-badge status-suspended';
            default: return 'status-badge';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING_VERIFICATION': return 'Pending';
            case 'ACTIVE': return 'Active';
            case 'SUSPENDED': return 'Suspended';
            case 'DEACTIVATED': return 'Deactivated';
            case 'BANNED': return 'Banned';
            default: return status;
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Seller Management</h1>
            </div>

            <div className="admin-filters">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        className="search-input"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                    }}
                    className="filter-select"
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING_VERIFICATION">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DEACTIVATED">Deactivated</option>
                </select>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Seller</th>
                            <th>Email</th>
                            <th>Business</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : sellers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No sellers found</td></tr>
                        ) : (
                            sellers.map((seller) => (
                                <tr key={seller.id}>
                                    <td>
                                        <div className="user-info">
                                            <span className="primary-text">{seller.sellerName || 'N/A'}</span>
                                            <span className="secondary-text">{seller.mobile || 'No phone'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-info">
                                            <span className="primary-text">{seller.email}</span>
                                            <span className="secondary-text">{seller.isEmailVerified ? '✓ Verified' : '✗ Not verified'}</span>
                                        </div>
                                    </td>
                                    <td>{seller.businessDetails?.businessName || 'N/A'}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(seller.accountStatus)}>
                                            {getStatusLabel(seller.accountStatus)}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleViewDetails(seller)} className="action-btn view" title="View Details">
                                                <Eye size={18} />
                                            </button>
                                            {!seller.isEmailVerified && (
                                                <button onClick={() => handleVerifyEmail(seller.id)} className="action-btn edit" title="Verify Email">
                                                    <Mail size={18} />
                                                </button>
                                            )}
                                            {seller.accountStatus === 'PENDING_VERIFICATION' && (
                                                <button onClick={() => handleStatusChange(seller.id, 'ACTIVE')} className="action-btn view" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {seller.accountStatus === 'ACTIVE' && (
                                                <button onClick={() => handleStatusChange(seller.id, 'SUSPENDED')} className="action-btn delete" title="Suspend">
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            {seller.accountStatus === 'SUSPENDED' && (
                                                <button onClick={() => handleStatusChange(seller.id, 'ACTIVE')} className="action-btn view" title="Activate">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteClick(seller)} className="action-btn delete" title="Delete">
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

            {showDetailsModal && selectedSeller && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Seller Details</h3>
                            <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-6">
                                <h4 className="font-bold mb-3 text-gray-900">Basic Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{selectedSeller.sellerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedSeller.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Mobile</p>
                                        <p className="font-medium">{selectedSeller.mobile || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Verified</p>
                                        <p className="font-medium">{selectedSeller.isEmailVerified ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold mb-3 text-gray-900">Business Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Business Name</p>
                                        <p className="font-medium">{selectedSeller.businessDetails?.businessName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">GSTIN</p>
                                        <p className="font-medium">{selectedSeller.GSTIN || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold mb-3 text-gray-900">Bank Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Account Number</p>
                                        <p className="font-medium">{selectedSeller.bankDetails?.accountNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Account Holder</p>
                                        <p className="font-medium">{selectedSeller.bankDetails?.accountHolderName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">IFSC Code</p>
                                        <p className="font-medium">{selectedSeller.bankDetails?.ifscCode || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-3 text-gray-900">Pickup Address</h4>
                                <p className="text-gray-700">
                                    {selectedSeller.pickupaddress?.streetAddress || 'N/A'}<br />
                                    {selectedSeller.pickupaddress?.city}, {selectedSeller.pickupaddress?.state} {selectedSeller.pickupaddress?.pinCode}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDetailsModal(false)} className="btn-cancel">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && sellerToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Delete Seller</h3>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-gray-600">Are you sure you want to delete seller <strong>{sellerToDelete.sellerName || sellerToDelete.email}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={handleConfirmDelete} className="btn-delete">Delete Seller</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSellers;
