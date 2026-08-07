const fs = require('fs');
const content = fs.readFileSync('src/components/TripDetails.jsx', 'utf8');

// Replace the framer-motion import to include the missing ones
let newContent = content.replace(
  /import\s*{\s*motion,\s*AnimatePresence\s*}\s*from\s*['"]framer-motion['"];/,
  "import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';"
);

fs.writeFileSync('src/components/TripDetails.jsx', newContent);
console.log("Fixed imports!");
