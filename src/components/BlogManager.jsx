import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
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

  const handleSeed = async () => {
    const dummyPosts = [
      {
        title: 'Building a Scalable Microservices Architecture',
        slug: 'scalable-microservices',
        excerpt: 'An in-depth look at how we transitioned from a monolith to a robust microservices architecture using Node.js and Docker.',
        content: '# Building a Scalable Microservices Architecture\n\nTransitioning from a monolithic application to a microservices architecture is a significant engineering challenge. We utilized Docker to containerize our workloads and Node.js for ultra-fast async I/O operations.\n\n## The Problem\n\nOur original monolith was taking over 20 minutes to deploy...\n\n## The Solution\n\nBy decoupling the services, we achieved independent scaling and isolated failure domains.',
        tags: ['Architecture', 'Node.js', 'Docker'],
        published: true,
        createdAt: new Date().toISOString(),
        coverImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=2000&auto=format&fit=crop'
      },
      {
        title: 'Understanding React Server Components',
        slug: 'react-server-components',
        excerpt: 'Server Components are the future of React. Learn how they work and why they are a game changer for web performance.',
        content: '# Understanding React Server Components\n\nReact Server Components (RSC) allow you to render components on the server, sending only the final HTML and minimal JS to the client. This radically reduces bundle sizes.\n\n## Why it matters\n\nClient-side fetching often leads to waterfalls. RSCs allow you to fetch data directly on the server without shipping the fetching logic or dependencies to the client.',
        tags: ['React', 'Next.js', 'Performance'],
        published: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop'
      },
      {
        title: 'The Math Behind Transformers in AI',
        slug: 'transformers-math-ai',
        excerpt: 'A deep dive into the mathematical foundations of the Attention mechanism and Transformer models powering modern LLMs.',
        content: '# The Math Behind Transformers\n\nTransformers have revolutionized NLP. At their core is the self-attention mechanism, which mathematically represents how words relate to each other in a sequence.\n\n## Attention is All You Need\n\nThe fundamental equation: `Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V`.\n\nThis simple matrix multiplication is what gives LLMs their incredible contextual awareness.',
        tags: ['AI/ML', 'Mathematics', 'Deep Learning'],
        published: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop'
      },
      {
        title: 'Advanced State Management with Redux Toolkit',
        slug: 'redux-toolkit-advanced',
        excerpt: 'How to leverage RTK Query and slices to build predictable, easily testable state layers in large scale React applications.',
        content: '# Advanced State Management with Redux Toolkit\n\nRedux Toolkit simplifies Redux, but scaling it requires disciplined patterns. RTK Query essentially eliminates the need for hand-written thunks for data fetching.\n\n## Best Practices\n\nAlways co-locate your logic and avoid gigantic root reducers.',
        tags: ['React', 'Redux', 'Architecture'],
        published: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop'
      }
    ];

    try {
      for (const post of dummyPosts) {
        await addDoc(collection(db, 'blogs'), post);
      }
      alert('Dummy blogs seeded successfully!');
    } catch (error) {
      console.error(error);
      alert('Error seeding dummy blogs');
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
        <div className="flex gap-3">
          <button 
            onClick={handleSeed}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
          >
            Seed Dummy Posts
          </button>
          <button 
            onClick={() => openEditor()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
          >
            <FiPlus /> New Post
          </button>
        </div>
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
