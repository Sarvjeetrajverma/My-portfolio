import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FiSave, FiUploadCloud, FiFileText } from 'react-icons/fi';

export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [settings, setSettings] = useState({
    resumePdfUrl: '',
    availableForHire: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handlePdfUpload = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }
    
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('upload_preset', 'protfolio'); // Using the same preset as images
      fd.append('file', file);

      // Cloudinary upload endpoint for raw files (like PDF)
      const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/raw/upload', {
        method: 'POST',
        body: fd
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (data.secure_url) {
        setSettings(prev => ({ ...prev, resumePdfUrl: data.secure_url }));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Global Settings</h2>
          <p className="text-slate-400 font-light mt-1">Manage global site configurations and files.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8">
        
        {/* Availability Toggle */}
        <div>
          <h3 className="text-lg font-medium mb-4">Availability Status</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`relative w-12 h-6 rounded-full transition-colors ${settings.availableForHire ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.availableForHire ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm text-slate-300">
              {settings.availableForHire ? 'Actively looking for opportunities' : 'Not currently looking'}
            </span>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={settings.availableForHire} 
              onChange={(e) => setSettings(prev => ({ ...prev, availableForHire: e.target.checked }))} 
            />
          </label>
        </div>

        <div className="h-px bg-white/10" />

        {/* Resume Upload */}
        <div>
          <h3 className="text-lg font-medium mb-4">Resume PDF</h3>
          <p className="text-sm text-slate-400 mb-6">Upload your latest resume PDF. This will update the download links across the site.</p>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            {settings.resumePdfUrl ? (
              <div className="mb-4 text-emerald-400 flex flex-col items-center">
                <FiFileText size={32} className="mb-2" />
                <span className="text-sm">Current PDF Active</span>
                <a href={settings.resumePdfUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-white mt-2 underline">View Current File</a>
              </div>
            ) : (
              <div className="mb-4 text-slate-500 flex flex-col items-center">
                <FiFileText size={32} className="mb-2 opacity-50" />
                <span className="text-sm">No custom PDF uploaded (Using local fallback)</span>
              </div>
            )}
            
            <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-sm px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 text-white">
              {uploading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <FiUploadCloud />}
              {uploading ? 'Uploading PDF...' : 'Upload New PDF'}
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading} />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
