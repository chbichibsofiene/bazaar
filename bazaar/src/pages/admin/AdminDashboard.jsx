import React from 'react';
import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const stats = [
        { name: 'Total Users', stat: '2,450', icon: Users, type: 'users' },
        { name: 'Total Vendors', stat: '120', icon: Store, type: 'vendors' },
        { name: 'Total Orders', stat: '15,300', icon: ShoppingBag, type: 'orders' },
        { name: 'Total Revenue', stat: '$1.2M', icon: DollarSign, type: 'revenue' },
    ];

    return (
        <div className="admin-dashboard">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="stats-grid">
                {stats.map((item) => (
                    <div key={item.name} className="stat-card">
                        <div className={`stat-icon ${item.type}`}>
                            <item.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{item.name}</h3>
                            <p>{item.stat}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
