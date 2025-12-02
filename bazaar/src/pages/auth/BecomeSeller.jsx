import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Mail, User, Lock, ArrowRight, Loader, Phone, FileText, Briefcase } from 'lucide-react';

const BecomeSeller = () => {
    const [formData, setFormData] = useState({
        sellerName: '',
        email: '',
        password: '',
        mobile: '',
        gstin: ''
    });
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/sent/login-signup-otp', {
                email: formData.email,
                role: 'ROLE_SELLER'
            });
            setShowOtpInput(true);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/sellers', {
                ...formData,
                verificationCode: { otp: otp } // Assuming backend expects this structure or handles verification separately
            });
            // After creation, maybe redirect to login or verify page? 
            // Based on SellerController, it returns the created seller. 
            // Usually we might need to verify email next.
            // But for now let's assume we can redirect to login.
            navigate('/login');
        } catch (err) {
            setError('Registration Failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Wait, looking at SellerController.java:
    // createSeller generates OTP and sends email. It doesn't verify OTP immediately during creation.
    // So the flow is: Fill form -> Submit -> Backend creates seller & sends OTP -> Frontend redirects to OTP verification page.

    // Let's adjust. The user wants to register. 
    // The backend `createSeller` method takes a `Seller` object.
    // It generates an OTP and sends it.

    // So the form should just submit the seller details.
    // Then we show an OTP input to verify?
    // The `SellerController` has `@PatchMapping("/verify/{otp}")`.

    // Revised Flow:
    // 1. User fills details (Name, Email, Mobile, GSTIN, Password).
    // 2. User clicks "Register".
    // 3. Backend creates Seller (status PENDING) and sends OTP (to console).
    // 4. Frontend shows OTP input.
    // 5. User enters OTP.
    // 6. Frontend calls `/sellers/verify/{otp}`.
    // 7. On success, redirect to Login.

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/sellers', {
                sellerName: formData.sellerName,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                GSTIN: formData.gstin
            });
            setShowOtpInput(true);
        } catch (err) {
            setError('Registration Failed. Email might be already in use.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.patch(`/sellers/verify/${otp}`);
            navigate('/login');
        } catch (err) {
            setError('Verification Failed. Invalid OTP.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Become a Seller
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start selling on Bazaar today
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {!showOtpInput ? (
                    <form className="mt-8 space-y-6" onSubmit={handleInitialSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative mb-4">
                                <label htmlFor="sellerName" className="sr-only">Seller Name</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="sellerName"
                                    name="sellerName"
                                    type="text"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Seller/Business Name"
                                    value={formData.sellerName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="mobile" className="sr-only">Mobile</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="text"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="gstin" className="sr-only">GSTIN</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="gstin"
                                    name="gstin"
                                    type="text"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="GSTIN"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative mb-4">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    <>
                                        Register as Seller
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <label htmlFor="otp" className="sr-only">OTP</label>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Enter Verification OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader className="animate-spin h-5 w-5 text-white" />
                                ) : (
                                    'Verify Email'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have a seller account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BecomeSeller;
