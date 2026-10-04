import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { FiPlus, FiBriefcase, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TimelineEditor from './TimelineEditor';
import ConfirmDelete from './ConfirmDelete';

export default function TimelineManager({ collectionName, title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // Sort by order descending
      data.sort((a, b) => (b.order || 0) - (a.order || 0));
      setItems(data);
      setLoading(false);
    });
    return () => unsub();
  }, [collectionName]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error(err);
      alert(`Failed to delete ${title} entry.`);
    }
  };

  const openEditor = (item = null) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const seedInitialData = async () => {
    if (!window.confirm("This will migrate the initial default data into the database. Proceed?")) return;
    try {
      const initialData = [
        {
          role: "ML Researcher",
          institution: "Kaggle & Open Source",
          period: "2026 - Present",
          status: "SYS_ACTIVE",
          type: "experience",
          iconString: "FaBrain",
          details: [
            { label: "Focus", value: "Computer Vision & NLP" },
            { label: "Platform", value: "Kaggle Competitions" },
            { label: "Roles", value: "Data Pipeline Architect" },
            { label: "Achievements", value: "Top 20% in Image Classification" }
          ],
          order: 40
        },
        {
          role: "B.Tech (CSE)",
          institution: "Katihar Engineering College",
          period: "2023 - Present",
          status: "SYS_ACTIVE",
          type: "education",
          iconString: "FaLaptopCode",
          details: [
            { label: "Performance", value: "7.92 CGPA (Aggregate)" },
            { label: "Leadership", value: "Lead Coordinator - TechFusion'26" },
            { label: "Roles", value: "Core Team & Technical Team Lead" },
            { label: "Focus", value: "AI - ML Engineering" }
          ],
          order: 30
        },
        {
          role: "JEE Scholar",
          institution: "Magadh Super 30, Gaya",
          period: "2020 - 2022",
          status: "ARCHIVED",
          type: "education",
          iconString: "FaAtom",
          details: [
            { label: "Mentorship", value: "Under Ex-DGP Abhiyanand Sir" },
            { label: "Program", value: "Residential Coaching" },
            { label: "Focus", value: "Advanced Physics & Math" }
          ],
          order: 20
        },
        {
          role: "Intermediate (Science)",
          institution: "S.S. College Jehanabad",
          period: "2020 - 2022",
          status: "ARCHIVED",
          type: "education",
          iconString: "FaGraduationCap",
          details: [
            { label: "Stream", value: "Physics, Chemistry, Math" },
            { label: "Focus", value: "Engineering Entrance Prep" },
            { label: "Skills", value: "Analytical Problem Solving" }
          ],
          order: 10
        }
      ];

      for (const item of initialData) {
        const newRef = doc(collection(db, 'experiences'));
        await setDoc(newRef, item);
      }
      alert("Data seeded successfully!");
    } catch (e) {
      alert("Error seeding data: " + e.message);
    }
  };

  if (isEditing) {
    return <TimelineEditor collectionName={collectionName} item={currentItem} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Manage {title}</h2>
          <p className="text-slate-400 font-light mt-1">Manage entries for the {title} timeline.</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors"
        >
          <FiPlus /> Add Entry
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <FiBriefcase className="mx-auto text-4xl text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No entries found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Get started by adding your first {title.toLowerCase()} entry.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2 rounded-full transition-colors"
            >
              <FiPlus /> Add Entry
            </button>
            <button
              onClick={async () => {
                if (!window.confirm("Seed default data?")) return;
                try {
                  let defaultData = [];
                  if (collectionName === 'education') {
                    defaultData = [

                      {
                        role: "ML Researcher",
                        institution: "Kaggle & Open Source",
                        period: "2026 - Present",
                        status: "SYS_ACTIVE",
                        type: "experience",
                        iconString: "FaBrain",
                        details: [
                          { label: "Focus", value: "Computer Vision & NLP" },
                          { label: "Platform", value: "Kaggle Competitions" },
                          { label: "Roles", value: "Data Pipeline Architect" },
                          { label: "Achievements", value: "Top 20% in Image Classification" }
                        ],
                        order: 40
                      },
                      { role: 'B.Tech, Computer Science and Engineering', institution: 'Katihar Engineering College', period: 'Expected 2027', iconString: 'FaGraduationCap', status: 'SYS_ACTIVE', details: [{ label: "Performance", value: "7.92 CGPA (Aggregate)" }, { label: "Leadership", value: "Lead Coordinator - TechFusion'26" }, { label: "Roles", value: "Core Team & Technical Team Lead" }, { label: "Focus", value: "AI - ML Engineering" }], order: 30 },
                      { role: 'JEE Scholar', institution: 'Magadh Super 30, Gaya', period: '2020 - 2022', iconString: 'FaAtom', status: 'ARCHIVED', details: [{ label: "Mentorship", value: "Under Ex-DGP Abhiyanand Sir" }, { label: "Program", value: "Residential Coaching" }, { label: "Focus", value: "Advanced Physics & Math" }], order: 20 },
                      { role: 'Intermediate (Science)', institution: 'S.S. College Jehanabad', period: '2020 - 2022', iconString: 'FaGraduationCap', status: 'ARCHIVED', details: [{ label: "Stream", value: "Physics, Chemistry, Math" }, { label: "Focus", value: "Engineering Entrance Prep" }, { label: "Skills", value: "Analytical Problem Solving" }], order: 10 }
                    ];
                  } else if (collectionName === 'experiences') {
                    defaultData = [
                      { role: 'Web Development Intern', institution: 'Ezyintern', period: 'March 2026 – April 2026', iconString: 'FaCode', status: 'ARCHIVED', details: [{ label: 'Description', value: 'Completed a 6-week Web Development internship at Ezyintern, scoring 93% in the final practical assessment.' }], order: 80 },
                      { role: 'Web Development Intern', institution: 'ApexPlanet Software', period: 'March 2026 – April 2026', iconString: 'FaCode', status: 'ARCHIVED', details: [{ label: 'Description', value: 'Completed a 6-week virtual web development internship with ApexPlanet Software, where I focused on hands-on project development using HTML, CSS, and JavaScript.' }], order: 70 },
                      { role: 'Core Coordinator & Technical Lead', institution: "TechFusion '25 & '26", period: '2025 - 2026', iconString: 'FaBriefcase', status: 'SYS_ACTIVE', details: [{ label: 'Role', value: 'Organizing and leading technical events and coordination.' }], order: 60 },
                      { role: 'Student Placement Coordinator (TPO Cell)', institution: 'Katihar Engineering College', period: 'Present', iconString: 'FaBriefcase', status: 'SYS_ACTIVE', details: [{ label: 'Role', value: 'Managing student placement drives and coordinating with recruiters.' }], order: 50 }
                    ];
                  }
                  for (let item of defaultData) {
                    await setDoc(doc(collection(db, collectionName)), item);
                  }
                  alert("Data seeded successfully!");
                } catch (e) {
                  alert("Error seeding data: " + e.message);
                }
              }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full transition-colors"
            >
              Seed Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all flex flex-col relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{item.status}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white">{item.role}</h3>
                  <p className="text-sm text-indigo-400">{item.institution}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => openEditor(item)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" title="Edit">
                    <FiEdit2 size={12} />
                  </button>
                  <ConfirmDelete
                    onConfirm={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                    title="Delete"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono mb-4">{item.period}</div>

              <div className="space-y-2 mt-auto">
                {(item.details || []).slice(0, 2).map((d, i) => (
                  <div key={i} className="text-xs">
                    <span className="text-slate-500 font-medium">{d.label}: </span>
                    <span className="text-slate-300">{d.value}</span>
                  </div>
                ))}
                {(item.details?.length > 2) && (
                  <div className="text-xs text-slate-500 italic">+{item.details.length - 2} more details</div>
                )}
                
                {(item.certificateImage || item.link) && (
                  <div className="flex gap-2 pt-2 mt-2 border-t border-white/10">
                    {item.certificateImage && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">📸 Image Attached</span>}
                    {item.link && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">🔗 Link Attached</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
