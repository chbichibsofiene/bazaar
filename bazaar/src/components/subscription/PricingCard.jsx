import React from 'react';

const PricingCard = ({ plan, isCurrent, onSubscribe }) => {
    const isPro = plan.planType === 'PRO';
    const isIntermediate = plan.planType === 'INTERMEDIATE';
    const isBeginner = plan.planType === 'BEGINNER';
    const isFree = plan.planType === 'FREE';

    const isFeatured = isPro;

    const features = [
        plan.maxProducts === null ? 'Unlimited Email Sending' : `${plan.maxProducts} Products`,
        isPro ? 'AI-Powered Delivery' : isBeginner ? 'Gradual Warm-Up' : 'Warm-Up Algorithms',
        isPro ? 'Advanced Analytics' : 'Analytics Dashboard',
        isPro ? 'Dedicated Support' : isIntermediate ? 'IP Reputation Monitoring' : isBeginner ? 'Improved Analytics' : 'Basic Reporting'
    ];

    const getDescription = () => {
        if (isFeatured) return "about how we can help you scale your email outreach while maximizing your deliverability and engagement.";
        if (isIntermediate) return "Ideal for enterprises handling large campaigns across various industries.";
        if (isBeginner) return "Suitable for companies needs better deliverability rates.";
        return "For individuals who want to try out the most quick email warmup.";
    };

    const getBadgeText = () => {
        if (isCurrent) return 'Current';
        if (isFeatured) return 'Custom';
        if (isIntermediate) return 'Advanced Pro';
        if (isBeginner) return 'Pro Plus';
        return 'Pro';
    };

    return (
        <div className={`pricing-card ${isFeatured ? 'featured' : ''}`}>
            <div className="card-badge">
                <span>{getBadgeText()}</span>
            </div>

            <div className="card-content">
                {isFeatured && <h3 className="card-title">Let's talk</h3>}
                <p className="card-description">{getDescription()}</p>

                <div className="card-price">
                    <div className="price-row">
                        <span className="amount">{plan.price / 100}TND</span>
                        <span className="period">/mon</span>
                    </div>
                    <p className="credits">
                        {plan.maxProducts === null ? '500k' : `${plan.maxProducts}k`} monthly credits
                    </p>
                </div>

                <ul className="card-features">
                    {features.map((feature, index) => (
                        <li key={index}>
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={() => onSubscribe(plan)}
                    disabled={isCurrent}
                    className="card-button"
                >
                    {isCurrent ? '✓ Current Plan' : isFeatured ? 'Book a Call' : 'Get Started'}
                </button>
            </div>
        </div>
    );
};

export default PricingCard;
