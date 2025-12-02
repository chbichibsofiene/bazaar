import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Auth.css';

const Signup = () => {
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP verification
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const navigate = useNavigate();

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

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup-send-otp', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            toast.success('OTP sent to your email!');
            setStep(2);
            setTimer(600); // Reset timer
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
            toast.error('Failed to send OTP');
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
            const response = await api.post('/auth/signup-verify-otp', {
                email: formData.email,
                otp: otp
            });

            // Store JWT token
            const token = response.data.jwt;
            localStorage.setItem('jwt', token);

            toast.success('Signup successful! Welcome to Bazaar.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/signup-send-otp', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            toast.success('New OTP sent to your email!');
            setTimer(600); // Reset timer
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">
                    {step === 1 ? 'Sign up to get started' : 'Verify your email'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                {step === 1 ? (
                    // Step 1: Collect user information
                    <form onSubmit={handleSendOTP} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
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
                            <label htmlFor="password">Password</label>
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send Verification Code'}
                        </button>
                    </form>
                ) : (
                    // Step 2: Verify OTP
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
                                Code expired. Please request a new one.
                            </p>
                        )}

                        <button type="submit" className="auth-button" disabled={loading || timer === 0}>
                            {loading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                background: 'transparent',
                                color: '#667eea',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Resend Code
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
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
