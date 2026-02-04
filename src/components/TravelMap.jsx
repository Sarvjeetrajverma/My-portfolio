import React, { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const TravelMap = ({ trips }) => {
  const [tooltip, setTooltip] = useState({ content: "", x: 0, y: 0, visible: false });
  const containerRef = useRef(null);

  const handleMouseMove = (e, content) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        content,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        visible: true
      });
    }
  };

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto mb-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white inline-block border-b-2 border-cyan-500 pb-1">
          Journey Map
        </h3>
      </div>
      
      <div ref={containerRef} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl relative h-[400px] md:h-[500px]">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 150 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[80, 20]} zoom={1} minZoom={0.7} maxZoom={12}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {trips.map((trip) => (
            trip.coordinates && (
              <Marker 
                key={trip.id} 
                coordinates={trip.coordinates}
                onMouseEnter={(e) => handleMouseMove(e, `${trip.title} • ${trip.date}`)}
                onMouseMove={(e) => handleMouseMove(e, `${trip.title} • ${trip.date}`)}
                onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
              >
                <motion.circle
                  r={3}
                  fill="#06b6d4"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 4 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.circle 
                  r={4} 
                  fill="#06b6d4" 
                  stroke="#fff" 
                  strokeWidth={2} 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                  whileHover={{ scale: 1.5, cursor: "pointer" }}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontFamily: "monospace", fill: "#fff", fontSize: "10px", fontWeight: "bold", textShadow: "0px 0px 2px #000" }}
                >
                  {trip.title.split(',')[0]}
                </text>
              </Marker>
            )
          ))}
          </ZoomableGroup>
        </ComposableMap>

        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "absolute",
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -100%)",
                marginTop: "-12px",
                pointerEvents: "none",
                zIndex: 50
              }}
              className="bg-slate-900/90 border border-cyan-500/30 text-cyan-50 text-xs font-medium px-3 py-2 rounded-lg shadow-xl backdrop-blur-md whitespace-nowrap"
            >
              {tooltip.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TravelMap;