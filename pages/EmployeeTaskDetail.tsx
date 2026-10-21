import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileDown, Calendar, Clock, CheckCircle2, Circle,
  AlertCircle, User, Loader2, ShieldCheck, Tag, BarChart3,
  ExternalLink, Check
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { generateTaskPDF, TaskPDFData } from '../lib/taskPdf';

interface EmployeeSession {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  assignedName?: string;
  createdAt?: string;
}

const STATUS_CONFIG = {
  'todo': { label: 'To Do', icon: Circle, bg: 'bg-gray-100 text-gray-700', activeRing: 'ring-gray-300' },
  'in-progress': { label: 'In Progress', icon: Clock, bg: 'bg-blue-50 text-blue-700', activeRing: 'ring-blue-300' },
  'done': { label: 'Completed', icon: CheckCircle2, bg: 'bg-lime-50 text-lime-800', activeRing: 'ring-lime-300' },
} as const;

const PRIORITY_CONFIG = {
  'low': { label: 'Low Priority', badge: 'bg-green-100 text-green-800', dot: 'bg-green-500', bar: 'bg-green-500', pct: '33%' },
  'medium': { label: 'Medium Priority', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', bar: 'bg-amber-500', pct: '66%' },
  'high': { label: 'High Priority', badge: 'bg-red-100 text-red-800', dot: 'bg-red-500', bar: 'bg-red-500', pct: '100%' },
} as const;

const EmployeeTaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<EmployeeSession | null>(null);
  const [task, setTask] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  useEffect(() => {
    // Check if employee is logged in
    const isLogged = sessionStorage.getItem('empLoggedIn');
    const storedEmp = sessionStorage.getItem('empData');
    if (!isLogged || !storedEmp) {
      navigate('/employee');
      return;
    }
    try {
      setEmployee(JSON.parse(storedEmp));
    } catch {
      navigate('/employee');
      return;
    }

    if (id) {
      fetchTask(id);
    }
  }, [id, navigate]);

  const fetchTask = async (taskId: string) => {
    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const snap = await getDoc(taskRef);
      if (snap.exists()) {
        const d = snap.data();
        setTask({
          id: snap.id,
          title: d.title || 'Untitled Task',
          description: d.description || '',
          status: d.status || 'todo',
          priority: d.priority || 'medium',
          dueDate: d.dueDate || '',
          assignedTo: d.assignedTo || '',
          assignedName: d.assignedName || '',
          createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? (d.createdAt || ''),
        });
      } else {
        setTask(null);
      }
    } catch (e) {
      console.error('Error fetching task details:', e);
      setTask(null);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: TaskData['status']) => {
    if (!task || task.status === newStatus || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, 'tasks', task.id), { status: newStatus });
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update task status. Please try again.');
    }
    setUpdatingStatus(false);
  };

  const handleDownloadPDF = () => {
    if (!task) return;
    setDownloadingPdf(true);
    setTimeout(() => {
      try {
        const pdfPayload: TaskPDFData = {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          assignedName: employee?.name || task.assignedName || '',
          assignedEmail: employee?.email || '',
          assignedRole: employee?.role || '',
        };
        const pdf = generateTaskPDF(pdfPayload);
        const safeTitle = task.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
        pdf.save(`SpinTech_Task_${safeTitle}.pdf`);
      } catch (err) {
        console.error('PDF export error:', err);
        alert('Could not generate PDF. Please try again.');
      }
      setDownloadingPdf(false);
    }, 60);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-charcoal" />
          <p className="text-sm font-medium text-gray-500">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center border border-charcoal/10 shadow-sm">
          <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-serif-display text-2xl text-charcoal mb-2">Task Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            The task you are looking for may have been removed or reassigned.
          </p>
          <button
            onClick={() => navigate('/employee')}
            className="w-full bg-charcoal text-white py-3.5 rounded-2xl font-semibold hover:bg-black transition-colors"
          >
            Back to Employee Portal
          </button>
        </div>
      </div>
    );
  }

  const S = STATUS_CONFIG[task.status];
  const P = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const StatusIcon = S.icon;

  return (
    <div className="min-h-screen bg-beige-100 text-charcoal selection:bg-lime-400 selection:text-charcoal pt-24 pb-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button
            onClick={() => navigate('/employee')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-charcoal bg-white border border-charcoal/10 px-4 py-2.5 rounded-2xl shadow-xs transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to My Tasks
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-2xl text-sm font-semibold hover:bg-black transition-colors shadow-xs disabled:opacity-60"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 size={15} className="animate-spin text-lime-400" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileDown size={16} className="text-lime-400" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-charcoal/10 shadow-sm overflow-hidden"
        >

          {/* Card Header & Status Bar */}
          <div className="p-8 md:p-10 border-b border-charcoal/10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-lime-600 bg-lime-50 px-3 py-1 rounded-full border border-lime-200">
                Official Task Assignment
              </span>
              <span className="text-xs text-gray-400 font-mono">
                ID: {task.id}
              </span>
            </div>

            <h1 className={`font-serif-display text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight mb-6 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </h1>

            {/* Badges Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${S.bg}`}>
                <StatusIcon size={14} />
                {S.label}
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${P.badge}`}>
                <span className={`w-2 h-2 rounded-full ${P.dot}`} />
                {P.label}
              </span>

              {task.dueDate && (
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${isOverdue ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-beige-100 text-gray-600 border border-charcoal/10'}`}>
                  <Calendar size={13} />
                  {isOverdue ? 'Overdue · ' : 'Due · '}
                  {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Status Update Strip */}
          <div className="bg-beige-50 px-8 py-5 border-b border-charcoal/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                <BarChart3 size={13} />
                Update Task Status
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Click any status below to notify the admin in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(['todo', 'in-progress', 'done'] as const).map(st => {
                const isCurrent = task.status === st;
                const conf = STATUS_CONFIG[st];
                const Icon = conf.icon;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={updatingStatus}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isCurrent
                        ? `${conf.bg} border-current shadow-xs font-bold scale-[1.03] ring-2 ring-current/20`
                        : 'bg-white text-gray-600 border-charcoal/10 hover:border-charcoal/30 hover:text-charcoal'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{conf.label}</span>
                    {isCurrent && statusSuccess && (
                      <Check size={12} className="text-lime-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Section */}
          <div className="p-8 md:p-10 space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Tag size={13} />
                Task Description & Instructions
              </p>
              <div className="bg-beige-50/70 border border-charcoal/8 rounded-2xl p-6">
                {task.description ? (
                  <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    No detailed description provided by the administrator.
                  </p>
                )}
              </div>
            </div>

            {/* Structured Details Grid */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Task Specification Summary
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Assigned To */}
                <div className="bg-beige-50 rounded-2xl p-5 border border-charcoal/8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                    <User size={12} />
                    Assigned To
                  </p>
                  <div className="flex items-center gap-3">
                    {employee?.photoUrl ? (
                      <img
                        src={employee.photoUrl}
                        alt={employee.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-lime-400 shadow-xs shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-lime-200 text-lime-800 flex items-center justify-center font-bold text-sm shrink-0">
                        {employee?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-charcoal truncate text-sm">
                        {employee?.name || task.assignedName || 'You'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {employee?.email}
                      </p>
                    </div>
                  </div>
                  <span className="inline-block mt-3 text-[11px] font-semibold bg-lime-100 text-lime-800 px-2.5 py-0.5 rounded-full">
                    {employee?.role || 'Employee'}
                  </span>
                </div>

                {/* Status */}
                <div className="bg-beige-50 rounded-2xl p-5 border border-charcoal/8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <StatusIcon size={12} />
                    Status
                  </p>
                  <p className={`font-semibold text-sm ${S.bg}`}>
                    {S.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {task.status === 'done' ? 'Completed successfully' : task.status === 'in-progress' ? 'Work actively ongoing' : 'Pending start'}
                  </p>
                </div>

                {/* Priority */}
                <div className="bg-beige-50 rounded-2xl p-5 border border-charcoal/8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Priority
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${P.dot}`} />
                    <p className="font-semibold text-charcoal text-sm">{P.label}</p>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full ${P.bar}`} style={{ width: P.pct }} />
                  </div>
                </div>

                {/* Due Date */}
                <div className="bg-beige-50 rounded-2xl p-5 border border-charcoal/8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Due Date
                  </p>
                  <p className={`font-semibold text-sm ${isOverdue ? 'text-red-600' : 'text-charcoal'}`}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}
                  </p>
                  <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                    {isOverdue ? '⚠ Deadline Passed' : task.dueDate ? 'Pending delivery' : 'No set deadline'}
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-lime-600" />
                <span>SpinTech Official Assigned Task Specification</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloadingPdf}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-black transition-colors shadow-xs disabled:opacity-60"
                >
                  {downloadingPdf ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} className="text-lime-400" />}
                  Download Task PDF
                </button>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default EmployeeTaskDetail;
