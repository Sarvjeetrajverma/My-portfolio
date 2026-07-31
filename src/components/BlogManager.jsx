import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { FiPlus, FiFileText, FiEdit2 } from 'react-icons/fi';
import BlogEditor from './BlogEditor';
import ConfirmDelete from './ConfirmDelete';

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // Sort by creation date descending
      data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setBlogs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog post.");
    }
  };

  const openEditor = (blog = null) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  if (isEditing) {
    return <BlogEditor blog={currentBlog} onBack={() => setIsEditing(false)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Technical Notes & Blog</h2>
          <p className="text-slate-400 font-light mt-1">Publish markdown articles and deep-dives.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors"
        >
          <FiPlus /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl border-dashed">
          <FiFileText className="mx-auto text-4xl text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No posts found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">Start writing your first technical deep dive.</p>
          <button 
            onClick={() => openEditor()}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-colors"
          >
            <FiPlus /> Write Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col">
              <div className="aspect-[16/9] relative overflow-hidden bg-black/50">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiFileText className="text-4xl text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {blog.published ? 'Published' : 'Draft'}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditor(blog)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white transition-colors" title="Edit">
                    <FiEdit2 size={14} />
                  </button>
                  <ConfirmDelete 
                    onConfirm={() => handleDelete(blog.id)} 
                    className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur flex items-center justify-center text-white transition-colors" 
                    title="Delete" 
                  />
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-medium text-white mb-2 truncate">{blog.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4">{blog.excerpt || blog.content?.substring(0, 100) + '...'}</p>
                <div className="mt-auto flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span>/{blog.slug}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
