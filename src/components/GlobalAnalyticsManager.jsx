import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FiUsers, FiEye, FiMousePointer, FiDownload, FiMail, FiActivity } from 'react-icons/fi';

// Simple Sparkline component for the charts
function Sparkline({ data, color = '#34d399', height = 40 }) {
  if (!data || data.length < 2) return (
    <div className="h-full flex items-end">
      <div className="w-full border-b border-dashed border-white/20 mb-2"></div>
    </div>
  );
  
  const max = Math.max(...data, 1);
  const min = 0;
  const range = max - min || 1;
  const w = 100;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = data[data.length - 1];
        const lx = 100;
        const ly = height - ((last - min) / range) * (height - 4) - 2;
        return <circle cx={lx} cy={ly} r="3" fill={color} />;
      })()}
    </svg>
  );
}

export default function GlobalAnalyticsManager() {
  const [globalData, setGlobalData] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const globalSnap = await getDoc(doc(db, 'analytics', 'global'));
        if (globalSnap.exists()) {
          setGlobalData(globalSnap.data());
        }

        const dailyRef = collection(db, 'analytics_daily');
        const q = query(dailyRef, orderBy('timestamp', 'desc'), limit(14));
        const dailySnap = await getDocs(q);
        const days = [];
        dailySnap.forEach(d => days.push(d.data()));
        setDailyData(days.reverse()); // Reverse to get chronological order for charts
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const visitors = globalData?.totalVisitors || 0;
  const pageViews = globalData?.totalPageViews || 0;
  
  // Extract sparkline data
  const visitorData = dailyData.map(d => d.visitors || 0);
  const pageViewData = dailyData.map(d => d.pageViews || 0);
  
  // Extract project clicks
  const projectClicks = globalData?.events?.project_click || {};
  // Sort projects by count
  const sortedProjects = Object.entries(projectClicks)
    .filter(([key]) => key !== 'total')
    .map(([key, count]) => ({ id: key, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Analytics Dashboard</h2>
          <p className="text-slate-400 font-light mt-1">Global site traffic and interactions.</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Visitors */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiUsers size={64} className="text-emerald-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
            <FiUsers className="text-emerald-400" /> Unique Visitors
          </p>
          <p className="text-4xl font-bold tracking-tight text-white mb-4">{visitors}</p>
          <div className="h-12 w-full mt-4">
            <Sparkline data={visitorData} color="#34d399" />
          </div>
        </div>

        {/* Total Page Views */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiEye size={64} className="text-blue-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
            <FiEye className="text-blue-400" /> Page Views
          </p>
          <p className="text-4xl font-bold tracking-tight text-white mb-4">{pageViews}</p>
          <div className="h-12 w-full mt-4">
            <Sparkline data={pageViewData} color="#60a5fa" />
          </div>
        </div>

        {/* Resume Downloads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
              <FiDownload className="text-purple-400" /> Resume Downloads
            </p>
            <p className="text-4xl font-bold tracking-tight text-white">
              {globalData?.events?.resume_download?.total || 0}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
            Total historical downloads
          </div>
        </div>

        {/* Contact Submissions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
              <FiMail className="text-pink-400" /> Contact Submissions
            </p>
            <p className="text-4xl font-bold tracking-tight text-white">
              {globalData?.events?.contact_submit?.total || 0}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
            Total messages sent
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Project Clicks */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiMousePointer className="text-amber-400" />
            <h3 className="text-lg font-medium text-white">Project Interactions</h3>
          </div>
          
          {sortedProjects.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No project clicks recorded yet.</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {sortedProjects.map((proj, idx) => (
                <div key={proj.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-4">{idx + 1}.</span>
                    <span className="text-sm text-slate-300">
                      {proj.id.replace('_github', ' (GitHub)').replace('_demo', ' (Live Demo)')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white bg-white/5 px-2 py-1 rounded">
                    {proj.count} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Data Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiActivity className="text-emerald-400" />
            <h3 className="text-lg font-medium text-white">Recent Daily Traffic (14 Days)</h3>
          </div>
          
          {dailyData.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No daily records found.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-white/5 text-xs uppercase text-slate-500 font-mono">
                  <tr>
                    <th className="px-4 py-3 border-b border-white/5">Date</th>
                    <th className="px-4 py-3 border-b border-white/5 text-right">Visitors</th>
                    <th className="px-4 py-3 border-b border-white/5 text-right">Page Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/20">
                  {/* Show newest first in the table */}
                  {[...dailyData].reverse().map((day) => (
                    <tr key={day.date} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-300">{day.date}</td>
                      <td className="px-4 py-3 text-right">{day.visitors || 0}</td>
                      <td className="px-4 py-3 text-right">{day.pageViews || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
