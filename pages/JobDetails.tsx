import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Briefcase, MapPin, IndianRupee, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
  createdAt?: string;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

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
          setJob({ id: docSnap.id, ...docSnap.data() } as Job);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-beige-100 flex flex-col justify-center items-center p-6 text-center">
        <Briefcase size={48} className="text-gray-300 mb-6" />
        <h1 className="font-serif-display text-4xl text-charcoal mb-4">Job Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The job you are looking for does not exist or has been removed.</p>
        <Link to="/careers" className="bg-charcoal text-white px-8 py-3 rounded-full hover:bg-lime-400 hover:text-charcoal transition-colors font-medium">
          Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <Link to="/careers" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal font-medium mb-10 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to all jobs
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative flex flex-col md:flex-row"
        >
          {/* Left Column: Info & Skills */}
          <div className="p-8 md:p-12 lg:p-16 md:w-5/12 border-b md:border-b-0 md:border-r border-charcoal/10 flex flex-col">
            <div className="w-16 h-16 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center mb-8 shrink-0">
              <Briefcase size={32} />
            </div>
            
            <h2 className="font-serif-display text-3xl md:text-4xl text-charcoal mb-6 pr-4">{job.title}</h2>
            
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-charcoal/10 shrink-0 shadow-sm">
                  <Clock size={18} className="text-lime-600" />
                </div>
                {job.experience}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-charcoal/10 shrink-0 shadow-sm">
                  <IndianRupee size={18} className="text-lime-600" />
                </div>
                {job.salary}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-charcoal/10 shrink-0 shadow-sm">
                  <MapPin size={18} className="text-lime-600" />
                </div>
                Remote Work
              </div>
            </div>

            <div className="mt-auto">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.split(',').map((skill, i) => (
                  <span key={i} className="text-xs font-medium text-charcoal bg-white px-3 py-1.5 rounded-lg border border-charcoal/10 shadow-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Description & Apply */}
          <div className="p-8 md:p-12 lg:p-16 md:w-7/12 flex flex-col">
            <div className="flex-1">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Job Description</h4>
              <div className="text-charcoal/80 leading-relaxed whitespace-pre-line text-sm">
                {job.description}
              </div>
            </div>

            <div className="shrink-0 mt-12 pt-10 border-t border-charcoal/5">
              {alreadyApplied ? (
                <div className="flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-lime-100 text-lime-700 font-medium text-sm w-full cursor-default">
                  You have already applied for this position
                </div>
              ) : (
                <Link
                  to={`/careers/${job.id}/apply`}
                  className="relative overflow-hidden bg-charcoal text-white text-center py-4 px-8 rounded-full text-sm font-medium tracking-wide flex items-center justify-center gap-2 group/btn w-full shadow-lg before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Apply for this position
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>



    </div>
  );
};

export default JobDetails;
