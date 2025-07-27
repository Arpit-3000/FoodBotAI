const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');


const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error('SERVICE_ACCOUNT_PATH environment variable is not set');
}

const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

if (!fs.existsSync(absolutePath)) {
  throw new Error(`Service account file not found at: ${absolutePath}`);
}

const serviceAccount = require(absolutePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const leadsCollection = db.collection('leads');

module.exports = leadsCollection;