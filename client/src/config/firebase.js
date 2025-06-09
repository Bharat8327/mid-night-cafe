import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDiRMk-QuZrKcfDKdDZYHqbG8dxicpXoxQ',
  authDomain: 'midnighcafe.firebaseapp.com',
  projectId: 'midnighcafe',
  storageBucket: 'midnighcafe.firebasestorage.app',
  messagingSenderId: '102110963764',
  appId: '1:102110963764:web:9a546d3620c4c35ed20261',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
