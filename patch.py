import re

with open('src/components/TripDetails.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import './TravelGallery.css';", "import './TravelGallery.css';\nimport CustomLightbox from './CustomLightbox';")

pattern1 = re.compile(r'// --- GOOGLE PHOTOS STYLE VIEWER ---.*?(?=// --- MASONRY LAYOUT COMPONENT ---)', re.DOTALL)
content = pattern1.sub('', content)

pattern2 = re.compile(r'<AnimatePresence>\s*\{\s*selectedPhoto && \(\s*<ZoomViewer.*?</AnimatePresence>', re.DOTALL)
replacement = '''<CustomLightbox
        photos={safeTrip.allPhotos || []}
        initialIndex={selectedPhoto && safeTrip.allPhotos ? safeTrip.allPhotos.findIndex(p => p.id === selectedPhoto.id) : 0}
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        stats={stats}
        toggleLike={toggleLike}
        recordView={recordView}
        recordAction={recordAction}
      />'''
content = pattern2.sub(replacement, content)

with open('src/components/TripDetails.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
