import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSave, FiImage, FiPlus, FiTrash2, FiUploadCloud, FiMapPin, FiMap } from 'react-icons/fi';
import ConfirmDelete from './ConfirmDelete';

export default function TripEditor({ trip, onBack }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    date: trip?.date || '',
    description: trip?.description || '',
    coverImage: trip?.coverImage || '',
    destinations: trip?.destinations || []
  });
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(trip?.coverImage || '');

  // Add a new Destination
  const handleAddDestination = () => {
    const newDest = {
      id: 'dest-' + Date.now(),
      name: '',
      description: '',
      points: []
    };
    setFormData({ ...formData, destinations: [...formData.destinations, newDest] });
  };

  const handleUpdateDestination = (destIndex, field, value) => {
    const updated = [...formData.destinations];
    updated[destIndex][field] = value;
    setFormData({ ...formData, destinations: updated });
  };

  const handleRemoveDestination = (destIndex) => {
    const updated = [...formData.destinations];
    updated.splice(destIndex, 1);
    setFormData({ ...formData, destinations: updated });
  };

  // Add a new Point of Interest to a Destination
  const handleAddPoint = (destIndex) => {
    const updated = [...formData.destinations];
    updated[destIndex].points.push({
      id: 'point-' + Date.now(),
      name: '',
      description: '',
      photos: []
    });
    setFormData({ ...formData, destinations: updated });
  };

  const handleUpdatePoint = (destIndex, pointIndex, field, value) => {
    const updated = [...formData.destinations];
    updated[destIndex].points[pointIndex][field] = value;
    setFormData({ ...formData, destinations: updated });
  };

  const handleRemovePoint = (destIndex, pointIndex) => {
    const updated = [...formData.destinations];
    updated[destIndex].points.splice(pointIndex, 1);
    setFormData({ ...formData, destinations: updated });
  };

  // Handle Photo Uploads to a specific Point
  const handlePhotoUpload = async (e, destIndex, pointIndex) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setLoading(true);
    try {
      const updated = [...formData.destinations];
      const point = updated[destIndex].points[pointIndex];
      
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

        if (!point.photos) point.photos = [];
        point.photos.push({
          id: 'photo-' + Date.now() + i,
          url: data.secure_url,
          date: '',
          location: point.name || '',
          caption: ''
        });
      }
      setFormData({ ...formData, destinations: updated });
      e.target.value = '';
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Network Error: Could not reach Cloudinary to upload photos. If you are using an ad-blocker (like Brave Shields or uBlock Origin), please disable it for this site and try again. Detailed error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoto = (destIndex, pointIndex, photoIndex, field, value) => {
    const updated = [...formData.destinations];
    updated[destIndex].points[pointIndex].photos[photoIndex][field] = value;
    setFormData({ ...formData, destinations: updated });
  };

  const handleRemovePhoto = (destIndex, pointIndex, photoIndex) => {
    const updated = [...formData.destinations];
    updated[destIndex].points[pointIndex].photos.splice(photoIndex, 1);
    setFormData({ ...formData, destinations: updated });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let finalCoverUrl = formData.coverImage;

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
        coverImage: finalCoverUrl,
        updatedAt: new Date().toISOString()
      };

      if (trip?.id) {
        await setDoc(doc(db, 'trips', trip.id), tripDataToSave, { merge: true });
      } else {
        tripDataToSave.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'trips'), tripDataToSave);
      }
      
      alert("Trip saved successfully!");
      onBack();
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Error saving trip. If it failed to upload the cover image, please check your network or ad-blocker. Detailed error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-slate-200">
      <div className="max-w-5xl mx-auto p-6 pt-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <FiArrowLeft /> Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{trip ? 'Edit Trip' : 'Create New Trip'}</h1>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : <><FiSave /> Save Trip</>}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><FiMap /> Trip Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Trip Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Winter in Sikkim"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date / Duration</label>
              <input 
                type="text" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Dec 2023 - Jan 2024"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 h-24"
                placeholder="Write a short summary about this trip..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-400 mb-2">Cover Image</label>
              <div className="flex gap-4 items-center">
                {coverPreview && <img src={coverPreview} alt="Cover" className="w-32 h-20 object-cover rounded-lg border border-white/10" />}
                <label className="cursor-pointer bg-black/50 border border-white/10 rounded-lg px-4 py-3 hover:bg-black transition-colors flex items-center gap-2">
                  <FiImage /> Choose Cover
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files[0]) {
                      setCoverFile(e.target.files[0]);
                      setCoverPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations & Points */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Destinations (Itinerary)</h2>
            <button 
              onClick={handleAddDestination}
              className="flex items-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FiPlus /> Add Destination
            </button>
          </div>

          {formData.destinations.map((dest, destIndex) => (
            <div key={dest.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 relative">
              <ConfirmDelete 
                onConfirm={() => handleRemoveDestination(destIndex)}
                className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              />
              
              <div className="mb-6 mr-10">
                <input 
                  type="text" 
                  value={dest.name} 
                  onChange={e => handleUpdateDestination(destIndex, 'name', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-xl font-bold text-white focus:outline-none focus:border-blue-500 mb-2"
                  placeholder="Destination Name (e.g. Gangtok)"
                />
                <input 
                  type="text" 
                  value={dest.description} 
                  onChange={e => handleUpdateDestination(destIndex, 'description', e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 px-0 py-1 text-sm text-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="Optional short description..."
                />
              </div>

              {/* Points of Interest */}
              <div className="space-y-4 ml-4 pl-4 border-l-2 border-white/5">
                {dest.points.map((point, pointIndex) => (
                  <div key={point.id} className="bg-black/40 rounded-xl p-5 border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMapPin className="text-emerald-400" />
                          <input 
                            type="text" 
                            value={point.name} 
                            onChange={e => handleUpdatePoint(destIndex, pointIndex, 'name', e.target.value)}
                            className="flex-1 bg-transparent border-b border-white/20 px-1 py-1 font-semibold text-white focus:outline-none focus:border-emerald-500"
                            placeholder="Point of Interest (e.g. MG Marg)"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={point.description} 
                          onChange={e => handleUpdatePoint(destIndex, pointIndex, 'description', e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm text-slate-400 focus:outline-none focus:border-emerald-500"
                          placeholder="What did you do here?"
                        />
                      </div>
                      <ConfirmDelete 
                        onConfirm={() => handleRemovePoint(destIndex, pointIndex)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                      />
                    </div>

                    {/* Photos for this Point */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-300">Photos ({point.photos?.length || 0})</span>
                        <label className="cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          <FiUploadCloud /> Upload Photos
                          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, destIndex, pointIndex)} />
                        </label>
                      </div>

                      {point.photos?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {point.photos.map((photo, photoIndex) => (
                            <div key={photo.id} className="bg-black rounded-lg overflow-hidden border border-white/10 group relative">
                              <div className="aspect-square bg-slate-900 relative">
                                <img src={photo.url} alt="Uploaded" className="w-full h-full object-cover" />
                                <ConfirmDelete 
                                  onConfirm={() => handleRemovePhoto(destIndex, pointIndex, photoIndex)}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              </div>
                              <div className="p-2 space-y-2">
                                <input 
                                  type="text" 
                                  value={photo.caption || ''} 
                                  onChange={e => handleUpdatePhoto(destIndex, pointIndex, photoIndex, 'caption', e.target.value)}
                                  placeholder="Caption..."
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                />
                                <input 
                                  type="text" 
                                  value={photo.date || ''} 
                                  onChange={e => handleUpdatePhoto(destIndex, pointIndex, photoIndex, 'date', e.target.value)}
                                  placeholder="Date..."
                                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => handleAddPoint(destIndex)}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors mt-2"
                >
                  <FiPlus /> Add Point of Interest
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
