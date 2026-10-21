import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { FileText, Download, User, Calendar, ExternalLink } from 'lucide-react';

interface Application {
  id: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  portfolio: string;
  appliedAt: string;
}

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const q = query(collection(db, "jobApplications"), orderBy("appliedAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedApps: Application[] = [];
        snapshot.forEach((doc) => {
          fetchedApps.push({ id: doc.id, ...doc.data() } as Application);
        });
        setApplications(fetchedApps);
      } catch (err) {
        console.error("Error fetching applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading applications...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-charcoal/10 overflow-hidden">
      <div className="p-8 border-b border-charcoal/10">
        <h2 className="font-serif-display text-3xl text-charcoal">Job Applications</h2>
      </div>

      {applications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-beige-50">
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Applicant</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Job Role</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Background</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10">Links</th>
                <th className="py-4 px-8 text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-charcoal/10 text-right">Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-beige-50/50 transition-colors border-b border-charcoal/5 last:border-0">
                  <td className="py-5 px-8">
                    <div>
                      <p className="font-medium text-charcoal">{app.fullName}</p>
                      <p className="text-sm text-gray-500">{app.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{app.phone}</p>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <p className="font-medium text-charcoal">{app.jobTitle}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-5 px-8">
                    <p className="text-sm text-charcoal"><span className="text-gray-400 text-xs mr-1">Exp:</span>{app.experience}</p>
                    <p className="text-sm text-charcoal mt-1"><span className="text-gray-400 text-xs mr-1">Qual:</span>{app.qualification || '-'}</p>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col gap-1">
                      {app.github && <a href={app.github.startsWith('http') ? app.github : `https://${app.github}`} target="_blank" rel="noreferrer" className="text-xs text-lime-600 hover:underline flex items-center gap-1">GitHub <ExternalLink size={10} /></a>}
                      {app.linkedin && <a href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`} target="_blank" rel="noreferrer" className="text-xs text-lime-600 hover:underline flex items-center gap-1">LinkedIn <ExternalLink size={10} /></a>}
                      {app.portfolio && <a href={app.portfolio} target="_blank" rel="noreferrer" className="text-xs text-lime-600 hover:underline flex items-center gap-1">Portfolio <ExternalLink size={10} /></a>}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-full text-xs font-medium hover:bg-lime-400 hover:text-charcoal transition-colors"
                    >
                      <Download size={14} />
                      Resume
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center flex flex-col items-center">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-charcoal mb-2">No applications yet</h3>
          <p className="text-gray-500">When candidates apply for jobs, their applications will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
