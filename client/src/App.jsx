import React from 'react';
import { auth, googleAuthProvider } from './config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

function App() {
  const signInWithGoogle = async () => {
    // Sign in with Google popup
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await result.user.getIdToken();
    console.log(result);

    const res = await axios.post('http://localhost:3000/u/verify', {
      idToken,
    });
    console.log(res);
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with google</button>
    </div>
  );
}

export default App;
