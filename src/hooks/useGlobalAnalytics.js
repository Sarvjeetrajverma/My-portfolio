import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * Tracks a specific interaction event.
 * @param {string} eventName - The category of event (e.g. 'project_click', 'resume_download')
 * @param {object} eventData - Additional data (e.g. { id: 'project-1' })
 */
export const trackEvent = async (eventName, eventData = {}) => {
  try {
    const globalRef = doc(db, 'analytics', 'global');
    
    // Create a dynamic field path. 
    // Example: events.project_click.my_project_id OR events.resume_download.total
    const fieldPath = eventData.id 
      ? `events.${eventName}.${eventData.id}`
      : `events.${eventName}.total`;
      
    await setDoc(globalRef, {
      [fieldPath]: increment(1)
    }, { merge: true });
    
  } catch (error) {
    console.error("Analytics Error (Event):", error);
  }
};

/**
 * Hook to automatically track unique visitors and page views.
 * Should be placed at the root of the app (e.g., App.jsx).
 */
export function useGlobalAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only track actual routes, ignore admin routes to keep data clean
    if (location.pathname.startsWith('/admin')) return;

    const trackVisitAndPage = async () => {
      try {
        const today = getTodayString();
        const globalRef = doc(db, 'analytics', 'global');
        const dailyRef = doc(db, 'analytics_daily', today);

        // 1. Unique Visitor Tracking (Session-based)
        if (!sessionStorage.getItem('__portfolio_visitor_tracked')) {
          sessionStorage.setItem('__portfolio_visitor_tracked', 'true');
          
          await setDoc(globalRef, { totalVisitors: increment(1) }, { merge: true });
          await setDoc(dailyRef, { visitors: increment(1), date: today, timestamp: new Date().getTime() }, { merge: true });
        }

        // 2. Page View Tracking
        const currentPath = location.pathname;
        const lastPath = sessionStorage.getItem('__portfolio_last_path');
        
        if (lastPath !== currentPath) {
          sessionStorage.setItem('__portfolio_last_path', currentPath);
          
          await setDoc(globalRef, { totalPageViews: increment(1) }, { merge: true });
          await setDoc(dailyRef, { pageViews: increment(1), date: today, timestamp: new Date().getTime() }, { merge: true });
        }
      } catch (error) {
        console.error("Analytics Error (Page View):", error);
      }
    };

    trackVisitAndPage();
  }, [location.pathname]);
}
