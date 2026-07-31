import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiImage, FiUploadCloud } from 'react-icons/fi';

export default function ProjectEditor({ project, onBack }) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'v1.0 Online',
    category: project?.category || 'active',
    tech: project?.tech?.join(', ') || '',
    github: project?.github || '',
    demo: project?.demo || '',
    images: {
      dark: project?.images?.dark || '',
      light: project?.images?.light || '',
      read: project?.images?.read || '',
      green: project?.images?.green || ''
    }
  });

  const [uploadingTheme, setUploadingTheme] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, theme) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingTheme(theme);
    try {
      const fd = new FormData();
      fd.append('upload_preset', 'protfolio');
      fd.append('file', file, `project-${theme}.jpg`);

      const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
        method: 'POST',
        body: fd
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            [theme]: data.secure_url
          }
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingTheme(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const techArray = formData.tech.split(',').map(t => t.trim()).filter(Boolean);
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        github: formData.github,
        demo: formData.demo,
        tech: techArray,
        images: formData.images,
        updatedAt: new Date().toISOString()
      };

      if (project?.id) {
        await updateDoc(doc(db, 'projects', project.id), projectData);
      } else {
        projectData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'projects'), projectData);
      }
      
      onBack();
    } catch (err) {
      console.error(err);
      alert("Error saving project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const themes = ['dark', 'light', 'read', 'green'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <FiArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-medium">{project ? 'Edit Project' : 'New Project'}</h2>
          <p className="text-slate-400 font-light mt-1">Configure project details and images.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-6">Basic Details</h3>
          <div className="space-y-4">
            
            <div className="mb-6 border border-white/10 p-1 rounded-xl inline-flex bg-black/50">
              <button 
                type="button" 
                onClick={() => setFormData(p => ({ ...p, category: 'active' }))}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${formData.category === 'active' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`}
              >
                Active Project
              </button>
              <button 
                type="button" 
                onClick={() => setFormData(p => ({ ...p, category: 'upcoming' }))}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${formData.category === 'upcoming' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                Upcoming / In-Training
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Status (Badge)</label>
                <input name="status" value={formData.status} onChange={handleInputChange} placeholder="e.g. v1.0 Online" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Tech Stack (comma separated)</label>
                <input name="tech" value={formData.tech} onChange={handleInputChange} placeholder="React, Node, Firebase" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-6">Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">GitHub URL</label>
              <input type="url" name="github" value={formData.github} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Live Demo URL</label>
              <input type="url" name="demo" value={formData.demo} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-emerald-500/50 outline-none" />
            </div>
          </div>
        </div>

        {/* Theme Images */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-6">Theme Variants (Images)</h3>
          <p className="text-sm text-slate-400 mb-6">Upload a different image for each UI theme if applicable, or just reuse the same image.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {themes.map(theme => (
              <div key={theme} className="bg-black/40 border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium capitalize">{theme} Theme</span>
                  <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
                    {uploadingTheme === theme ? <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> : <FiUploadCloud />}
                    {uploadingTheme === theme ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, theme)} />
                  </label>
                </div>
                
                {formData.images[theme] ? (
                  <div className="aspect-[16/9] rounded-lg overflow-hidden border border-white/10 relative group">
                    <img src={formData.images[theme]} alt={theme} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData(prev => ({...prev, images: {...prev.images, [theme]: ''}}))} className="text-xs bg-red-500/80 hover:bg-red-500 px-3 py-1.5 rounded-full text-white">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500">
                    <FiImage size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">No image uploaded</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 border-t border-white/10 pt-8">
          <button type="button" onClick={onBack} className="px-6 py-2.5 rounded-full text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-8 py-2.5 rounded-full font-medium transition-colors">
            <FiSave /> {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
