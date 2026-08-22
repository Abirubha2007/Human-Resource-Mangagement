const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace PostgreSQL parameters ($1, $2, etc.) with MySQL parameters (?)
  content = content.replace(/\$\d+/g, '?');
  
  // Remove RETURNING * and RETURNING id
  content = content.replace(/RETURNING\s+\*/gi, '');
  content = content.replace(/RETURNING\s+id/gi, '');
  
  // Replace ILIKE with LIKE
  content = content.replace(/ILIKE/gi, 'LIKE');
  
  fs.writeFileSync(filePath, content);
  console.log('Processed', filePath);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'controllers'));
console.log('Migration complete.');
