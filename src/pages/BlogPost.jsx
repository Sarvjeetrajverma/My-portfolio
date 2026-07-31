import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import CustomCursor from '../components/CustomCursor';
import ScrollToTop from '../components/ScrollToTop';
import Navbar from '../components/Navbar';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const q = query(collection(db, 'blogs'), where('slug', '==', slug), where('published', '==', true));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setBlog({ id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center font-sans">
        <Navbar />
        <h1 className="text-4xl font-medium mb-4">Post Not Found</h1>
        <p className="text-slate-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  // Rough reading time calculation
  const words = blog.content ? blog.content.split(/\s+/).length : 0;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="bg-transparent min-h-screen text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      
      <main className="max-w-3xl mx-auto px-6 py-32 md:py-40">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12">
          <FiArrowLeft /> Back
        </Link>
        
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 mb-6">
            <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><FiClock /> {readingTime} min read</span>
            <div className="flex gap-2 ml-auto">
              {(blog.tags || []).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-widest text-[9px]">{tag}</span>
              ))}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight mb-8">
            {blog.title}
          </h1>

          {blog.coverImage && (
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 bg-white/5 border border-white/10">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        <article className="prose prose-invert prose-emerald prose-lg max-w-none prose-headings:font-medium prose-a:text-emerald-400 prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
