import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ExperienceEditor({ exp, onBack }) {
  const [formData, setFormData] = useState({
    role: exp?.role || '',
    institution: exp?.institution || '',
    period: exp?.period || '',
    status: exp?.status || 'SYS_ACTIVE',
    type: exp?.type || 'experience',
    iconString: exp?.iconString || 'FaBriefcase',
    order: exp?.order || 0,
    details: exp?.details || []
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (exp?.id) {
        await setDoc(doc(db, 'experiences', exp.id), formData);
      } else {
        await addDoc(collection(db, 'experiences'), formData);
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
        <h3 className="text-xl font-medium mb-6">{exp ? 'Edit Entry' : 'New Entry'}</h3>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Category Type</label>
            <select 
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="leadership">Leadership</option>
            </select>
          </div>

          <div className="space-y-2">
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
