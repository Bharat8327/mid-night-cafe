import { useState } from 'react';
import { Phone, Mail, MapPin, Star } from 'lucide-react';

const CustomerManagement = () => {
  const [customers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8901',
      address: '123 Main St, City',
      totalOrders: 25,
      totalSpent: 187.5,
      lastOrder: '2024-01-15',
      rating: 4.8,
      favorite: 'Cappuccino',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8902',
      address: '456 Oak Ave, City',
      totalOrders: 18,
      totalSpent: 142.0,
      lastOrder: '2024-01-14',
      rating: 4.9,
      favorite: 'Latte',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 234 567 8903',
      address: '789 Pine St, City',
      totalOrders: 32,
      totalSpent: 245.75,
      lastOrder: '2024-01-16',
      rating: 4.7,
      favorite: 'Espresso',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8904',
      address: '321 Elm St, City',
      totalOrders: 12,
      totalSpent: 98.25,
      lastOrder: '2024-01-13',
      rating: 4.6,
      favorite: 'Americano',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const callCustomer = (phone, name) => {
    alert(`Calling ${name} at ${phone}...`);
  };

  const emailCustomer = (email, name) => {
    alert(`Opening email to ${name} at ${email}...`);
  };

  const getTotalCustomers = () => customers.length;

  const getTotalRevenue = () =>
    customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  const getAverageOrderValue = () => {
    const totalOrders = customers.reduce(
      (sum, customer) => sum + customer.totalOrders,
      0,
    );
    const totalRevenue = getTotalRevenue();
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  };

  return (
    <div className="space-y-6 bg-[#020817] min-h-screen px-2 sm:px-10 ">
      <div>
        <h2 className="text-white text-3xl font-bold mb-2">
          Customer Management
        </h2>
        <p className="text-slate-400">
          Manage and track all customer information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="text-3xl font-bold text-white mb-2">
            {getTotalCustomers()}
          </div>
          <div className="text-slate-400">Total Customers</div>
        </div>
        <div className="bg-orange-900 p-6 rounded-lg border border-orange-700">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            ${getTotalRevenue().toFixed(2)}
          </div>
          <div className="text-orange-300">Total Revenue</div>
        </div>
        <div className="bg-blue-900 p-6 rounded-lg border border-blue-700">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            ${getAverageOrderValue().toFixed(2)}
          </div>
          <div className="text-blue-300">Avg Order Value</div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-orange-500 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-bold text-xl">
                  {customer.name}
                </h3>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="text-yellow-400 font-medium">
                    {customer.rating}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-orange-400 font-bold text-lg">
                  ${customer.totalSpent.toFixed(2)}
                </div>
                <div className="text-slate-400 text-sm">Total Spent</div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-slate-400" size={16} />
                <span className="text-slate-300">{customer.email}</span>
                <button
                  onClick={() => emailCustomer(customer.email, customer.name)}
                  className="text-orange-400 hover:text-orange-300 transition-colors text-sm cursor-pointer"
                >
                  Email
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-slate-400" size={16} />
                <span className="text-slate-300">{customer.phone}</span>
                <button
                  onClick={() => callCustomer(customer.phone, customer.name)}
                  className="text-green-400 hover:text-green-300 transition-colors text-sm cursor-pointer "
                >
                  Call
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-slate-400" size={16} />
                <span className="text-slate-300">{customer.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-white font-bold">
                  {customer.totalOrders}
                </div>
                <div className="text-slate-400 text-sm">Total Orders</div>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <div className="text-white font-bold">{customer.lastOrder}</div>
                <div className="text-slate-400 text-sm">Last Order</div>
              </div>
            </div>

            <div className="bg-slate-700 p-3 rounded-lg mb-4">
              <div className="text-slate-400 text-sm">Favorite Item</div>
              <div className="text-orange-400 font-medium flex items-center space-x-2">
                <span>☕</span>
                <span>{customer.favorite}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => callCustomer(customer.phone, customer.name)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone size={16} />
                <span>Call</span>
              </button>
              <button
                onClick={() => emailCustomer(customer.email, customer.name)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Mail size={16} />
                <span>Email</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;
