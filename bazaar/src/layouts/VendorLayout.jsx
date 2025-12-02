import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const VendorLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/vendor/products', icon: Package },
        { name: 'Orders', href: '/vendor/orders', icon: ShoppingBag },
        { name: 'Settings', href: '/vendor/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-2xl font-bold text-primary">Bazaar Seller</span>
                    </div>
                    <nav className="mt-8 flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-indigo-50 text-primary'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex-shrink-0 w-full group block"
                    >
                        <div className="flex items-center">
                            <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Logout</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex-col flex-1">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
