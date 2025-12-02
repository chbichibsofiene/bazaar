import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, User as UserIcon, Clock } from 'lucide-react';
import './DiscussionSection.css';

const DiscussionSection = ({ productId }) => {
    const { user } = useAuth();
    const [discussions, setDiscussions] = useState([]);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDiscussions();
    }, [productId]);

    const fetchDiscussions = async () => {
        try {
            const response = await api.get(`/api/products/${productId}/discussions`);
            setDiscussions(response.data);
        } catch (error) {
            console.error('Error fetching discussions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newDiscussion.trim()) return;

        setSubmitting(true);
        try {
            const response = await api.post(`/api/products/${productId}/discussions`, {
                content: newDiscussion
            });
            setDiscussions([...discussions, response.data]);
            setNewDiscussion('');
        } catch (error) {
            console.error('Error posting discussion:', error);
            alert('Failed to post discussion');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return <div className="discussion-loading"><div className="loading-spinner"></div></div>;
    }

    return (
        <div className="discussion-section">
            <div className="discussion-list">
                {discussions.length === 0 ? (
                    <div className="no-discussions">
                        <p>No discussions yet. Be the first to ask a question!</p>
                    </div>
                ) : (
                    discussions.map((discussion) => (
                        <div key={discussion.id} className="discussion-item">
                            <div className="discussion-header">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        <UserIcon size={16} />
                                    </div>
                                    <span className="user-name">
                                        {discussion.user ? `${discussion.user.firstName} ${discussion.user.lastName}` : 'Anonymous'}
                                    </span>
                                </div>
                                <div className="discussion-date">
                                    <Clock size={14} />
                                    <span>{formatDate(discussion.createdAt)}</span>
                                </div>
                            </div>
                            <div className="discussion-content">
                                <p>{discussion.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="discussion-form">
                    <div className="input-wrapper">
                        <textarea
                            value={newDiscussion}
                            onChange={(e) => setNewDiscussion(e.target.value)}
                            placeholder="Ask a question or start a discussion..."
                            rows={3}
                            required
                        />
                        <button type="submit" disabled={submitting || !newDiscussion.trim()}>
                            {submitting ? 'Posting...' : <><Send size={16} /> Post</>}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="login-prompt-discussion">
                    <p>Please log in to join the discussion.</p>
                </div>
            )}
        </div>
    );
};

export default DiscussionSection;
