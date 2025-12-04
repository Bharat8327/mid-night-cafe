import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Calendar } from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  const getData = () => {
    switch (selectedPeriod) {
      case '7':
        return {
          dailyRevenue: [
            { day: 'Mon', revenue: 245 },
            { day: 'Tue', revenue: 312 },
            { day: 'Wed', revenue: 189 },
            { day: 'Thu', revenue: 278 },
            { day: 'Fri', revenue: 356 },
            { day: 'Sat', revenue: 423 },
            { day: 'Sun', revenue: 298 },
          ],
          orderTrends: [
            { time: '9AM', orders: 5 },
            { time: '10AM', orders: 12 },
            { time: '11AM', orders: 18 },
            { time: '12PM', orders: 25 },
            { time: '1PM', orders: 22 },
            { time: '2PM', orders: 15 },
            { time: '3PM', orders: 8 },
            { time: '4PM', orders: 6 },
          ],
        };
      case '15':
        return {
          dailyRevenue: [
            { day: 'W1', revenue: 1580 },
            { day: 'W2', revenue: 2100 },
            { day: 'W3', revenue: 1890 },
          ],
          orderTrends: [
            { time: 'W1', orders: 85 },
            { time: 'W2', orders: 120 },
            { time: 'W3', orders: 95 },
          ],
        };
      case '30':
        return {
          dailyRevenue: [
            { day: 'W1', revenue: 2200 },
            { day: 'W2', revenue: 2800 },
            { day: 'W3', revenue: 2400 },
            { day: 'W4', revenue: 3100 },
          ],
          orderTrends: [
            { time: 'W1', orders: 150 },
            { time: 'W2', orders: 180 },
            { time: 'W3', orders: 160 },
            { time: 'W4', orders: 200 },
          ],
        };
      default:
        return {
          dailyRevenue: [],
          orderTrends: [],
        };
    }
  };

  const { dailyRevenue, orderTrends } = getData();

  const popularItems = [
    { name: 'Latte', orders: 45, color: '#f97316' },
    { name: 'Cappuccino', orders: 38, color: '#3b82f6' },
    { name: 'Espresso', orders: 32, color: '#10b981' },
    { name: 'Americano', orders: 28, color: '#8b5cf6' },
    { name: 'Croissant', orders: 22, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: "Today's Revenue",
      value: '$342.50',
      change: '+12.5%',
      color: 'text-green-400',
      bgColor: 'bg-green-900 border-green-700',
    },
    {
      title: 'Orders Today',
      value: '28',
      change: '+8.2%',
      color: 'text-blue-400',
      bgColor: 'bg-blue-900 border-blue-700',
    },
    {
      title: 'Average Order',
      value: '$12.23',
      change: '+4.1%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-900 border-purple-700',
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8',
      change: '+0.3%',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900 border-yellow-700',
    },
  ];

  const periodOptions = [
    { value: '7', label: '7 Days' },
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
  ];

  return (
    <div className="space-y-6 bg-[#020817] px-2 sm:px-4 py-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-slate-400">
            Track your cafe's performance and insights
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700 w-full md:w-auto mt-2 md:mt-0">
          <Calendar size={16} className="text-slate-400 ml-2" />
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedPeriod === option.value
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-3 sm:p-4 md:p-6 rounded-xl border ${stat.bgColor} hover:scale-105 transition-transform duration-200`}
          >
            <div className="text-slate-400 text-xs sm:text-sm mb-2">
              {stat.title}
            </div>
            <div className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1">
              {stat.value}
            </div>
            <div
              className={`text-xs sm:text-sm ${stat.color} flex items-center`}
            >
              <span className="mr-1">↗</span>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-3 sm:p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Revenue Trends ({selectedPeriod} days)
          </h3>
          <div className="w-full h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-3 sm:p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Order Trends ({selectedPeriod} days)
          </h3>
          <div className="w-full h-[220px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-3 sm:p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">⭐</span>
            Popular Items
          </h3>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
              <div className="w-full h-[180px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularItems}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="orders"
                    >
                      {popularItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4 space-y-2 sm:space-y-3">
              {popularItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-slate-300 font-medium text-xs sm:text-base">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-white font-bold text-xs sm:text-base">
                    {item.orders}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-3 sm:p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
          <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Performance Metrics
          </h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg hover:bg-slate-600 transition-colors">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-slate-300 font-medium text-xs sm:text-base">
                  Order Completion Rate
                </span>
                <span className="text-green-400 font-bold text-base sm:text-lg">
                  94.2%
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full shadow-lg"
                  style={{ width: '94.2%' }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg hover:bg-slate-600 transition-colors">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-slate-300 font-medium text-xs sm:text-base">
                  Average Prep Time
                </span>
                <span className="text-blue-400 font-bold text-base sm:text-lg">
                  8.5 min
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full shadow-lg"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg hover:bg-slate-600 transition-colors">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-slate-300 font-medium text-xs sm:text-base">
                  Customer Return Rate
                </span>
                <span className="text-purple-400 font-bold text-base sm:text-lg">
                  78.3%
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full shadow-lg"
                  style={{ width: '78.3%' }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-900 to-red-900 p-3 sm:p-4 rounded-lg border border-orange-700">
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <span className="text-orange-300 font-medium text-xs sm:text-base">
                  Peak Hours
                </span>
                <span className="text-orange-400 font-bold text-base sm:text-lg">
                  11AM - 1PM
                </span>
              </div>
              <div className="text-orange-400 text-xs sm:text-sm">
                Highest order volume period
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
