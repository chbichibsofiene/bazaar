import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('success');

    useEffect(() => {
        const paymentMethod = searchParams.get('payment_method');
        const paymentIntent = searchParams.get('payment_intent');

        // You can add logic here to verify payment with backend
        // For now, we'll just check if it's COD or card payment
        if (paymentMethod === 'COD') {
            setPaymentStatus('success');
        } else if (paymentIntent) {
            // Stripe payment - could verify with backend here
            setPaymentStatus('success');
        }
    }, [searchParams]);

    return (
        <div className="payment-success-container">
            <div className="payment-success-card">
                {paymentStatus === 'success' ? (
                    <>
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1>Payment Successful!</h1>
                        <p>Thank you for your order. Your payment has been processed successfully.</p>
                        <div className="action-buttons">
                            <button onClick={() => navigate('/')} className="btn-primary">
                                Continue Shopping
                            </button>
                            <button onClick={() => navigate('/orders')} className="btn-secondary">
                                View Orders
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="error-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1>Payment Failed</h1>
                        <p>There was an issue processing your payment. Please try again.</p>
                        <div className="action-buttons">
                            <button onClick={() => navigate('/checkout')} className="btn-primary">
                                Try Again
                            </button>
                            <button onClick={() => navigate('/')} className="btn-secondary">
                                Back to Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
