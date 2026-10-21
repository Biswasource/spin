import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut, CheckCircle2, Clock, Circle, AlertCircle, ClipboardList,
  Calendar, Loader2, ArrowRight, KeyRound, Mail, Shield,
  FileDown, ChevronRight, User, RefreshCw, ExternalLink
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, query, where, updateDoc, doc } from 'firebase/firestore';
import { generateTaskPDF } from '../lib/taskPdf';

// ── Types ─────────────────────────────────────────────────────────────────────
interface EmployeeData {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}
interface Task {
  id: string; title: string; description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt?: string;
}

// ── Static config ─────────────────────────────────────────────────────────────
const STATUS = {
  'todo': { label: 'To Do', Icon: Circle, bg: 'bg-gray-100', text: 'text-gray-600', hex: '#6b7280' },
  'in-progress': { label: 'In Progress', Icon: Clock, bg: 'bg-blue-50', text: 'text-blue-600', hex: '#2563eb' },
  'done': { label: 'Done', Icon: CheckCircle2, bg: 'bg-lime-50', text: 'text-lime-600', hex: '#16a34a' },
} as const;

const PRIORITY = {
  'low': { label: 'Low', dot: 'bg-green-400', badge: 'bg-green-100 text-green-700', bar: 'bg-green-400', hex: '#22c55e', pct: 33 },
  'medium': { label: 'Medium', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', hex: '#f59e0b', pct: 66 },
  'high': { label: 'High', dot: 'bg-red-400', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500', hex: '#ef4444', pct: 100 },
} as const;

// ── Main Component ────────────────────────────────────────────────────────────
const EmployeePortal: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'login' | 'dashboard'>(() =>
    sessionStorage.getItem('empLoggedIn') ? 'dashboard' : 'login'
  );
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [employee, setEmployee] = useState<EmployeeData | null>(() => {
    const s = sessionStorage.getItem('empData');
    return s ? JSON.parse(s) : null;
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (step === 'dashboard' && employee) {
      fetchTasks(employee.id);
      refreshEmployeeProfile(employee.id);
    }
  }, [step, employee?.id]);

  const refreshEmployeeProfile = async (empId: string) => {
    try {
      const snap = await getDoc(doc(db, 'employees', empId));
      if (snap.exists()) {
        const d = snap.data();
        if (d.photoUrl !== employee?.photoUrl || d.name !== employee?.name || d.role !== employee?.role) {
          const updated: EmployeeData = {
            id: snap.id,
            name: d.name || employee?.name || '',
            email: d.email || employee?.email || '',
            role: d.role || employee?.role || '',
            photoUrl: d.photoUrl || '',
          };
          setEmployee(updated);
          sessionStorage.setItem('empData', JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.error('Error refreshing profile:', e);
    }
  };

  const fetchTasks = async (empId: string) => {
    setTasksLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'tasks'), where('assignedTo', '==', empId)));
      const fetched: Task[] = snap.docs.map(d => ({
        id: d.id,
        title: d.data().title || '',
        description: d.data().description || '',
        status: d.data().status || 'todo',
        priority: d.data().priority || 'medium',
        dueDate: d.data().dueDate || '',
        createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? (d.data().createdAt || ''),
      }));
      fetched.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.localeCompare(a.createdAt);
      });
      setTasks(fetched);
    } catch (e) { console.error('Error fetching tasks:', e); }
    setTasksLoading(false);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error('Failed to update task status:', e);
      alert('Could not update status. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const cleanEmail = emailInput.trim();
    const cleanPassword = passwordInput.trim();

    try {
      // 1. Try lowercase match
      let snap = await getDocs(query(collection(db, 'employees'), where('email', '==', cleanEmail.toLowerCase())));
      // 2. Try exact match if empty
      if (snap.empty) {
        snap = await getDocs(query(collection(db, 'employees'), where('email', '==', cleanEmail)));
      }
      // 3. Fallback scan in case of casing differences in existing database
      if (snap.empty) {
        const allSnap = await getDocs(collection(db, 'employees'));
        const matched = allSnap.docs.find(d => (d.data().email || '').trim().toLowerCase() === cleanEmail.toLowerCase());
        if (matched) {
          snap = { empty: false, docs: [matched] } as any;
        }
      }

      if (snap.empty) {
        setLoginError('No employee account found with this email. Please verify with your admin.');
        setLoginLoading(false);
        return;
      }

      const empDoc = snap.docs[0];
      const data = empDoc.data();
      if ((data.password || '').trim() !== cleanPassword) {
        setLoginError('Incorrect password. Please verify or ask your admin to reset it.');
        setLoginLoading(false);
        return;
      }

      const empData: EmployeeData = {
        id: empDoc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        photoUrl: data.photoUrl || '',
      };
      setEmployee(empData);
      sessionStorage.setItem('empLoggedIn', 'true');
      sessionStorage.setItem('empData', JSON.stringify(empData));
      setStep('dashboard');
    } catch {
      setLoginError('Login failed. Please check your network and try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('empLoggedIn');
    sessionStorage.removeItem('empData');
    setEmployee(null); setTasks([]); setEmailInput(''); setPasswordInput('');
    setStep('login');
  };

  const handleDownloadPDF = (task: Task) => {
    setPdfLoading(true);
    setTimeout(() => {
      try {
        const pdf = generateTaskPDF({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          assignedName: employee?.name || '',
          assignedEmail: employee?.email || '',
          assignedRole: employee?.role || '',
        });
        const safeTitle = task.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
        pdf.save(`SpinTech_Task_${safeTitle}.pdf`);
      } catch (err) {
        console.error(err);
        alert('PDF export failed.');
      }
      setPdfLoading(false);
    }, 50);
  };

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  const isOverdue = (t: Task) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-charcoal/10 p-10 md:p-14">
            <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Shield size={30} className="text-lime-400" />
            </div>
            <div className="text-center mb-10">
              <span className="text-lime-500 font-semibold tracking-widest uppercase text-xs mb-2 block">Employee Access</span>
              <h1 className="font-serif-display text-4xl text-charcoal">Portal Login</h1>
              <p className="text-gray-400 text-sm mt-3">Sign in with credentials provided by your admin</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} required
                    className="w-full pl-11 pr-4 py-3.5 border border-charcoal/10 rounded-2xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required
                    className="w-full pl-11 pr-4 py-3.5 border border-charcoal/10 rounded-2xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors"
                    placeholder="••••••••••••" />
                </div>
              </div>

              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
                    <AlertCircle size={15} className="shrink-0" />{loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              <button type="submit" disabled={loginLoading}
                className="w-full mt-2 bg-charcoal text-white rounded-2xl py-4 font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 group disabled:opacity-60">
                {loginLoading
                  ? <Loader2 size={18} className="animate-spin" />
                  : <><span>Sign In</span><ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Contact your admin if you don't have access credentials.</p>
        </motion.div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-beige-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-6">
          <div className="flex items-center gap-5">
            {employee?.photoUrl ? (
              <img
                src={employee.photoUrl}
                alt={employee.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-3xl object-cover border-2 border-lime-400 shadow-md shrink-0 bg-white"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-charcoal text-lime-400 flex items-center justify-center font-serif-display text-2xl md:text-3xl font-bold shadow-md shrink-0">
                {employee?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="text-lime-600 font-semibold tracking-widest uppercase text-xs mb-1.5 block">Employee Portal</span>
              <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-charcoal leading-tight">
                Welcome, {employee?.name} 👋
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm flex items-center gap-2 flex-wrap">
                <User size={13} />
                {employee?.email}
                <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                <span className="bg-lime-100 text-lime-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{employee?.role}</span>
              </p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-charcoal/10 bg-white text-gray-500 hover:text-charcoal hover:border-charcoal/30 transition-colors font-medium text-sm shadow-sm">
            <LogOut size={15} />Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Tasks', value: stats.total, bg: 'bg-charcoal', text: 'text-white', sub: 'text-white/50' },
            { label: 'To Do', value: stats.todo, bg: 'bg-white', text: 'text-charcoal', sub: 'text-gray-400' },
            { label: 'In Progress', value: stats.inProgress, bg: 'bg-blue-50', text: 'text-blue-700', sub: 'text-blue-400' },
            { label: 'Completed', value: stats.done, bg: 'bg-lime-50', text: 'text-lime-700', sub: 'text-lime-400' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }}
              className={`${s.bg} rounded-3xl p-6 border border-charcoal/10 shadow-sm`}>
              <p className={`font-serif-display text-5xl ${s.text} mb-1`}>{s.value}</p>
              <p className={`text-xs font-semibold uppercase tracking-widest ${s.sub} mt-1`}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tasks Panel */}
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-charcoal/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-charcoal rounded-xl flex items-center justify-center shrink-0">
                <ClipboardList size={17} className="text-lime-400" />
              </div>
              <div>
                <h2 className="font-serif-display text-2xl text-charcoal leading-none">My Tasks</h2>
                <p className="text-gray-400 text-xs mt-0.5">{tasks.length} total assigned</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => employee && fetchTasks(employee.id)}
                title="Refresh Tasks"
                disabled={tasksLoading}
                className="p-2 border border-charcoal/10 rounded-2xl bg-beige-50 hover:bg-beige-100 text-charcoal transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={tasksLoading ? 'animate-spin' : ''} />
              </button>
              <div className="flex gap-1 bg-beige-50 border border-charcoal/10 rounded-2xl p-1">
                {(['all', 'todo', 'in-progress', 'done'] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterStatus === s ? 'bg-charcoal text-white shadow-sm' : 'text-gray-500 hover:text-charcoal'
                      }`}>
                    {s === 'all' ? 'All' : STATUS[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Task rows */}
          {tasksLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-24 text-center">
              <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                {filterStatus === 'all' ? 'No tasks assigned yet' : `No "${STATUS[filterStatus as Task['status']]?.label}" tasks`}
              </h3>
              <p className="text-gray-400 text-sm">Your admin will assign tasks soon.</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal/5">
              {filteredTasks.map((task, idx) => {
                const S = STATUS[task.status];
                const P = PRIORITY[task.priority];
                const overdue = isOverdue(task);
                return (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-4 px-8 py-5 hover:bg-beige-50/60 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/employee/task/${task.id}`)}
                  >
                    {/* Status icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${S.bg}`}>
                      <S.Icon size={15} className={S.text} />
                    </div>

                    {/* Title + desc */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-charcoal truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-400 truncate mt-0.5">{task.description}</p>
                      )}
                    </div>

                    {/* Due date */}
                    {task.dueDate && (
                      <span className={`hidden sm:flex items-center gap-1 text-xs font-medium shrink-0 ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                        <Calendar size={11} />
                        {overdue && 'Overdue · '}
                        {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    )}

                    {/* Priority */}
                    <span className={`hidden md:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${P.badge}`}>
                      {P.label}
                    </span>

                    {/* Status badge */}
                    <span className={`hidden lg:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${S.bg} ${S.text}`}>
                      {S.label}
                    </span>

                    {/* Direct PDF Download */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPDF(task);
                      }}
                      title="Download PDF Specification"
                      className="p-2 text-gray-400 hover:text-charcoal hover:bg-beige-100 rounded-xl transition-colors shrink-0"
                    >
                      <FileDown size={16} />
                    </button>

                    <ChevronRight size={16} className="text-gray-300 group-hover:text-lime-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;
