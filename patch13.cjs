const fs = require('fs');
const content = fs.readFileSync('src/components/TripDetails.jsx', 'utf8');

// The original signature had onNext, onPrev, and didn't have allPhotos
let newContent = content.replace(
  /const ZoomViewer = \({ photo, allPhotos, stats, toggleLike, recordView, recordAction, onClose }\) => {/,
  "const ZoomViewer = ({ photo, stats, toggleLike, recordView, recordAction, onClose, onNext, onPrev }) => {"
);

// We need to remove the currentIndex and initialIndex logic, and replace allPhotos.length with a simple call to onNext()/onPrev().
newContent = newContent.replace(
  /const initialIndex = allPhotos.findIndex\(p => p.id === photo.id\);\s*const \[currentIndex, setCurrentIndex\] = useState\(initialIndex >= 0 \? initialIndex : 0\);\s*const currentPhoto = allPhotos\[currentIndex\] \|\| photo;/g,
  ""
);

// Replace currentPhoto with photo everywhere
newContent = newContent.replace(/currentPhoto/g, "photo");

// Replace the swipe logic:
newContent = newContent.replace(
  /if \(info\.offset\.x > hThreshold\) setCurrentIndex\(\(prev\) => \(prev - 1 \+ allPhotos\.length\) % allPhotos\.length\);\s*else if \(info\.offset\.x < -hThreshold\) setCurrentIndex\(\(prev\) => \(prev \+ 1\) % allPhotos\.length\);/g,
  "if (info.offset.x > hThreshold) onPrev(); else if (info.offset.x < -hThreshold) onNext();"
);

// Replace the next/prev buttons logic:
newContent = newContent.replace(
  /setCurrentIndex\(\(prev\) => \(prev - 1 \+ allPhotos\.length\) % allPhotos\.length\)/g,
  "onPrev()"
);
newContent = newContent.replace(
  /setCurrentIndex\(\(prev\) => \(prev \+ 1\) % allPhotos\.length\)/g,
  "onNext()"
);

// We also need to fix the condition for showing the arrows. We don't have allPhotos.length, but we can just assume there's multiple, or check if onNext is passed.
newContent = newContent.replace(
  /window\.innerWidth > 768 && allPhotos\.length > 1/g,
  "window.innerWidth > 768 && onNext && onPrev"
);

fs.writeFileSync('src/components/TripDetails.jsx', newContent);
console.log("Fixed ZoomViewer props!");
