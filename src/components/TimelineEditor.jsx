import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function TimelineEditor({ item, collectionName, onBack }) {
  const [formData, setFormData] = useState({
    role: item?.role || '',
    institution: item?.institution || '',
    period: item?.period || '',
    status: item?.status || 'SYS_ACTIVE',
    iconString: item?.iconString || 'FaBriefcase',
    order: item?.order || 0,
    details: item?.details || [],
    certificateImage: item?.certificateImage || '',
    link: item?.link || ''
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(20);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "protfolio");

      const res = await fetch(`https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload`, {
        method: "POST",
        body: uploadData
      });

      setUploadProgress(80);
      const data = await res.json();

      if (data.secure_url) {
        setFormData(prev => ({ ...prev, certificateImage: data.secure_url }));
        setUploadProgress(100);
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (item?.id) {
        await setDoc(doc(db, collectionName, item.id), formData);
      } else {
        await addDoc(collection(db, collectionName), formData);
      }
      onBack();
    } catch (err) {
      console.error(err);
      alert('Error saving experience: ' + err.message);
      setSaving(false);
    }
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { label: '', value: '' }]
    }));
  };

  const updateDetail = (index, field, value) => {
    setFormData(prev => {
      const newDetails = [...prev.details];
      newDetails[index][field] = value;
      return { ...prev, details: newDetails };
    });
  };

  const removeDetail = (index) => {
    setFormData(prev => {
      const newDetails = [...prev.details];
      newDetails.splice(index, 1);
      return { ...prev, details: newDetails };
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <FiArrowLeft /> Back to List
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-medium mb-6">{item ? 'Edit Entry' : 'New Entry'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Role / Title</label>
            <input 
              required
              type="text"
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. ML Researcher"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Institution / Org</label>
            <input 
              required
              type="text"
              value={formData.institution}
              onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. Kaggle"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Period</label>
            <input 
              required
              type="text"
              value={formData.period}
              onChange={e => setFormData(prev => ({ ...prev, period: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. 2023 - Present"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Display Order</label>
            <input 
              type="number"
              value={formData.order}
              onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Higher appears first"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">          <div className="space-y-2">
            <label className="text-sm text-slate-400">Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="SYS_ACTIVE">SYS_ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Icon Component String</label>
            <input 
              type="text"
              value={formData.iconString}
              onChange={e => setFormData(prev => ({ ...prev, iconString: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. FaBrain, FaBriefcase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Certificate Image Upload</label>
            <div className="flex flex-col gap-3">
              {formData.certificateImage && (
                <div className="relative w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={formData.certificateImage} alt="Certificate preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({...prev, certificateImage: ''}))} 
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 p-1.5 rounded text-white backdrop-blur-sm transition-colors"
                    title="Remove Image"
                  >
                    <FiTrash2 size={14}/>
                  </button>
                </div>
              )}
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer disabled:opacity-50"
              />
              {uploading && (
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">External Link</label>
            <input 
              type="url"
              value={formData.link}
              onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g. https://github.com/my-project"
            />
          </div>
        </div>

        {/* Details / Bullets */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-slate-400">Bullets / Details</label>
            <button 
              type="button" 
              onClick={addDetail}
              className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
            >
              <FiPlus /> Add Line
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.details.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="flex-1 space-y-3">
                  <input 
                    type="text"
                    value={item.label}
                    onChange={e => updateDetail(idx, 'label', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:border-emerald-500 transition-colors"
                    placeholder="Label (e.g. Focus, Roles) - Optional"
                  />
                  <textarea 
                    value={item.value}
                    onChange={e => updateDetail(idx, 'value', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-emerald-500 transition-colors h-20 resize-none"
                    placeholder="Detail / Bullet value..."
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => removeDetail(idx)}
                  className="mt-1 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            {formData.details.length === 0 && (
              <div className="text-center p-6 bg-black/20 rounded-lg border border-white/5 text-slate-500 text-sm">
                No details added yet.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
