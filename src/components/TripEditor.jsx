import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiImage, FiPlus, FiTrash2, FiUploadCloud } from 'react-icons/fi';

export default function TripEditor({ trip, onBack }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    date: trip?.date || '',
    description: trip?.description || '',
    coverImage: trip?.coverImage || '',
    photos: trip?.photos || []
  });

  const [coverFile, setCoverFile] = useState(null);

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      alert("Title and Date are required");
      return;
    }

    setLoading(true);
    try {
      let finalCoverUrl = formData.coverImage;

      // Upload cover image if new one selected
      if (coverFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', coverFile);
        formDataUpload.append('upload_preset', 'protfolio');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const data = await res.json();
        if (data.secure_url) {
          finalCoverUrl = data.secure_url;
        } else {
          throw new Error(data.error?.message || "Failed to upload cover image");
        }
      }

      const tripDataToSave = {
        ...formData,
        coverImage: finalCoverUrl
      };

      if (trip?.id) {
        // Update
        await setDoc(doc(db, 'trips', trip.id), tripDataToSave);
      } else {
        // Create new (generate a URL friendly ID)
        const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        await setDoc(doc(db, 'trips', newId), tripDataToSave);
      }

      onBack();
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Photo uploading ---
  const handlePhotoUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setLoading(true);
    try {
      const newPhotos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', 'protfolio');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
          method: 'POST',
          body: formDataUpload
        });
        
        const data = await res.json();
        if (!data.secure_url) {
           throw new Error(data.error?.message || "Cloudinary upload failed");
        }

        newPhotos.push({
          id: 'photo-' + Date.now() + i,
          url: data.secure_url,
          date: '',
          location: '',
          caption: ''
        });
      }

      setFormData({ ...formData, photos: [...formData.photos, ...newPhotos] });

    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = (photoIndex, key, value) => {
    const newPhotos = [...formData.photos];
    newPhotos[photoIndex][key] = value;
    setFormData({ ...formData, photos: newPhotos });
  };

  const removePhoto = (photoIndex) => {
    const newPhotos = formData.photos.filter((_, i) => i !== photoIndex);
    setFormData({ ...formData, photos: newPhotos });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <FiArrowLeft /> Back
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-black px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : <FiSave />}
            Save Trip
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-medium mb-6">Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g., Summer in Paris"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Date / Duration</label>
                <input 
                  type="text" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g., June 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 h-24 resize-none"
                  placeholder="Brief summary of the trip..."
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Cover Image</label>
              <div className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-white/20 bg-black/50 overflow-hidden group flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-colors">
                {coverFile ? (
                  <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover" />
                ) : formData.coverImage ? (
                  <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <FiImage className="mx-auto text-3xl text-slate-500 mb-2" />
                    <span className="text-sm text-slate-400">Click to upload cover</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur">Change Image</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setCoverFile(e.target.files[0]);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Photos</h3>
            <div className="relative overflow-hidden cursor-pointer">
              <button className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg font-medium transition-colors pointer-events-none">
                <FiUploadCloud /> Upload Photos
              </button>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {formData.photos && formData.photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.photos.map((photo, pIndex) => (
                  <div key={photo.id || pIndex} className="flex gap-4 bg-black/30 border border-white/5 p-3 rounded-xl">
                    <img src={photo.url} alt="thumbnail" className="w-24 h-24 object-cover rounded-lg bg-black" />
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={photo.caption || ''} 
                        onChange={e => updatePhoto(pIndex, 'caption', e.target.value)}
                        placeholder="Caption..."
                        className="w-full bg-transparent border-b border-white/10 text-sm focus:border-emerald-500 outline-none px-1 py-0.5"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={photo.date || ''} 
                          onChange={e => updatePhoto(pIndex, 'date', e.target.value)}
                          placeholder="Date"
                          className="w-1/2 bg-transparent border-b border-white/10 text-xs focus:border-emerald-500 outline-none px-1 py-0.5"
                        />
                        <input 
                          type="text" 
                          value={photo.location || ''} 
                          onChange={e => updatePhoto(pIndex, 'location', e.target.value)}
                          placeholder="Location"
                          className="w-1/2 bg-transparent border-b border-white/10 text-xs focus:border-emerald-500 outline-none px-1 py-0.5"
                        />
                      </div>
                      <div className="flex justify-end pt-1">
                        <button onClick={() => removePhoto(pIndex)} className="text-slate-500 hover:text-red-400 text-xs">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-black/20 text-slate-500">
                No photos uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
