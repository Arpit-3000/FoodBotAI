const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Updated path to look inside backend-api folder
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

console.log('Looking for service account at:', serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Error: serviceAccountKey.json not found at: ${serviceAccountPath}`);
  console.log('Current working directory:', process.cwd());
  console.log('Directory contents:', fs.readdirSync(path.dirname(serviceAccountPath)));
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const leadsCollection = db.collection('leads');

module.exports = leadsCollection;
