import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Mail,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Lock,
  User,
  Scale
} from 'lucide-react';
import { apiFetch } from '../utils/api';

// ═══ COMPONENTS ═══════════════════════════════════════════════════════════

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center">
        <Icon className="text-gold-mid" size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-amber-600'}`}>
        <TrendingUp size={12} className={trend === 'down' ? 'rotate-90' : ''} />
        {change}
      </div>
    </div>
    <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-1">{title}</div>
    <div className="font-serif text-3xl text-dark">{value}</div>
  </div>
);

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [adminUser, setAdminUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify(loginData)
      });
      setIsLoggedIn(true);
      setAdminUser(data.user);
      fetchDashboardData();
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await apiFetch('/admin/overview');
      setDashboardData(data);
      const appts = await apiFetch('/admin/appointments');
      setAppointments(appts);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const stats = dashboardData ? [
    { title: 'Appointments', value: dashboardData.appointments.total, change: `${dashboardData.appointments.pending} pending`, icon: Calendar, trend: 'up' },
    { title: 'Enquiries', value: dashboardData.contacts.total, change: `${dashboardData.contacts.unread} unread`, icon: MessageSquare, trend: 'up' },
    { title: 'Active Cases', value: dashboardData.total_cases, change: 'In progress', icon: Activity, trend: 'up' },
    { title: 'Response Rate', value: '98%', change: 'Target reached', icon: ShieldCheck, trend: 'up' },
  ] : [];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldCheck className="text-gold" size={40} />
            </div>
            <h1 className="font-serif text-3xl text-dark mb-2">Internal Access</h1>
            <p className="text-sm text-dark/50">R. Kasaija & Partners Management Console</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(42,29,16,0.1)] border border-gold/10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gold-mid px-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-mid/40" size={18} />
                  <input 
                    type="text"
                    required
                    className="w-full pl-12 pr-5 py-4 bg-cream/30 border border-gold/20 rounded-xl focus:border-gold-mid focus:bg-white outline-none transition-all text-sm"
                    placeholder="Enter username"
                    value={loginData.username}
                    onChange={e => setLoginData({...loginData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gold-mid px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-mid/40" size={18} />
                  <input 
                    type="password"
                    required
                    className="w-full pl-12 pr-5 py-4 bg-cream/30 border border-gold/20 rounded-xl focus:border-gold-mid focus:bg-white outline-none transition-all text-sm"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dark text-gold py-5 rounded-xl font-medium shadow-lg hover:shadow-dark/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>

          <p className="text-center mt-12 text-[11px] text-dark/30 tracking-wide">
            &copy; {new Date().getFullYear()} R. KASAIJA & PARTNERS ADVOCATES.<br />
            AUTHORIZED PERSONNEL ONLY.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-dark text-cream flex flex-col fixed h-full z-30">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
              <Scale size={24} className="text-dark" />
            </div>
            <div>
              <div className="text-[13px] font-bold tracking-tight">RK&P Console</div>
              <div className="text-[10px] text-gold/60 font-mono uppercase tracking-tighter">Admin Suite v2.0</div>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'appointments', icon: Calendar, label: 'Appointments' },
            { id: 'enquiries', icon: MessageSquare, label: 'Enquiries' },
            { id: 'clients', icon: Users, label: 'Clients' },
            { id: 'activity', icon: Activity, label: 'System Logs' },
            { id: 'settings', icon: Settings, label: 'Preferences' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-gold text-dark font-semibold' 
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[14px]">{item.label}</span>
              {item.id === 'appointments' && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="text-[14px]">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-[280px] min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gold/10 px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30" size={18} />
            <input 
              type="text"
              placeholder="Search appointments, clients, or logs..."
              className="w-full pl-12 pr-5 py-3 bg-cream/50 rounded-xl outline-none focus:bg-cream transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center text-dark/60 hover:text-dark transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-[1px] bg-gold/20" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-bold text-dark">Robert Kasaija</div>
                <div className="text-[10px] text-gold-mid font-mono uppercase">Managing Partner</div>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold-mid border-2 border-white shadow-sm flex items-center justify-center text-white font-serif italic text-lg">
                R
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10 flex-grow">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-mid mb-2">§ Dashboard</div>
              <h2 className="font-serif text-4xl text-dark tracking-tight">System Overview</h2>
            </div>
            <div className="text-sm text-dark/40 font-medium">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Appointments */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gold/10 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gold/5 flex justify-between items-center">
                <h3 className="font-serif text-xl">Recent Appointments</h3>
                <button className="text-xs font-semibold text-gold-mid hover:text-dark uppercase tracking-wider">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cream/50 text-[10px] font-mono uppercase tracking-widest text-gold-mid">
                      <th className="px-8 py-4 text-left">Client</th>
                      <th className="px-8 py-4 text-left">Practice Area</th>
                      <th className="px-8 py-4 text-left">Date</th>
                      <th className="px-8 py-4 text-left">Status</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {appointments.map((row, i) => (
                      <tr key={i} className="hover:bg-cream/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="font-medium text-dark">{row.client_name}</div>
                          <div className="text-[11px] opacity-40">{row.client_email}</div>
                        </td>
                        <td className="px-8 py-5 text-[13px] text-dark/70">{row.practice_area}</td>
                        <td className="px-8 py-5 text-[13px] text-dark/70">
                          {row.preferred_date ? new Date(row.preferred_date).toLocaleDateString() : 'N/A'} {row.preferred_time}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            row.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            row.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {row.status === 'confirmed' && <CheckCircle2 size={10} />}
                            {row.status === 'pending' && <Clock size={10} />}
                            {row.status === 'cancelled' && <XCircle size={10} />}
                            {row.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-dark/30 hover:text-dark transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-dark/30 italic">No appointments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notifications / Activity Feed */}
            <div className="bg-white rounded-3xl border border-gold/10 shadow-sm flex flex-col">
              <div className="p-8 border-b border-gold/5 flex justify-between items-center">
                <h3 className="font-serif text-xl">System Activity</h3>
                <Activity size={18} className="text-gold-mid" />
              </div>
              <div className="p-8 space-y-8 overflow-y-auto max-h-[500px]">
                {dashboardData?.activity.map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== dashboardData.activity.length - 1 && <div className="absolute left-[11px] top-8 bottom-[-32px] w-[1px] bg-gold/10" />}
                    <div className={`w-6 h-6 rounded-full bg-cream border border-gold/10 flex items-center justify-center shrink-0 z-10 text-gold-mid`}>
                      <Activity size={12} />
                    </div>
                    <div>
                      <div className="text-[13px] leading-relaxed">
                        <span className="font-bold text-dark">{item.admin_user || 'System'}</span> {item.action} <span className="font-medium text-gold-mid italic">{item.details}</span>
                      </div>
                      <div className="text-[11px] text-dark/30 mt-1 font-medium uppercase tracking-tight">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {(!dashboardData || dashboardData.activity.length === 0) && (
                   <div className="text-center text-dark/30 py-10 italic text-sm">No activity logs yet.</div>
                )}
              </div>
              <button className="mt-auto p-6 border-t border-gold/5 text-[10px] font-mono uppercase tracking-widest text-center text-gold-mid hover:text-dark transition-colors">
                Full Audit Trail
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
