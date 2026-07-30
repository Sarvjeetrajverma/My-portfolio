import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { FiLogOut, FiPlus, FiImage, FiTrash2, FiSave, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

export default function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black z-0 pointer-events-none" />
        
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-10">
          <FiArrowLeft /> Back to Site
        </Link>
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl z-10 shadow-2xl relative">
          <h2 className="text-3xl font-medium text-white mb-2 tracking-tight">Admin Area</h2>
          <p className="text-slate-400 mb-8 font-light">Sign in to manage your portfolio.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                {loginError}
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-medium py-3 rounded-lg transition-colors mt-4"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (Protected) ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Admin Navbar */}
      <nav className="bg-black/50 border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors" title="Back to Site">
              <FiArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-xl font-medium tracking-tight border-l border-white/10 pl-4">Platform Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
}
