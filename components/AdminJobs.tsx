import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefcase, Plus, Trash2, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Job {
  id?: string;
  title: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
  createdAt?: string;
}

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<Job>({
    title: '',
    salary: '',
    experience: '',
    skills: '',
    description: ''
  });

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await updateDoc(doc(db, "jobs", editingJobId), {
          title: newJob.title,
          salary: newJob.salary,
          experience: newJob.experience,
          skills: newJob.skills,
          description: newJob.description
        });
      } else {
        await addDoc(collection(db, "jobs"), {
          ...newJob,
          createdAt: new Date().toISOString()
        });
      }
      setIsCreating(false);
      setEditingJobId(null);
      setNewJob({ title: '', salary: '', experience: '', skills: '', description: '' });
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job.");
    }
  };

  const handleEditClick = (job: Job) => {
    if (job.id) {
      setEditingJobId(job.id);
      setNewJob({
        title: job.title,
        salary: job.salary,
        experience: job.experience,
        skills: job.skills,
        description: job.description
      });
      setIsCreating(true);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteDoc(doc(db, "jobs", id));
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-charcoal/10 overflow-hidden mt-12 mb-20">
      <div className="p-8 border-b border-charcoal/10 flex justify-between items-center">
        <h2 className="font-serif-display text-3xl text-charcoal flex items-center gap-3">
          <Briefcase className="text-lime-500" />
          Manage Careers
        </h2>
        <button 
          onClick={() => {
            setEditingJobId(null);
            setNewJob({ title: '', salary: '', experience: '', skills: '', description: '' });
            setIsCreating(true);
          }}
          className="bg-lime-400 text-charcoal hover:bg-lime-500 px-6 py-3 rounded-full font-medium tracking-wide flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Create Job
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-beige-50">
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Job Title</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Experience</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Salary</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Skills</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-beige-50/50 transition-colors border-b border-charcoal/5 last:border-0">
                  <td className="py-5 px-8 font-medium text-charcoal">{job.title}</td>
                  <td className="py-5 px-8 text-gray-600">{job.experience}</td>
                  <td className="py-5 px-8 text-gray-600">{job.salary}</td>
                  <td className="py-5 px-8 text-sm text-gray-500 max-w-[200px] truncate" title={job.skills}>{job.skills}</td>
                  <td className="py-5 px-8 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(job)}
                      className="p-2 text-gray-400 hover:text-lime-600 hover:bg-lime-50 rounded-lg transition-colors inline-flex"
                      title="Edit Job"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => job.id && handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                      title="Delete Job"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center flex flex-col items-center">
          <Briefcase size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-charcoal mb-2">No jobs posted yet</h3>
          <p className="text-gray-500">Click the "Create Job" button to add a new career opportunity.</p>
        </div>
      )}

      {/* Create Job Modal */}
      <AnimatePresence>
        {isCreating && (
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
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-2xl max-h-[95vh] overflow-y-auto"
            >
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setEditingJobId(null);
                }}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-charcoal transition-colors bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
              <h2 className="font-serif-display text-3xl text-charcoal mb-6">
                {editingJobId ? "Edit Job Posting" : "Create New Job Posting"}
              </h2>
              
              <form onSubmit={handleSubmitJob}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Job Title</label>
                    <input type="text" name="title" required value={newJob.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Experience Required</label>
                    <input type="text" name="experience" required value={newJob.experience} onChange={handleChange} placeholder="e.g. 3-5 Years" className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Salary Range</label>
                    <input type="text" name="salary" required value={newJob.salary} onChange={handleChange} placeholder="e.g. $80k - $120k or Competitive" className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Required Skills (Comma separated)</label>
                    <input type="text" name="skills" required value={newJob.skills} onChange={handleChange} placeholder="e.g. React, TypeScript, Node.js" className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Job Description</label>
                    <textarea name="description" required value={newJob.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and benefits..." className="w-full border border-charcoal/10 rounded-xl p-3 focus:outline-none focus:border-lime-500 bg-beige-50 resize-y" rows={3}></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => { setIsCreating(false); setEditingJobId(null); }} className="px-6 py-3 rounded-full border border-charcoal/10 hover:bg-beige-100 font-medium">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-full bg-lime-400 text-charcoal hover:bg-lime-500 font-medium tracking-wide transition-colors">
                    {editingJobId ? "Save Changes" : "Create New Job Posting"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminJobs;
