import { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore database

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null); // Use FirebaseUser type
  const [emailVerified, setEmailVerified] = useState(false);

  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Reload user to ensure we have updated info (email verification)
        setUser(currentUser);
        setIsAuthenticated(currentUser.emailVerified); // Only set authenticated if email is verified
        setEmailVerified(currentUser.emailVerified);   // Track email verification status
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setEmailVerified(false);
      }
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]);  // Only run this effect once when the component mounts

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setError(null);
      setUser(userCredential.user);

      // Send email verification
      await sendEmailVerification(userCredential.user);
      setError('Verification email sent. Please verify your email before logging in.');

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
      await userCredential.user.reload(); // Reload user to check email verification

      if (userCredential.user.emailVerified) {
        setIsAuthenticated(true);
        setError(null);
        setUser(userCredential.user);
        setEmailVerified(true);
        console.log('User logged in with email:', userCredential.user.email);
      } else {
        setError('Please verify your email before logging in.');
      }
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
            <>
              <Typography variant="h5">Welcome, {user?.email}!</Typography>
              {!emailVerified && (
                  <Typography color="error" variant="body2">
                    Please verify your email to access all features.
                  </Typography>
              )}
            </>
        )}
      </div>
  );
}

export default Signup;
