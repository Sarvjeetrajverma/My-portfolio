import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi';

export default function BlogEditor({ blog, onBack }) {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    tags: blog?.tags?.join(', ') || '',
    published: blog?.published || false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    
    try {
      const fd = new FormData();
      fd.append('upload_preset', 'protfolio');
      fd.append('file', file);

      const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
        method: 'POST',
        body: fd
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, coverImage: data.secure_url }));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (!blog?.id) {
      // Auto-generate slug for new posts
      setFormData(prev => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
    } else {
      setFormData(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };

    if (!blog?.id) {
      dataToSave.createdAt = new Date().toISOString();
    }
    
    try {
      if (blog?.id) {
        await setDoc(doc(db, 'blogs', blog.id), dataToSave, { merge: true });
      } else {
        await addDoc(collection(db, 'blogs'), dataToSave);
      }
      onBack();
    } catch (err) {
      console.error(err);
      alert('Error saving post: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <FiArrowLeft /> Back to List
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Post Title</label>
              <input 
                required
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. How I built a Neural Network"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">URL Slug</label>
              <input 
                required
                type="text"
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Short Excerpt (For preview cards)</label>
              <textarea 
                required
                value={formData.excerpt}
                onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors h-20 resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400 flex items-center justify-between">
                <span>Markdown Content</span>
                <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-emerald-500 hover:underline text-xs">Markdown Guide</a>
              </label>
              <textarea 
                required
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-96 font-mono text-sm resize-y"
                placeholder="Write your content in markdown..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Publish Status</label>
              <select 
                value={String(formData.published)}
                onChange={e => setFormData(prev => ({ ...prev, published: e.target.value === 'true' }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="false">Draft (Hidden)</option>
                <option value="true">Published (Public)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Tags (comma separated)</label>
              <input 
                type="text"
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="e.g. AI, React, Tutorial"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Cover Image</label>
              <div className="aspect-video bg-black/40 rounded-lg border border-white/10 overflow-hidden relative group flex items-center justify-center">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-500 text-xs">No cover image</div>
                )}
                
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${formData.coverImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-xs px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                    {uploading ? <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full" /> : <FiUploadCloud />}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
