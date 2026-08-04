const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('whatsapp-float') || content.toLowerCase().includes('whatsapp') || content.includes('wa.me') || content.includes('api.whatsapp.com')) {
        console.log(`Found match in: ${fullPath}`);
        // print matching lines
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes('whatsapp-float') || line.toLowerCase().includes('whatsapp') || line.includes('wa.me') || content.includes('api.whatsapp.com')) {
            console.log(`  L${index + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir(path.join(__dirname, 'src'));
