import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { User, MapPin, Mail, Phone } from 'lucide-react';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and contact information.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <User className="h-4 w-4 mr-2" /> Full Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile?.fullName || user?.fullName}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Mail className="h-4 w-4 mr-2" /> Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile?.email || user?.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <Phone className="h-4 w-4 mr-2" /> Phone
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile?.mobile || 'Not provided'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" /> Role
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">{profile?.role}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Addresses</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    {profile?.addresses && profile.addresses.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {profile.addresses.map((addr) => (
                                <li key={addr.id} className="py-4">
                                    <p className="text-sm font-medium text-gray-900">{addr.firstName} {addr.lastName}</p>
                                    <p className="text-sm text-gray-500">{addr.streetAddress}, {addr.city}, {addr.state} {addr.zipCode}</p>
                                    <p className="text-sm text-gray-500">{addr.mobile}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No addresses saved.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
