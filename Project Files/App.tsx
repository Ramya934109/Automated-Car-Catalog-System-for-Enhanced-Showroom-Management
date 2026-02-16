
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Car, Booking, DashboardStats } from './types';
// Fix: Import missing data constants from constants.tsx using aliases to match component usage and fix "Cannot find name" errors
import { MOCK_CARS, MOCK_BOOKINGS, SALES_DATA as salesData, INVENTORY_DATA as inventoryData } from './constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Architecture from './components/Architecture';
import ProjectDetails from './components/ProjectDetails';
import { getCarRecommendation } from './services/geminiService';

interface User {
  name: string;
  email: string;
  role: UserRole;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'catalog' | 'bookings' | 'architecture' | 'ai'>('overview');
  const [cars] = useState<Car[]>(MOCK_CARS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [aiChat, setAiChat] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat]);

  const stats: DashboardStats = {
    totalSales: 42,
    pendingApprovals: bookings.filter(b => b.status === 'Pending').length,
    inventoryCount: cars.length,
    activeTestDrives: 12
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated Login
    setCurrentUser({
      name: email.split('@')[0].toUpperCase() || 'Demo User',
      email: email || 'demo@servicenow.com',
      role: UserRole.ADMIN // Defaulting to Admin for full demo access
    });
    setIsAuthenticated(true);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated Sign Up
    setCurrentUser({
      name: name,
      email: email,
      role: selectedRole
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthMode('login');
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsAiLoading(true);

    const recommendation = await getCarRecommendation(userMsg);
    setAiChat(prev => [...prev, { role: 'ai', content: recommendation }]);
    setIsAiLoading(false);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        <div className="max-w-md w-full mx-4 z-10">
          <div className="text-center mb-8">
            <div className="inline-flex bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
              <i className="fas fa-car-side text-3xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-white">ShowroomOS</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">AI-Driven Management System</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
            <div className="flex mb-8 bg-black/20 p-1 rounded-xl">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">System Role</label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {Object.values(UserRole).map(r => <option key={r} value={r} className="text-slate-900">{r}</option>)}
                  </select>
                </div>
              )}
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] mt-4"
              >
                {authMode === 'login' ? 'Sign In to Portal' : 'Create System Account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-500 text-xs">
                Powered by <strong>ServiceNow Vancouver</strong> Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-car-side text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ShowroomOS</h1>
              <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">ServiceNow Integrated</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <i className="fas fa-user text-slate-500"></i>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 p-2.5 rounded-xl transition-all border border-slate-700"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <nav className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: 'fa-info-circle' },
            { id: 'dashboard', label: 'Analytics', icon: 'fa-chart-pie' },
            { id: 'catalog', label: 'Catalog', icon: 'fa-list' },
            { id: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
            { id: 'architecture', label: 'Architecture', icon: 'fa-network-wired' },
            { id: 'ai', label: 'AI Advisor', icon: 'fa-robot' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all text-sm font-medium ${
                activeTab === tab.id 
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && <ProjectDetails />}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Sales" value={stats.totalSales} icon="fa-hand-holding-usd" color="bg-indigo-500" />
              <StatCard label="Pending Approvals" value={stats.pendingApprovals} icon="fa-hourglass-half" color="bg-amber-500" />
              <StatCard label="Live Inventory" value={stats.inventoryCount} icon="fa-warehouse" color="bg-emerald-500" />
              <StatCard label="Active SLAs" value={stats.activeTestDrives} icon="fa-clock" color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-800">Monthly Sales Revenue</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-800">Fuel Mix Breakdown</h3>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="ml-4 space-y-2">
                    {inventoryData.map(item => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                        <span className="text-xs font-medium text-slate-600">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                <div className="h-48 relative overflow-hidden">
                  <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {car.fuelType}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{car.model}</h3>
                    <span className="text-indigo-600 font-bold">${car.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{car.variant}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
                      car.stockStatus === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                      car.stockStatus === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {car.stockStatus}
                    </span>
                    <button className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      View Service Record <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">Test Drive Bookings (Live Queue)</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                  <i className="fas fa-robot text-[8px]"></i> Auto-Routed
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Model</th>
                    <th className="p-4">Assigned To</th>
                    <th className="p-4">SLA Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{booking.customerName}</td>
                      <td className="p-4 text-slate-600">{booking.carModel}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                            {booking.assignedTo?.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs text-slate-600">{booking.assignedTo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          booking.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                          booking.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {booking.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          booking.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                          booking.status === 'Pending' ? 'bg-indigo-100 text-indigo-700' : 
                          booking.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {booking.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'Approved')}
                                className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                onClick={() => updateBookingStatus(booking.id, 'Rejected')}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                          <button className="p-1.5 hover:bg-slate-100 text-slate-400 rounded">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && <Architecture />}

        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto flex flex-col h-[600px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 bg-indigo-600 text-white flex items-center gap-3">
              <i className="fas fa-robot text-xl"></i>
              <div>
                <h3 className="font-bold leading-tight">AI Sales Advisor</h3>
                <p className="text-[10px] uppercase opacity-75">ServiceNow Predictive Engine</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {aiChat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-8">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-2xl">
                    <i className="fas fa-comment-dots"></i>
                  </div>
                  <p className="text-sm">Hi! I'm your AI car consultant. Ask me about our performance EVs or family-friendly SUVs.</p>
                </div>
              )}
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAiSearch} className="p-4 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Recommend an EV for daily commuting..."
                className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                type="submit"
                disabled={isAiLoading || !aiInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Persistent Footer Call-to-Action */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700 uppercase">Project Status:</span> Live on Production (Vancouver Build)
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">
              <i className="fas fa-file-code"></i> Export ServiceNow XML
            </button>
            <button className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors">
              <i className="fas fa-play"></i> Trigger Java Sync Job
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`${color} p-3 rounded-lg text-white`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</p>
      <h4 className="text-xl font-bold text-slate-800">{value}</h4>
    </div>
  </div>
);

export default App;
