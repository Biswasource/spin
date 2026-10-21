import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Briefcase, MapPin, IndianRupee, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
  createdAt?: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (currentUser) {
        try {
          const q = query(collection(db, "jobApplications"), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          const ids = new Set<string>();
          querySnapshot.forEach((doc) => {
            ids.add(doc.data().jobId);
          });
          setAppliedJobIds(ids);
        } catch (e) {
          console.error("Error fetching user applications", e);
        }
      } else {
        setAppliedJobIds(new Set());
      }
    };
    fetchAppliedJobs();
  }, [currentUser]);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-beige-100 pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="text-lime-600 font-semibold tracking-widest uppercase text-sm mb-4 block">Join Our Team</span>
          <h1 className="font-serif-display text-5xl md:text-7xl text-charcoal mb-6">
            Careers at Spintech
          </h1>
          <p className="text-xl text-charcoal/70 max-w-2xl mx-auto">
            We're always looking for talented individuals who are passionate about building extraordinary digital experiences.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="py-8 border-b border-charcoal/10 last:border-0 hover:border-lime-400 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex items-center gap-5 md:gap-8">
                  <div className="w-14 h-14 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform hidden md:flex">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-2xl md:text-3xl text-charcoal mb-3">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        <Clock size={16} className="text-lime-600" />
                        {job.experience}
                      </div>
                      <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        <IndianRupee size={16} className="text-lime-600" />
                        {job.salary}
                      </div>
                      <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        <MapPin size={16} className="text-lime-600" />
                        Remote
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                  <Link 
                    to={`/careers/${job.id}`}
                    className="flex-1 md:flex-none px-6 py-3 rounded-full border border-charcoal/10 text-charcoal font-medium hover:bg-beige-50 transition-colors text-center text-sm"
                  >
                    View Details
                  </Link>
                  {appliedJobIds.has(job.id) ? (
                    <div className="flex-1 md:flex-none px-8 py-3 rounded-full bg-lime-100 text-lime-700 font-medium text-center text-sm cursor-default">
                      Applied
                    </div>
                  ) : (
                    <Link
                      to={`/careers/${job.id}`}
                      className="relative overflow-hidden flex-1 md:flex-none px-8 py-3 rounded-full bg-charcoal text-white font-medium text-center text-sm before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
                    >
                      <span className="relative z-10">Apply Now</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-charcoal/5 shadow-sm">
            <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="font-serif-display text-3xl text-charcoal mb-4">No Open Positions</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We don't have any open positions at the moment, but we are always on the lookout for great talent. Send us your resume at <a href="mailto:spintechdesign@gmail.com" className="text-lime-600 font-medium hover:underline">spintechdesign@gmail.com</a>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Jobs;
