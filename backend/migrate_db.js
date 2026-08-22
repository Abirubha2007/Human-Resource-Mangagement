const fs = require('fs');
const path = require('path');

function migrateSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace SERIAL with INT AUTO_INCREMENT
  content = content.replace(/\bSERIAL\b/g, 'INT AUTO_INCREMENT');
  
  // Replace DROP TABLE IF EXISTS x CASCADE with SET FOREIGN_KEY_CHECKS = 0; ... SET FOREIGN_KEY_CHECKS = 1;
  content = "SET FOREIGN_KEY_CHECKS = 0;\n" + content;
  content = content.replace(/CASCADE;/g, ';'); // Just remove CASCADE from DROP TABLE
  
  // MySQL requires DEFAULT (CURRENT_DATE) for DATE columns if using function
  content = content.replace(/DEFAULT CURRENT_DATE/g, 'DEFAULT (CURRENT_DATE)');
  
  // Add SET FOREIGN_KEY_CHECKS = 1; at the end
  content += "\nSET FOREIGN_KEY_CHECKS = 1;\n";

  fs.writeFileSync(filePath, content);
  console.log('Migrated', filePath);
}

function migrateSeed(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Seed script might have some PostgreSQL specific things?
  // Let's just fix boolean values or standard things if needed.
  // We'll also disable foreign key checks during seed just in case
  content = "SET FOREIGN_KEY_CHECKS = 0;\n" + content + "\nSET FOREIGN_KEY_CHECKS = 1;\n";
  
  fs.writeFileSync(filePath, content);
  console.log('Migrated', filePath);
}

migrateSchema(path.join(__dirname, '..', 'database', 'schema.sql'));
migrateSeed(path.join(__dirname, '..', 'database', 'seed.sql'));
