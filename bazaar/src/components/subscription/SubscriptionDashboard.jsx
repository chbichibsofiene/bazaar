import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Crown, Package, Calendar, Zap, ArrowUpCircle } from 'lucide-react';
import './SubscriptionDashboard.css';

const SubscriptionDashboard = ({ onUpgrade }) => {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const response = await api.get('/api/seller/subscription/current');
            setSubscription(response.data);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    if (!subscription) return <div className="loading">Loading subscription...</div>;

    const { plan, startDate, endDate } = subscription;

    if (!plan) {
        return (
            <div className="subscription-dashboard">
                <div className="sub-header">
                    <h3><Crown size={24} /> No Active Plan</h3>
                    <button onClick={onUpgrade} className="upgrade-btn">
                        <Zap size={18} /> Select a Plan
                    </button>
                </div>
                <div className="no-plan">
                    <p>Please subscribe to a plan to start selling and access premium features.</p>
                </div>
            </div>
        );
    }

    const isUnlimited = plan.maxProducts === null;

    return (
        <div className="subscription-dashboard">
            <div className="sub-header">
                <h3><Crown size={24} /> Current Subscription</h3>
                <button onClick={onUpgrade} className="upgrade-btn">
                    <ArrowUpCircle size={18} /> Upgrade Plan
                </button>
            </div>

            <div className="sub-grid">
                <div className="sub-card">
                    <div className="sub-label">
                        <Zap size={18} />
                        <span>Current Plan</span>
                    </div>
                    <div className="sub-value">{plan.name}</div>
                </div>

                <div className="sub-card">
                    <div className="sub-label">
                        <Package size={18} />
                        <span>Product Limit</span>
                    </div>
                    <div className="sub-value">
                        {isUnlimited ? 'Unlimited' : `${plan.maxProducts} Items`}
                    </div>
                </div>

                <div className="sub-card">
                    <div className="sub-label">
                        <Calendar size={18} />
                        <span>Renews On</span>
                    </div>
                    <div className="sub-value">{endDate}</div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDashboard;
