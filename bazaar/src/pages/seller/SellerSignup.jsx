import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { loginSuccess } from '../../store/authSlice';
import '../Auth.css';

const SellerSignup = () => {
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP verification
    const [formData, setFormData] = useState({
        sellerName: '',
        email: '',
        password: '',
        mobile: '',
        businessName: '',
        businessEmail: '',
        businessMobile: '',
        businessAddress: '',
        gstin: '',
        // Bank details
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        ifscCode: '',
        // Pickup address
        pickupName: '',
        pickupLocality: '',
        pickupAddress: '',
        pickupCity: '',
        pickupState: '',
        pickupPincode: '',
        pickupMobile: ''
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [sellerId, setSellerId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Countdown timer for OTP
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const sellerData = {
                sellerName: formData.sellerName,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                businessDetails: {
                    businessName: formData.businessName,
                    businessEmail: formData.businessEmail || formData.email,
                    businessMobile: formData.businessMobile || formData.mobile,
                    businessAddress: formData.businessAddress
                },
                bankDetails: {
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    accountHolderName: formData.accountHolderName,
                    ifscCode: formData.ifscCode
                },
                pickupaddress: {
                    name: formData.pickupName,
                    locality: formData.pickupLocality,
                    adderss: formData.pickupAddress, // Note: backend has typo "adderss"
                    city: formData.pickupCity,
                    state: formData.pickupState,
                    pincode: formData.pickupPincode,
                    mobile: formData.pickupMobile || formData.mobile
                },
                gstin: formData.gstin
            };

            const response = await api.post('/sellers', sellerData);
            setSellerId(response.data.id);
            toast.success('Account created! Please check your email for verification code.');
            setStep(2);
            setTimer(600); // Reset timer
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || 'Failed to create seller account. Please try again.');
            toast.error('Signup failed');
        } finally {
            setLoading(false);
        }
    };



    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await api.patch(`/sellers/verify/${otp}`);
            const { jwt, role } = response.data;

            // Store in localStorage
            localStorage.setItem('jwt', jwt);

            // Update Redux state
            dispatch(loginSuccess({ jwt, role, user: null }));

            toast.success('Email verified successfully! Please choose a subscription plan.');

            // Redirect to dashboard (force reload to update AuthContext)
            window.location.href = '/seller/dashboard';
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.response?.data?.message || 'Invalid OTP');
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <h2>Become a Seller</h2>
                <p className="auth-subtitle">
                    {step === 1 ? 'Create your seller account' : 'Verify your email'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                {step === 1 ? (
                    // Step 1: Registration Form
                    <form onSubmit={handleSubmit} className="auth-form">
                        <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Personal Information</h3>

                        <div className="form-group">
                            <label htmlFor="sellerName">Seller Name *</label>
                            <input
                                type="text"
                                id="sellerName"
                                name="sellerName"
                                value={formData.sellerName}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number *</label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                placeholder="+1234567890"
                            />
                        </div>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Business Details</h3>

                        <div className="form-group">
                            <label htmlFor="businessName">Business Name *</label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                                placeholder="Your business name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="businessAddress">Business Address *</label>
                            <textarea
                                id="businessAddress"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                required
                                placeholder="Full business address"
                                rows="2"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gstin">GSTIN (Optional)</label>
                            <input
                                type="text"
                                id="gstin"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleChange}
                                placeholder="GST Identification Number"
                            />
                        </div>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Pickup Address</h3>

                        <div className="form-group">
                            <label htmlFor="pickupAddress">Address *</label>
                            <input
                                type="text"
                                id="pickupAddress"
                                name="pickupAddress"
                                value={formData.pickupAddress}
                                onChange={handleChange}
                                required
                                placeholder="Street address"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label htmlFor="pickupCity">City *</label>
                                <input
                                    type="text"
                                    id="pickupCity"
                                    name="pickupCity"
                                    value={formData.pickupCity}
                                    onChange={handleChange}
                                    required
                                    placeholder="City"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="pickupState">State *</label>
                                <input
                                    type="text"
                                    id="pickupState"
                                    name="pickupState"
                                    value={formData.pickupState}
                                    onChange={handleChange}
                                    required
                                    placeholder="State"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pickupPincode">Pincode *</label>
                            <input
                                type="text"
                                id="pickupPincode"
                                name="pickupPincode"
                                value={formData.pickupPincode}
                                onChange={handleChange}
                                required
                                placeholder="Postal code"
                            />
                        </div>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Bank Details</h3>

                        <div className="form-group">
                            <label htmlFor="bankName">Bank Name *</label>
                            <input
                                type="text"
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                                placeholder="Your bank name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="accountHolderName">Account Holder Name *</label>
                            <input
                                type="text"
                                id="accountHolderName"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                required
                                placeholder="Name on account"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="accountNumber">Account Number *</label>
                            <input
                                type="text"
                                id="accountNumber"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                required
                                placeholder="Bank account number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ifscCode">IFSC Code *</label>
                            <input
                                type="text"
                                id="ifscCode"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                required
                                placeholder="Bank IFSC code"
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Seller Account'}
                        </button>
                    </form>
                ) : (
                    // Step 2: OTP Verification
                    <form onSubmit={handleVerifyOTP} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="otp">Verification Code</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                pattern="[0-9]{6}"
                                style={{ fontSize: '1.2rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                            />
                            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                                We sent a code to {formData.email}
                            </small>
                        </div>

                        {timer > 0 ? (
                            <p style={{ textAlign: 'center', color: '#666', margin: '1rem 0' }}>
                                Code expires in: <strong>{formatTime(timer)}</strong>
                            </p>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#e74c3c', margin: '1rem 0' }}>
                                Code expired. Please contact support.
                            </p>
                        )}

                        <button type="submit" className="auth-button" disabled={loading || timer === 0}>
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{
                                marginTop: '0.5rem',
                                background: 'transparent',
                                color: '#666',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            ← Change Email
                        </button>
                    </form>
                )}

                <p className="auth-footer">
                    Already have an account? <a href="/seller/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default SellerSignup;
