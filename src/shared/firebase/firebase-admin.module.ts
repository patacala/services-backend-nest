import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('src/shared/firebase/firebase-service-account.json', 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };