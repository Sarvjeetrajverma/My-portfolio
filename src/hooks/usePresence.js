// src/hooks/usePresence.js
// Real-time visitor presence using Firebase Realtime Database onDisconnect()
// Each tab gets a unique session ID. On connect → writes to /presence/{sessionId}
// Firebase auto-removes it the moment the connection drops (tab close, navigate away, etc.)

import { useEffect, useRef, useState } from 'react';
import { rtdb } from '../firebase';
import {
  ref,
  set,
  remove,
  onDisconnect,
  onValue,
  serverTimestamp,
} from 'firebase/database';

function generateSessionId() {
  // Persist across hot-reloads but unique per browser tab
  const key = '__portfolio_session__';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * Returns { liveCount } — the number of currently connected visitors.
 * Also registers the current tab as a live visitor on mount.
 */
export function usePresence() {
  const [liveCount, setLiveCount] = useState(null);
  const sessionIdRef = useRef(generateSessionId());

  useEffect(() => {
    if (!rtdb) return; // Prevent crash if Firebase is not configured

    const sessionId = sessionIdRef.current;
    const presenceRef = ref(rtdb, `presence/${sessionId}`);
    const allPresenceRef = ref(rtdb, 'presence');

    // Check connection state — only write when truly online
    const connectedRef = ref(rtdb, '.info/connected');
    const unsubConnected = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Register this visitor
        set(presenceRef, {
          connectedAt: serverTimestamp(),
          ua: navigator.userAgent.slice(0, 80), // just first 80 chars for privacy
        });
        // Auto-remove on disconnect (tab close, refresh, network drop)
        onDisconnect(presenceRef).remove();
      }
    });

    // Watch total live count
    const unsubPresence = onValue(allPresenceRef, (snap) => {
      const data = snap.val();
      setLiveCount(data ? Object.keys(data).length : 0);
    });

    return () => {
      unsubConnected();
      unsubPresence();
      // Manually remove on unmount (React strict mode / SPA navigation)
      remove(presenceRef).catch(() => {});
    };
  }, []);

  return { liveCount };
}
