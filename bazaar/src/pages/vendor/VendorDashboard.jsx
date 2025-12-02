import React from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

const VendorDashboard = () => {
    const stats = [
        { name: 'Total Revenue', stat: '$71,897', icon: DollarSign, change: '12%', changeType: 'increase' },
        { name: 'Total Orders', stat: '58.16%', icon: ShoppingBag, change: '2.02%', changeType: 'increase' },
        { name: 'Products', stat: '24.57%', icon: Package, change: '3.2%', changeType: 'decrease' },
        { name: 'Avg. Order Value', stat: '$120', icon: TrendingUp, change: '5.4%', changeType: 'increase' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className={`font-medium ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.change}
                                </span>
                                <span className="text-gray-500"> from last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                <div className="mt-4 bg-white shadow rounded-lg p-6">
                    <p className="text-gray-500">Chart or recent orders table will go here.</p>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
