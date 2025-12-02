import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        name: '',
        mobile: '',
        pinCode: '',
        address: '',
        locality: '',
        city: '',
        state: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('STRIPE');

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Backend has typo: uses 'adderss' instead of 'address'
            const addressPayload = {
                name: address.name,
                mobile: address.mobile,
                pinCode: address.pinCode,
                adderss: address.address, // Backend typo - must use 'adderss'
                locality: address.locality,
                city: address.city,
                state: address.state
            };

            const response = await api.post(`/api/orders?paymentMethod=${paymentMethod}`, addressPayload);

            if (paymentMethod === 'STRIPE' && response.data.payment_link_url) {
                window.location.href = response.data.payment_link_url;
            } else if (paymentMethod === 'CASH_ON_DELIVERY') {
                toast.success('Order placed successfully!');
                navigate('/payment/success?payment_method=COD');
            }
        } catch (error) {
            console.error("Error creating order", error);
            toast.error("Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-grid">
                <div className="checkout-form-section">
                    <h2>Shipping Address</h2>
                    <form onSubmit={handleSubmit} className="address-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={address.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="text" name="mobile" value={address.mobile} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Pincode</label>
                                <input type="text" name="pinCode" value={address.pinCode} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Locality</label>
                                <input type="text" name="locality" value={address.locality} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address (Area and Street)</label>
                            <textarea name="address" value={address.address} onChange={handleChange} required rows="3"></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City/District/Town</label>
                                <input type="text" name="city" value={address.city} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" name="state" value={address.state} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="payment-section">
                            <h3>Payment Method</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'STRIPE' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="STRIPE"
                                        checked={paymentMethod === 'STRIPE'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Stripe / Card</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'CASH_ON_DELIVERY' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CASH_ON_DELIVERY"
                                        checked={paymentMethod === 'CASH_ON_DELIVERY'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="place-order-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
