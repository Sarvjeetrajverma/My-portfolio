import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FiPlus, FiImage, FiUploadCloud, FiX, FiRefreshCw } from 'react-icons/fi';
import ConfirmDelete from './ConfirmDelete';

import pf5 from '../assets/pf5.webp';
import pf from '../assets/pf.jpeg';
import pf7 from '../assets/pf7.webp';
import pf8 from '../assets/pf8.webp';
import srvprofile from '../assets/srvprofile.jpeg';

const defaultImages = [pf, pf5, pf7, pf8, srvprofile];

// Helpers for cropping
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function AboutImageManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cropper state
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        setImages(docSnap.data().profileImages || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1)); // 1:1 aspect ratio
  };

  const handleUploadCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsUploading(true);
    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Canvas is empty');
        
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', blob, 'about-image.jpg');
        formData.append('upload_preset', 'protfolio'); // Using the tested preset

        const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        
        if (data.secure_url) {
          const newImages = [...images, data.secure_url];
          await setDoc(doc(db, 'site_settings', 'about'), { profileImages: newImages }, { merge: true });
          setImgSrc('');
        } else {
          throw new Error(data.error?.message || 'Failed to upload');
        }
        setIsUploading(false);
      }, 'image/jpeg', 0.95);

    } catch (err) {
      console.error(err);
      alert('Error uploading cropped image.');
      setIsUploading(false);
    }
  };

  const handleDelete = async (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    try {
      await setDoc(doc(db, 'site_settings', 'about'), { profileImages: newImages }, { merge: true });
    } catch (err) {
      console.error(err);
      alert('Failed to delete image');
    }
  };

  const restoreDefaults = async () => {
    if (!window.confirm("This will upload the 5 original profile images to Cloudinary and add them to your gallery. Proceed?")) return;
    
    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (const imgPath of defaultImages) {
        const response = await fetch(imgPath);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'default-image.jpg');
        formData.append('upload_preset', 'protfolio');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dpj6dbqyn/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error('Cloudinary upload failed');
        }
      }
      
      const newImages = [...images, ...uploadedUrls];
      await setDoc(doc(db, 'site_settings', 'about'), { profileImages: newImages }, { merge: true });
      alert("Successfully restored default images!");
    } catch (err) {
      console.error(err);
      alert("Error restoring images: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">About Section Images</h2>
          <p className="text-slate-400 font-light mt-1">Manage the profile pictures carousel.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={restoreDefaults}
            disabled={isUploading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
          >
            <FiRefreshCw className={isUploading ? "animate-spin" : ""} /> Restore Defaults
          </button>
          <label className="cursor-pointer flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors">
            <FiPlus /> Add Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} onClick={e => e.target.value = null} />
          </label>
        </div>
      </div>

      {/* Crop Modal */}
      {imgSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-white">Crop Photo (1:1)</h3>
              <button onClick={() => setImgSrc('')} className="text-slate-400 hover:text-white"><FiX size={24} /></button>
            </div>
            <div className="flex justify-center bg-black rounded-xl overflow-hidden mb-6">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop={false}
              >
                <img 
                  ref={imgRef}
                  alt="Crop me" 
                  src={imgSrc} 
                  onLoad={onImageLoad}
                  style={{ maxHeight: '60vh' }}
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setImgSrc('')} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                onClick={handleUploadCrop} 
                disabled={isUploading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-6 py-2 rounded-full font-medium transition-colors"
              >
                {isUploading ? 'Uploading...' : <><FiUploadCloud /> Crop & Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <FiImage className="mx-auto text-4xl text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No images found</h3>
          <p className="text-slate-400 max-w-md mx-auto">Upload images to show in the About section carousel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((url, i) => (
            <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative aspect-square">
              <img src={url} alt={`Profile ${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ConfirmDelete 
                  onConfirm={() => handleDelete(i)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
                  iconSize={18}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
