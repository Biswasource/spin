import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Edit2, Trash2, X, Eye, EyeOff, RefreshCw, Copy, Check, Mail, User, KeyRound, Loader2, ExternalLink, Share2, Upload, Camera
} from 'lucide-react';
import { db } from '../lib/firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  photoUrl?: string;
  createdAt: string;
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  let pwd = '';
  for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  return pwd;
};

const AdminEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const emptyForm = { name: '', email: '', password: generatePassword(), role: 'Employee', photoUrl: '' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data: Employee[] = snap.docs.map(d => ({
        id: d.id,
        name: d.data().name || '',
        email: d.data().email || '',
        password: d.data().password || '',
        role: d.data().role || 'Employee',
        photoUrl: d.data().photoUrl || '',
        createdAt: d.data().createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      }));
      setEmployees(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    setUploadingPhoto(true);
    try {
      const res = await fetch(`/api/upload-profile?name=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.photoUrl) {
          setForm(prev => ({ ...prev, photoUrl: data.photoUrl }));
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setForm(prev => ({ ...prev, photoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
    setUploadingPhoto(false);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, password: generatePassword(), photoUrl: '' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditTarget(emp);
    setForm({
      name: emp.name,
      email: emp.email,
      password: emp.password,
      role: emp.role,
      photoUrl: emp.photoUrl || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPassword = form.password.trim();
    if (!cleanName || !cleanEmail || !cleanPassword) return;
    setSaving(true);
    try {
      const payload = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: form.role,
        photoUrl: form.photoUrl || '',
      };
      if (editTarget) {
        await updateDoc(doc(db, 'employees', editTarget.id), payload);
        setEmployees(prev => prev.map(e => e.id === editTarget.id ? { ...e, ...payload } : e));
      } else {
        const ref = await addDoc(collection(db, 'employees'), {
          ...payload, createdAt: serverTimestamp(),
        });
        setEmployees(prev => [{ id: ref.id, ...payload, createdAt: new Date().toISOString() }, ...prev]);
      }
      setShowModal(false);
    } catch (e) { console.error(e); alert('Failed to save employee.'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'employees', deleteTarget.id));
      setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id));
    } catch (e) { console.error(e); alert('Failed to delete.'); }
    setDeleteTarget(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyEmployeeInvite = (emp: Employee) => {
    const portalUrl = `${window.location.origin}/employee`;
    const message = `SpinTech Employee Login Credentials:\nPortal: ${portalUrl}\nEmail: ${emp.email}\nPassword: ${emp.password}\nRole: ${emp.role}`;
    copyToClipboard(message, `invite-${emp.id}`);
  };

  const toggleShowPwd = (id: string) => setShowPwd(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="font-serif-display text-3xl text-charcoal">Employees</h2>
          <p className="text-gray-500 text-sm mt-1">Manage team members & their credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/employee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-charcoal/15 bg-white text-charcoal px-4 py-3 rounded-2xl font-medium hover:border-charcoal/40 transition-colors text-sm shadow-xs"
          >
            <ExternalLink size={16} />
            Employee Portal
          </a>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-charcoal text-white px-5 py-3 rounded-2xl font-medium hover:bg-black transition-colors"
          >
            <UserPlus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-3xl border border-charcoal/10 p-16 text-center">
          <User size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-charcoal mb-2">No employees yet</h3>
          <p className="text-gray-500">Add your first employee to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-charcoal/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-beige-50 border-b border-charcoal/10">
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Employee</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Role</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Password</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-widest text-gray-500">Joined</th>
                  <th className="py-4 px-6 text-xs font-semibold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp.id} className="border-b border-charcoal/5 last:border-0 hover:bg-beige-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {emp.photoUrl ? (
                          <img
                            src={emp.photoUrl}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border border-charcoal/10 shadow-xs shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 flex items-center justify-center font-bold text-charcoal text-sm shrink-0">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-charcoal">{emp.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />{emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold bg-lime-100 text-lime-700 px-3 py-1 rounded-full">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-beige-100 px-3 py-1 rounded-lg text-charcoal tracking-wide">
                          {showPwd[emp.id] ? emp.password : '••••••••••••'}
                        </code>
                        <button onClick={() => toggleShowPwd(emp.id)} className="text-gray-400 hover:text-charcoal transition-colors">
                          {showPwd[emp.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => copyToClipboard(emp.password, emp.id)} className="text-gray-400 hover:text-lime-600 transition-colors">
                          {copied === emp.id ? <Check size={14} className="text-lime-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => copyEmployeeInvite(emp)}
                          title="Copy Full Login Credentials & Portal Link"
                          className="p-2 text-gray-400 hover:text-charcoal hover:bg-beige-100 rounded-xl transition-colors"
                        >
                          {copied === `invite-${emp.id}` ? <Check size={16} className="text-lime-600" /> : <Share2 size={16} />}
                        </button>
                        <button onClick={() => openEdit(emp)} title="Edit Employee" className="p-2 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-xl transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(emp)} title="Delete Employee" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <Trash2 size={16} />
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 md:p-10 w-full max-w-lg relative shadow-2xl"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-charcoal bg-gray-100 rounded-full">
                <X size={18} />
              </button>
              <h2 className="font-serif-display text-3xl text-charcoal mb-8">
                {editTarget ? 'Edit Employee' : 'Add Employee'}
              </h2>

              <div className="space-y-5">
                {/* Profile Photo */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-beige-100 border border-charcoal/10 overflow-hidden flex items-center justify-center shrink-0">
                      {form.photoUrl ? (
                        <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={24} className="text-gray-400" />
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                          <Loader2 size={18} className="animate-spin text-lime-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-charcoal/15 bg-white text-charcoal hover:border-charcoal/40 text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                          <Upload size={14} />
                          <span>{form.photoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploadingPhoto}
                          />
                        </label>
                        {form.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}
                            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">Saved into public folder and displayed in employee portal</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Role</label>
                  <select
                    value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full py-3 px-4 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors text-charcoal"
                  >
                    <option>Employee</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Manager</option>
                    <option>Intern</option>
                    <option>HR</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Password (share with employee)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPwd['modal'] ? 'text' : 'password'}
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-charcoal/10 rounded-xl bg-beige-50 focus:outline-none focus:border-lime-500 transition-colors font-mono tracking-wider"
                      />
                      <button type="button" onClick={() => toggleShowPwd('modal')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPwd['modal'] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, password: generatePassword() })}
                      title="Generate new password"
                      className="p-3 border border-charcoal/10 rounded-xl bg-beige-50 hover:bg-lime-50 hover:border-lime-400 text-gray-400 hover:text-lime-600 transition-colors"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(form.password, 'modal-copy')}
                      title="Copy password"
                      className="p-3 border border-charcoal/10 rounded-xl bg-beige-50 hover:bg-lime-50 hover:border-lime-400 text-gray-400 hover:text-lime-600 transition-colors"
                    >
                      {copied === 'modal-copy' ? <Check size={16} className="text-lime-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Click the refresh icon to generate a secure password. Copy and share with the employee.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-2xl border border-charcoal/10 hover:bg-beige-100 font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-charcoal text-white font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {editTarget ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
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
              <h3 className="font-serif-display text-2xl text-charcoal mb-2">Remove Employee?</h3>
              <p className="text-gray-500 mb-8">
                This will permanently delete <strong>{deleteTarget.name}</strong> and their login credentials.
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

export default AdminEmployees;
