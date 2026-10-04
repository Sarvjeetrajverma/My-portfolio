const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1].trim()] = match[2].trim();
  return acc;
}, {});

import('firebase/app').then(async (firebase) => {
  const { initializeApp } = firebase;
  const { getFirestore, collection, addDoc, getDocs, deleteDoc } = await import('firebase/firestore');
  
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Clear Experiences
  const expSnap = await getDocs(collection(db, 'experiences'));
  for (const doc of expSnap.docs) await deleteDoc(doc.ref);

  // Clear Achievements
  const achSnap = await getDocs(collection(db, 'achievements'));
  for (const doc of achSnap.docs) await deleteDoc(doc.ref);
  
  // Clear Education
  const eduSnap = await getDocs(collection(db, 'education'));
  for (const doc of eduSnap.docs) await deleteDoc(doc.ref);

  // Seed Education
  const edus = [
    {
      role: 'ML Researcher',
      institution: 'Research Institute / Lab',
      period: 'Recent',
      iconString: 'FaBrain',
      status: 'SYS_ACTIVE',
      details: [{ label: 'Details', value: 'Conducted research in Machine Learning and implemented advanced models.' }],
      order: 40
    },
    {
      role: 'B.Tech, Computer Science and Engineering',
      institution: 'Katihar Engineering College, Bihar Engineering University',
      period: 'Expected 2027',
      iconString: 'FaGraduationCap',
      status: 'SYS_ACTIVE',
      details: [{ label: 'CGPA', value: '8.03/10' }],
      order: 30
    },
    {
      role: 'JEE Scholar',
      institution: 'Joint Entrance Examination',
      period: 'Prior to 2023',
      iconString: 'FaAtom',
      status: 'ARCHIVED',
      details: [{ label: 'Details', value: 'Successfully cleared JEE with top percentile to secure admission into Engineering.' }],
      order: 20
    },
    {
      role: 'Intermediate (12th Grade)',
      institution: 'High School',
      period: 'Completed',
      iconString: 'FaSchool',
      status: 'ARCHIVED',
      details: [{ label: 'Stream', value: 'Science (PCM)' }],
      order: 10
    }
  ];
  
  for (const edu of edus) {
    await addDoc(collection(db, 'education'), edu);
  }
  
  console.log('Successfully seeded database');
  process.exit(0);
}).catch(console.error);
