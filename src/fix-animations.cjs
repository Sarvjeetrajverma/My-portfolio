const fs = require('fs');
const path = require('path');

const dir = './src/sections';

const processFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace whileInView={{...}} without viewport
  content = content.replace(/whileInView=(\{\{[^}]+\}\})(?!\s*viewport)/g, 'whileInView=$1 viewport={{ once: true, amount: 0.1 }}');
  
  // Replace whileInView='visible' without viewport
  content = content.replace(/whileInView=[\"']visible[\"'](?!\s*viewport)/g, 'whileInView=\"visible\" viewport={{ once: true, amount: 0.1 }}');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', path.basename(file));
  }
};

const crawl = (d) => {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) {
      crawl(full);
    } else if (f.endsWith('.jsx')) {
      processFile(full);
    }
  }
};

crawl(dir);
