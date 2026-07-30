import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';

export default function ConfirmDelete({ onConfirm, className, iconSize = 14, title = "Delete" }) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let timeout;
    if (confirming) {
      timeout = setTimeout(() => {
        setConfirming(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [confirming]);

  if (confirming) {
    return (
      <button 
        onClick={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          onConfirm(); 
          setConfirming(false); 
        }}
        className={`bg-red-600 text-white hover:bg-red-700 px-2 py-1 rounded text-xs font-bold shadow-lg flex items-center justify-center whitespace-nowrap transition-all ${className}`}
        title="Click to confirm deletion"
      >
        Sure?
      </button>
    );
  }

  return (
    <button 
      onClick={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        setConfirming(true); 
      }}
      className={className}
      title={title}
    >
      <FiTrash2 size={iconSize} />
    </button>
  );
}
