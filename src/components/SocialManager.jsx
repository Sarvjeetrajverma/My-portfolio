import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { FiPlus, FiInstagram } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { InstagramEmbed, XEmbed } from 'react-social-media-embed';
import ConfirmDelete from './ConfirmDelete';

export default function SocialManager() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'social_highlights'), (docSnap) => {
      if (docSnap.exists()) {
        setHighlights(docSnap.data().posts || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let platform = 'unknown';
    if (newUrl.includes('twitter.com') || newUrl.includes('x.com')) {
      platform = 'twitter';
    } else if (newUrl.includes('instagram.com')) {
      platform = 'instagram';
    } else {
      alert("Please enter a valid Twitter/X or Instagram URL.");
      return;
    }

    // Extract tweet ID for react-tweet
    let postId = '';
    let sanitizedUrl = newUrl;
    
    if (platform === 'twitter') {
      const match = newUrl.match(/\/status\/(\d+)/);
      if (match) {
        postId = match[1];
        // Clean URL because Twitter iframe fails if /photo/1 is in the URL
        sanitizedUrl = `https://twitter.com/x/status/${postId}`;
      } else {
        alert("Could not extract Tweet ID from the URL. Please make sure it looks like twitter.com/username/status/123456789");
        return;
      }
    }

    setIsSaving(true);
    try {
      const newPost = {
        id: 'post-' + Date.now(),
        platform,
        url: sanitizedUrl,
        postId, // For twitter
        addedAt: new Date().toISOString()
      };

      const updated = [newPost, ...highlights];
      await setDoc(doc(db, 'site_settings', 'social_highlights'), { posts: updated }, { merge: true });
      setNewUrl('');
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const updated = highlights.filter(h => h.id !== id);
    try {
      await setDoc(doc(db, 'site_settings', 'social_highlights'), { posts: updated }, { merge: true });
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Social Highlights</h2>
          <p className="text-slate-400 font-light mt-1">Curate your best Tweets and Instagram Reels for the homepage.</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm text-slate-400 mb-2">Paste Post URL (Instagram Reel or X/Twitter Post)</label>
          <input 
            type="url" 
            value={newUrl} 
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://twitter.com/... or https://www.instagram.com/p/..."
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <FiPlus /> {isSaving ? 'Adding...' : 'Add Highlight'}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : highlights.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <div className="flex justify-center gap-4 mb-4 text-slate-500 text-3xl">
            <FaXTwitter />
            <FiInstagram />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No highlights added yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">Paste a link above to feature a social media post on your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {highlights.map(post => (
            <div key={post.id} className="relative group w-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] hover:border-emerald-500/30 rounded-[2rem] p-5 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 backdrop-blur-xl">
              <div className="absolute top-4 right-4 z-20">
                <ConfirmDelete
                  onConfirm={() => handleDelete(post.id)}
                  title="Delete Highlight"
                  message="Are you sure you want to remove this highlight from your portfolio?"
                />
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.1] shadow-inner">
                  {post.platform === 'twitter' ? <FaXTwitter className="text-slate-300" size={14} /> : <FiInstagram className="text-slate-300" size={14} />}
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">{post.platform}</span>
              </div>
              
              <div className="flex justify-center w-full relative">
                {post.platform === 'twitter' && (
                  <div className="w-full pointer-events-none overflow-hidden rounded-[1.25rem] bg-black/30 border border-white/[0.04] p-1.5 shadow-inner">
                     <XEmbed url={post.url} width="100%" />
                  </div>
                )}
                {post.platform === 'instagram' && (
                  <div className="w-full pointer-events-none overflow-hidden rounded-[1.25rem] bg-black/30 border border-white/[0.04] p-1.5 shadow-inner">
                    <InstagramEmbed url={post.url} width="100%" style={{ background: 'transparent' }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
