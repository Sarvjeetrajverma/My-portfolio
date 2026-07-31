import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { FiPlus, FiImage, FiEdit2 } from 'react-icons/fi';
import ProjectEditor from './ProjectEditor';
import ConfirmDelete from './ConfirmDelete';

import project1Image from '../assets/project1.png';
import project2Image from '../assets/project2.png';
import project3Image from '../assets/project3.png';
import project4Image from '../assets/project4.png';

const fallbackImages = {
  dark: project1Image,
  light: project2Image,
  read: project3Image,
  green: project4Image
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      let projectsData = [];
      snapshot.forEach(doc => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date descending
      projectsData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error("Error deleting project: ", err);
      alert("Failed to delete project.");
    }
  };

  const openEditor = (project = null) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const seedInitialData = async () => {
    if (!window.confirm("This will migrate your hardcoded initial project into the database. Proceed?")) return;
    try {
      const initialProject = {
        title: "Portfolio Launchpad",
        description: "A highly optimized digital environment built to showcase my machine learning models and research. Engineered from scratch to ensure a high-performance, seamless user experience.",
        status: "v1.0 Online",
        category: "active",
        github: "https://github.com/sarvjeetrajverma/My-portfolio-3",
        demo: "https://my-protfolio.vercel.app",
        tech: ["React", "Tailwind CSS", "Framer Motion"],
        images: {
          dark: "",
          light: "",
          read: "",
          green: ""
        },
        createdAt: new Date().toISOString()
      };
      
      const newRef = doc(collection(db, 'projects'));
      await setDoc(newRef, initialProject);
      alert("Project seeded successfully!");
    } catch (e) {
      alert("Error seeding project: " + e.message);
    }
  };

  if (isEditing) {
    return <ProjectEditor project={currentProject} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Software Projects</h2>
          <p className="text-slate-400 font-light mt-1">Manage your research and implementations.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => openEditor()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors"
          >
            <FiPlus /> New Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <FiImage className="mx-auto text-4xl text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Get started by migrating your hardcoded project or creating a new one.</p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-colors"
            >
              <FiPlus /> Create Project
            </button>
            <button 
              onClick={seedInitialData}
              className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full transition-colors"
            >
              Migrate Original Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            // Get the first available image, or fallback to the dark theme local image
            const coverImage = project.images?.dark || project.images?.light || project.images?.read || project.images?.green || fallbackImages.dark;
            
            return (
              <div key={project.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col">
                <div className="aspect-[16/10] relative overflow-hidden bg-black/50">
                  {coverImage ? (
                    <img src={coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="text-4xl text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    {project.status}
                  </div>
                  
                  {project.category === 'upcoming' && (
                    <div className="absolute bottom-4 left-4 bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase">
                      Upcoming Model
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditor(project)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors" title="Edit Project">
                      <FiEdit2 size={14} />
                    </button>
                    <ConfirmDelete 
                      onConfirm={() => handleDelete(project.id)} 
                      className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur flex items-center justify-center text-white transition-colors" 
                      title="Delete Project" 
                    />
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-medium text-white mb-2 truncate">{project.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {(project.tech || []).slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] uppercase font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">
                        {t}
                      </span>
                    ))}
                    {(project.tech?.length > 3) && (
                      <span className="text-[10px] uppercase font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-500">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
