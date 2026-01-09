const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, 'backend', 'data', 'users.json');

console.log('Users file path:', usersFile);
console.log('File exists:', fs.existsSync(usersFile));

if (fs.existsSync(usersFile)) {
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  console.log('Users loaded:', Object.keys(users));
  
  const testuser = users['testuser'];
  if (testuser) {
    console.log('\nTesting password comparison for testuser:');
    console.log('Stored hash:', testuser.password);
    
    bcrypt.compare('pass123', testuser.password).then(match => {
      console.log('Password "pass123" matches:', match);
    });
  } else {
    console.log('testuser not found in users.json');
  }
} else {
  console.log('users.json not found');
}
