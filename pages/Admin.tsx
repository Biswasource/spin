import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, PhoneCall, LogOut, ArrowRight, TrendingUp, Calendar, Clock, User, Edit2, X, LayoutDashboard, Briefcase, FileText, ClipboardList, UserCog } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query, doc, updateDoc, getDoc } from 'firebase/firestore';
import AdminJobs from '../components/AdminJobs';
import AdminApplications from '../components/AdminApplications';
import AdminEmployees from '../components/AdminEmployees';
import AdminTasks from '../components/AdminTasks';

interface Booking {
  id: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  selectedDate: string;
  selectedTime: string;
  createdAt: string;
}

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applications' | 'employees' | 'tasks'>('dashboard');

  // Dashboard Data
  const [visits, setVisits] = useState(1312);
  const [calls, setCalls] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const statsRef = doc(db, 'stats', 'visits');
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          setVisits(docSnap.data().count);
        } else {
          setVisits(1312);
        }
      } catch (e) {
        console.error("Failed to fetch visits", e);
      }
    };

    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedBookings: Booking[] = [];
        querySnapshot.forEach((document) => {
          const data = document.data();
          fetchedBookings.push({
            id: document.id,
            name: data.name || '',
            email: data.email || '',
            company: data.company || '',
            notes: data.notes || '',
            selectedDate: data.selectedDate || '',
            selectedTime: data.selectedTime || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
          });
        });
        setBookings(fetchedBookings);
        setCalls(fetchedBookings.length);
      } catch (e) {
        console.error("Failed to fetch bookings from Firebase", e);
      }
    };

    if (isLoggedIn) {
      fetchVisits();
      fetchBookings();
    }
  }, [isLoggedIn]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingBooking) return;
    setEditingBooking({
      ...editingBooking,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = async () => {
    if (!editingBooking) return;
    try {
      const bookingRef = doc(db, "bookings", editingBooking.id);
      await updateDoc(bookingRef, {
        name: editingBooking.name,
        email: editingBooking.email,
        company: editingBooking.company,
        notes: editingBooking.notes,
        selectedDate: editingBooking.selectedDate,
        selectedTime: editingBooking.selectedTime,
      });
      setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
      setEditingBooking(null);
    } catch (e) {
      console.error("Error updating booking", e);
      alert("Failed to update booking.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Saloni@1706') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center px-6 pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 md:p-14 rounded-3xl shadow-sm w-full max-w-md border border-charcoal/10"
        >
          <div className="mb-10 text-center">
            <span className="text-lime-500 font-semibold tracking-widest uppercase text-xs mb-2 block">Restricted Access</span>
            <h1 className="font-serif-display text-4xl text-charcoal">Admin Panel</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-beige-100/50 border border-charcoal/10 rounded-xl px-4 py-3 outline-none focus:border-lime-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="mt-4 bg-charcoal text-white rounded-full py-4 px-8 font-medium tracking-wide hover:bg-black transition-colors flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar */}
        <div className="lg:w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-charcoal/10">
            <h2 className="font-serif-display text-2xl text-charcoal mb-6 px-4">Admin</h2>

            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige-50 hover:text-charcoal'}`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'jobs' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige-50 hover:text-charcoal'}`}
              >
                <Briefcase size={18} />
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'applications' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige-50 hover:text-charcoal'}`}
              >
                <FileText size={18} />
                Applications
              </button>

              <div className="mt-4 pt-4 border-t border-charcoal/10">
                <p className="px-4 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Team</p>
              </div>

              <button
                onClick={() => setActiveTab('employees')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'employees' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige-50 hover:text-charcoal'}`}
              >
                <UserCog size={18} />
                Employees
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'tasks' ? 'bg-charcoal text-white' : 'text-gray-500 hover:bg-beige-50 hover:text-charcoal'}`}
              >
                <ClipboardList size={18} />
                Tasks
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-charcoal/10 px-4">
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem('adminLoggedIn');
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-charcoal transition-colors font-medium text-sm"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10">
                <h1 className="font-serif-display text-4xl text-charcoal mb-2">Dashboard</h1>
                <p className="text-gray-500">Welcome back, Biswajit.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Website Visits Card */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-charcoal/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-charcoal/5 pointer-events-none">
                    <Users size={100} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
                        <TrendingUp size={20} />
                      </div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Total Website Visits</h3>
                    </div>
                    <p className="font-serif-display text-6xl text-charcoal mb-4">{visits.toLocaleString()}</p>
                    <p className="text-lime-600 font-medium text-xs flex items-center gap-1">
                      +12% <span className="text-gray-400 font-normal">from last month</span>
                    </p>
                  </div>
                </div>

                {/* Booked Calls Card */}
                <div className="bg-charcoal p-8 rounded-3xl shadow-lg relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                    <PhoneCall size={100} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lime-400">
                        <PhoneCall size={20} />
                      </div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-300">Total Booked Calls</h3>
                    </div>
                    <p className="font-serif-display text-6xl text-white mb-4">{calls}</p>
                    <p className="text-lime-400 font-medium text-xs flex items-center gap-1">
                      +3 <span className="text-gray-400 font-normal">this week</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Data Details Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-charcoal/10 overflow-hidden">
                <div className="p-8 border-b border-charcoal/10">
                  <h2 className="font-serif-display text-3xl text-charcoal">Recent Bookings</h2>
                </div>

                {bookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-beige-50">
                          <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Client Info</th>
                          <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Company</th>
                          <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Meeting Time</th>
                          <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Notes</th>
                          <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, idx) => (
                          <tr key={booking.id || idx} className="hover:bg-beige-50/50 transition-colors border-b border-charcoal/5 last:border-0">
                            <td className="py-5 px-8">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center font-bold text-lg">
                                  {booking.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-charcoal">{booking.name}</p>
                                  <p className="text-sm text-gray-500">{booking.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-8">
                              <p className="text-charcoal">{booking.company || '-'}</p>
                            </td>
                            <td className="py-5 px-8">
                              <p className="font-medium text-charcoal flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400" />
                                {new Date(booking.selectedDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <Clock size={14} className="text-gray-400" />
                                {booking.selectedTime}
                              </p>
                            </td>
                            <td className="py-5 px-8 max-w-xs">
                              <p className="text-sm text-gray-600 truncate" title={booking.notes}>{booking.notes || '-'}</p>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <button
                                onClick={() => setEditingBooking(booking)}
                                className="p-2 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors inline-flex"
                                title="Edit Booking"
                              >
                                <Edit2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center flex flex-col items-center">
                    <User size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-charcoal mb-2">No calls booked yet</h3>
                    <p className="text-gray-500">When someone books a call, their details will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10">
                <h1 className="font-serif-display text-4xl text-charcoal mb-2">Job Management</h1>
                <p className="text-gray-500">Create, edit, and manage career positions.</p>
              </div>
              <AdminJobs />
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10">
                <h1 className="font-serif-display text-4xl text-charcoal mb-2">Applicant Management</h1>
                <p className="text-gray-500">Review all submitted job applications and resumes.</p>
              </div>
              <AdminApplications />
            </motion.div>
          )}

          {activeTab === 'employees' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AdminEmployees />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <AdminTasks />
            </motion.div>
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 md:p-12 w-full max-w-2xl relative shadow-2xl"
              >
                <button
                  onClick={() => setEditingBooking(null)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-charcoal transition-colors bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
                <h2 className="font-serif-display text-3xl text-charcoal mb-6">Edit Booking</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                    <input type="text" name="name" value={editingBooking.name} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input type="email" name="email" value={editingBooking.email} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Company</label>
                    <input type="text" name="company" value={editingBooking.company} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Date (ISO)</label>
                    <input type="text" name="selectedDate" value={editingBooking.selectedDate} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Time</label>
                    <input type="text" name="selectedTime" value={editingBooking.selectedTime} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Notes</label>
                    <textarea name="notes" value={editingBooking.notes} onChange={handleEditChange} className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50 resize-none" rows={3}></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setEditingBooking(null)} className="px-6 py-3 rounded-full border border-charcoal/10 hover:bg-beige-100 font-medium">Cancel</button>
                  <button onClick={saveEdit} className="px-6 py-3 rounded-full bg-charcoal text-white hover:bg-black font-medium transition-colors">Save Changes</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Admin;
