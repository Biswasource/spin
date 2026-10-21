import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, storage, googleProvider } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowLeft, Upload, CheckCircle2, ChevronDown } from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors flex justify-between items-center"
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-charcoal/5 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-beige-50 transition-colors ${value === opt ? 'bg-beige-100 font-medium text-charcoal' : 'text-gray-600'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JobApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Application Form State
  const [appForm, setAppForm] = useState({
    fullName: '', phone: '', email: '', address: '', qualification: '', gender: 'Male',
    linkedin: '', github: '', portfolio: '', experience: '0-1 Years'
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      if (currentUser && id) {
        try {
          const q = query(collection(db, "jobApplications"), where("jobId", "==", id), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setAlreadyApplied(true);
          }
        } catch (e) {
          console.error("Failed to check existing application", e);
        }
      }
    };
    checkAlreadyApplied();
  }, [currentUser, id]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJobTitle(docSnap.data().title);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setAppForm(prev => ({ ...prev, email: user.email || '' }));
      }
    });
    return unsub;
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload your resume");
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setSubmitting(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
        amount: 19 * 100, // ₹19 in paise
        currency: "INR",
        name: "SpinTech",
        description: `Application Fee for ${jobTitle}`,
        prefill: {
          name: appForm.fullName,
          email: appForm.email,
          contact: appForm.phone,
        },
        theme: {
          color: "#84cc16", // lime-500
        },
        handler: async function (response: any) {
          try {
            const resumeUrl = resumeFile ? `File Selected: ${resumeFile.name}` : 'No resume uploaded';

            await addDoc(collection(db, "jobApplications"), {
              jobId: id,
              jobTitle: jobTitle,
              userId: currentUser.uid,
              ...appForm,
              resumeUrl,
              paymentId: response.razorpay_payment_id,
              amountPaid: 19,
              appliedAt: new Date().toISOString()
            });

            setApplied(true);
          } catch (err: any) {
            console.error("Error saving application:", err);
            alert("Failed to save application: " + (err.message || "Unknown error occurred."));
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error(err);
      alert("Failed: " + (err.message || "Unknown error occurred."));
      setSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAppForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link to={`/careers/${id}`} className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal font-medium mb-10 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to job details
        </Link>

        {applied ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6 text-lime-600">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-serif-display text-4xl text-charcoal mb-4">Application Submitted!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Thank you for applying to the <span className="font-medium text-charcoal">{jobTitle}</span> position. We will review your application and get back to you shortly.</p>
            <Link to="/careers" className="inline-flex px-8 py-3.5 rounded-full bg-charcoal text-white font-medium hover:bg-lime-400 hover:text-charcoal transition-colors">
              View More Jobs
            </Link>
          </motion.div>
        ) : alreadyApplied ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-beige-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-serif-display text-4xl text-charcoal mb-4">Already Applied</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You have already submitted an application for the <span className="font-medium text-charcoal">{jobTitle}</span> position.</p>
            <Link to="/careers" className="inline-flex px-8 py-3.5 rounded-full bg-charcoal text-white font-medium hover:bg-lime-400 hover:text-charcoal transition-colors">
              View More Jobs
            </Link>
          </motion.div>
        ) : !currentUser ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            <h2 className="font-serif-display text-3xl md:text-4xl text-charcoal mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mb-8 text-sm">You must be logged in to apply for the <span className="font-medium text-charcoal">{jobTitle}</span> position.</p>

            {authError && <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{authError}</div>}

            <form onSubmit={handleAuth} className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-3 focus:outline-none focus:border-lime-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-3 focus:outline-none focus:border-lime-500 transition-colors" />
              </div>
              <button type="submit" disabled={authLoading} className="relative overflow-hidden w-full bg-charcoal text-white py-4 rounded-full font-medium text-lg before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out disabled:opacity-50">
                <span className="relative z-10">{authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}</span>
              </button>
            </form>

            <div className="relative flex items-center py-2 mb-8">
              <div className="flex-grow border-t border-charcoal/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-charcoal/10"></div>
            </div>

            <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 border border-charcoal/10 py-4 rounded-full font-medium hover:bg-beige-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <div className="mt-8 text-center text-sm text-gray-500">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-lime-600 font-medium hover:underline">
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            <h2 className="font-serif-display text-3xl md:text-4xl text-charcoal mb-2">Job Application</h2>
            <p className="text-gray-500 mb-10 text-sm">Applying for: <span className="font-medium text-charcoal">{jobTitle}</span></p>

            <form onSubmit={handleApplySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Full Name *</label>
                  <input type="text" name="fullName" required value={appForm.fullName} onChange={handleFormChange} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Email Address *</label>
                  <input type="email" name="email" required value={appForm.email} onChange={handleFormChange} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" required value={appForm.phone} onChange={handleFormChange} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Highest Qualification *</label>
                  <input type="text" name="qualification" required value={appForm.qualification} onChange={handleFormChange} placeholder="e.g. B.Tech, MCA, BSc" className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors placeholder:text-gray-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Address *</label>
                  <input type="text" name="address" required value={appForm.address} onChange={handleFormChange} className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Gender *</label>
                  <CustomSelect 
                    value={appForm.gender}
                    onChange={(val) => setAppForm(prev => ({ ...prev, gender: val }))}
                    options={['Male', 'Female', 'Other']}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Experience *</label>
                  <CustomSelect 
                    value={appForm.experience}
                    onChange={(val) => setAppForm(prev => ({ ...prev, experience: val }))}
                    options={['Fresher', '0-1 Years', '1-3 Years', '3-5 Years', '5+ Years']}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">GitHub ID *</label>
                  <input type="text" name="github" required value={appForm.github} onChange={handleFormChange} placeholder="github.com/username" className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">LinkedIn ID (Optional)</label>
                  <input type="text" name="linkedin" value={appForm.linkedin} onChange={handleFormChange} placeholder="linkedin.com/in/username" className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors placeholder:text-gray-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Portfolio Link (Optional)</label>
                  <input type="url" name="portfolio" value={appForm.portfolio} onChange={handleFormChange} placeholder="https://yourwebsite.com" className="w-full border-b border-charcoal/20 bg-transparent px-0 py-2 focus:outline-none focus:border-lime-500 transition-colors placeholder:text-gray-400" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-charcoal/10">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Upload Resume (PDF/DOC) *</label>
                <div className="border-2 border-dashed border-charcoal/20 rounded-2xl p-10 text-center bg-beige-50/50 hover:bg-beige-50 transition-colors">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="resume-upload" 
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <Upload size={24} className="text-lime-600" />
                    </div>
                    <span className="font-medium text-charcoal mb-2 text-lg">
                      {resumeFile ? resumeFile.name : 'Click to upload resume'}
                    </span>
                    <span className="text-sm text-gray-400">PDF, DOC up to 5MB</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="relative overflow-hidden bg-charcoal text-white py-3 px-8 rounded-full font-medium text-sm disabled:opacity-50 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
                >
                  <span className="relative z-10">{submitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default JobApplication;
