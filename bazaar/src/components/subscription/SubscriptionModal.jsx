import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import PricingCard from './PricingCard';
import './SubscriptionModal.css';

const SubscriptionModal = ({ open, onClose }) => {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if (open) {
            fetchPlans();
        }
    }, [open]);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/api/seller/subscription/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleSubscribe = async (plan) => {
        try {
            const response = await api.post(
                '/api/seller/subscription/subscribe',
                {
                    planName: plan.name,
                    planType: plan.planType,
                    price: plan.price,
                }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                alert('Subscribed successfully!');
                onClose();
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Subscription failed. Please try again.');
        }
    };

    if (!open) return null;

    return (
        <div className="subscription-modal-overlay">
            <div className="subscription-modal-content">
                <div className="subscription-modal-header">
                    <div>
                        <h2>Customize your subscription</h2>
                        <p className="subscription-modal-subtitle">
                            Choose the plan that best fits your needs. Upgrade, downgrade, or cancel anytime.
                        </p>
                    </div>
                    <button onClick={onClose} className="subscription-modal-close">
                        ✕
                    </button>
                </div>

                <div className="subscription-modal-body">
                    <div className="plans-grid">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                isCurrent={false}
                                onSubscribe={handleSubscribe}
                            />
                        ))}
                    </div>
                </div>

                <div className="subscription-modal-footer">
                    <p>
                        💳 Secure payment powered by Stripe • 🔒 Cancel anytime • 💬 24/7 Support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
