import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, getDocs, doc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';
import { FiPlus, FiImage, FiTrash2, FiEdit2 } from 'react-icons/fi';
import TripEditor from './TripEditor';
import ConfirmDelete from './ConfirmDelete';

export default function AdminDashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // TripEditor state
  const [isEditing, setIsEditing] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  // Helper to get total photo count for nested trips
  const getPhotoCount = (trip) => {
    let count = 0;
    if (trip.photos) count += trip.photos.length; // legacy support
    if (trip.destinations) {
      trip.destinations.forEach(dest => {
        if (dest.points) {
          dest.points.forEach(pt => {
            if (pt.photos) count += pt.photos.length;
          });
        }
      });
    }
    return count;
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'trips'), (snapshot) => {
      let tripsData = [];
      snapshot.forEach(doc => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date if needed, for now just set
      setTrips(tripsData);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'trips', id));
    } catch (err) {
      console.error("Error deleting trip: ", err);
      alert("Failed to delete trip.");
    }
  };

  const openEditor = (trip = null) => {
    setCurrentTrip(trip);
    setIsEditing(true);
  };

  if (isEditing) {
    return <TripEditor trip={currentTrip} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Travel Albums</h2>
          <p className="text-slate-400 font-light mt-1">Manage your trips and photos.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => openEditor()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors"
          >
            <FiPlus /> New Trip
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <FiImage className="mx-auto text-4xl text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No trips found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Get started by creating your first travel album. You can upload photos directly to it.</p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-colors"
            >
              <FiPlus /> Create First Trip
            </button>
            <button 
              onClick={async () => {
                try {
                  const { travelData } = await import('../sections/travelData');
                  const { setDoc, doc } = await import('firebase/firestore');
                  for (const trip of travelData) {
                    await setDoc(doc(db, 'trips', trip.id), trip);
                  }
                  alert("Successfully migrated existing data!");
                } catch(e) {
                  alert("Error migrating: " + e.message);
                }
              }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full transition-colors"
            >
              Migrate Old Data
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <div key={trip.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
              <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage className="text-4xl text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditor(trip)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors" title="Edit Trip">
                    <FiEdit2 size={14} />
                  </button>
                  <ConfirmDelete 
                    onConfirm={() => handleDelete(trip.id)} 
                    className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur flex items-center justify-center text-white transition-colors" 
                    title="Delete Trip" 
                  />
                </div>
              </div>
              
              <div className="p-5">
                <div className="text-xs font-mono text-emerald-400 mb-2">{trip.date}</div>
                <h3 className="text-lg font-medium text-white mb-1 truncate">{trip.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2">{trip.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
                  <span>{trip.date}</span>
                  <span className="flex items-center gap-1.5"><FiImage /> {getPhotoCount(trip)} Photos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
