import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Edit2, Trash2, X, CheckCircle2, Clock, AlertCircle, Circle, Loader2, ClipboardList, User, Calendar, FileDown
} from 'lucide-react';
import { db } from '../lib/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { Employee } from './AdminEmployees';
import { generateTaskPDF } from '../lib/taskPdf';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // employee id
  assignedName: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

const statusConfig = {
  'todo': { label: 'To Do', icon: Circle, color: 'bg-gray-100 text-gray-600' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'bg-blue-100 text-blue-600' },
  'done': { label: 'Done', icon: CheckCircle2, color: 'bg-lime-100 text-lime-600' },
};

const priorityConfig = {
  'low': { label: 'Low', color: 'bg-green-100 text-green-700' },
  'medium': { label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  'high': { label: 'High', color: 'bg-red-100 text-red-700' },
};

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const emptyForm = { title: '', description: '', assignedTo: '', assignedName: '', status: 'todo' as Task['status'], priority: 'medium' as Task['priority'], dueDate: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskSnap, empSnap] = await Promise.all([
        getDocs(query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'employees'), orderBy('createdAt', 'desc'))),
      ]);
      const taskData: Task[] = taskSnap.docs.map(d => ({
        id: d.id,
        title: d.data().title || '',
        description: d.data().description || '',
        assignedTo: d.data().assignedTo || '',
        assignedName: d.data().assignedName || '',
        status: d.data().status || 'todo',
        priority: d.data().priority || 'medium',
        dueDate: d.data().dueDate || '',
        createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }));
      const empData: Employee[] = empSnap.docs.map(d => ({
        id: d.id,
        name: d.data().name || '',
        email: d.data().email || '',
        password: d.data().password || '',
        role: d.data().role || 'Employee',
        createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }));
      setTasks(taskData);
      setEmployees(empData);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTarget(task);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      assignedName: task.assignedName,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setShowModal(true);
  };

  const handleAssigneeChange = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    setForm(f => ({ ...f, assignedTo: empId, assignedName: emp?.name || '' }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await updateDoc(doc(db, 'tasks', editTarget.id), {
          title: form.title, description: form.description, assignedTo: form.assignedTo,
          assignedName: form.assignedName, status: form.status, priority: form.priority, dueDate: form.dueDate,
        });
        setTasks(prev => prev.map(t => t.id === editTarget.id ? { ...t, ...form } : t));
      } else {
        const ref = await addDoc(collection(db, 'tasks'), {
          ...form, createdAt: serverTimestamp(),
        });
        setTasks(prev => [{ id: ref.id, ...form, createdAt: new Date().toISOString() }, ...prev]);
      }
      setShowModal(false);
    } catch (e) { console.error(e); alert('Failed to save task.'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'tasks', deleteTarget.id));
      setTasks(prev => prev.filter(t => t.id !== deleteTarget.id));
    } catch (e) { console.error(e); }
    setDeleteTarget(null);
  };

  const handleDownloadTaskPDF = (task: Task) => {
    const emp = employees.find(e => e.id === task.assignedTo);
    const pdf = generateTaskPDF({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      assignedName: task.assignedName || emp?.name || '',
      assignedEmail: emp?.email || '',
      assignedRole: emp?.role || '',
    });
    const safeTitle = task.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    pdf.save(`SpinTech_Task_${safeTitle}.pdf`);
  };

  const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-serif-display text-3xl text-charcoal">Tasks</h2>
          <p className="text-gray-500 text-sm mt-1">Create and assign tasks to your team</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex gap-1 bg-white border border-charcoal/10 rounded-2xl p-1">
            {['all', 'todo', 'in-progress', 'done'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${filterStatus === s ? 'bg-charcoal text-white' : 'text-gray-500 hover:text-charcoal'}`}
              >
                {s === 'all' ? 'All' : statusConfig[s as Task['status']].label}
              </button>
            ))}
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-charcoal text-white px-5 py-3 rounded-2xl font-medium hover:bg-black transition-colors"
          >
            <PlusCircle size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-charcoal/10 p-16 text-center">
          <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-charcoal mb-2">No tasks found</h3>
          <p className="text-gray-500">Create a new task to assign to your team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map(task => {
            const S = statusConfig[task.status];
            const StatusIcon = S.icon;
            const P = priorityConfig[task.priority];
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-charcoal/10 rounded-3xl p-6 hover:shadow-md transition-shadow group"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-charcoal text-base leading-tight line-clamp-2 flex-1">{task.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => handleDownloadTaskPDF(task)}
                      title="Download Task PDF"
                      className="p-1.5 text-gray-400 hover:text-charcoal hover:bg-beige-100 rounded-lg transition-colors"
                    >
                      <FileDown size={14} />
                    </button>
                    <button onClick={() => openEdit(task)} title="Edit Task" className="p-1.5 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(task)} title="Delete Task" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${S.color}`}>
                    <StatusIcon size={11} />
                    {S.label}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${P.color}`}>
                    {P.label}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold text-xs">
                      {task.assignedName ? task.assignedName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="truncate max-w-[100px]">{task.assignedName || 'Unassigned'}</span>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-charcoal bg-gray-100 rounded-full">
                <X size={18} />
              </button>
              <h2 className="font-serif-display text-3xl text-charcoal mb-8">
                {editTarget ? 'Edit Task' : 'Create Task'}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Task Title *</label>
                  <input
                    type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors"
                    placeholder="e.g. Design homepage banner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                  <textarea
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                    placeholder="Task details, requirements..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Assign To</label>
                    <select
                      value={form.assignedTo} onChange={e => handleAssigneeChange(e.target.value)}
                      className="w-full py-3 px-4 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors text-charcoal"
                    >
                      <option value="">— Unassigned —</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Priority</label>
                    <select
                      value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                      className="w-full py-3 px-4 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors text-charcoal"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Status</label>
                    <select
                      value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Task['status'] })}
                      className="w-full py-3 px-4 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors text-charcoal"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Due Date</label>
                    <input
                      type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full py-3 px-4 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors text-charcoal"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-2xl border border-charcoal/10 hover:bg-beige-100 font-medium">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-charcoal text-white font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editTarget ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-serif-display text-2xl text-charcoal mb-2">Delete Task?</h3>
              <p className="text-gray-500 mb-8">
                "<strong>{deleteTarget.title}</strong>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-2xl border border-charcoal/10 hover:bg-beige-100 font-medium">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTasks;
