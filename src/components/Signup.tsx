// src/components/Signup.tsx
import { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore database

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null); // Use FirebaseUser type

  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]);  // Only run this effect once when the component mounts

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setError(null);
      setUser(userCredential.user);

      // Save user to Firestore with their email and UID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,  // Save the user's email
        createdAt: new Date(),
      });

      console.log('User registered with email:', userCredential.user.email);
    } catch (error) {
      setError('Error signing up. Please try again.');
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setError(null);
      setUser(userCredential.user);

      console.log('User logged in with email:', userCredential.user.email);
    } catch (error) {
      setError('Error logging in. Please try again.');
      console.error(error);
    }
  };

  return (
      <div>
        {!isAuthenticated ? (
            <>
              <Typography variant="h4" gutterBottom>Sign Up or Log In</Typography>

              <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
              />

              <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
              />

              {error && <Typography color="error" variant="body2">{error}</Typography>}

              <Button variant="contained" color="primary" onClick={handleSignup}>
                Sign Up
              </Button>
              <Button variant="contained" color="secondary" onClick={handleLogin} style={{ marginLeft: '10px' }}>
                Log In
              </Button>
            </>
        ) : (
            <Typography variant="h5">Welcome, {user?.email}!</Typography>
        )}
      </div>
  );
}

export default Signup;
