import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import PricingCard from '../../components/subscription/PricingCard';

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    useEffect(() => {
        fetchPlans();
        fetchCurrentSubscription();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await api.get('/api/seller/subscription/plans');
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const fetchCurrentSubscription = async () => {
        try {
            const response = await api.get('/api/seller/subscription/current');
            setCurrentSubscription(response.data);
        } catch (error) {
            console.error('Error fetching subscription:', error);
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
                // Handle free plan upgrade immediately
                fetchCurrentSubscription();
                alert('Subscribed successfully!');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Subscription failed. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Choose Your Plan
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Select the perfect plan for your business needs
                </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        isCurrent={currentSubscription?.plan?.id === plan.id}
                        onSubscribe={handleSubscribe}
                    />
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
