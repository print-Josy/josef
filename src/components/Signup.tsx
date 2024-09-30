// src/components/Signup.tsx
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material'; // Add Box here
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore database
import NavButton from './NavButton';  // Import NavButton

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Reload user to ensure we have updated info (email verification)
        setIsAuthenticated(currentUser.emailVerified); // Only set authenticated if email is verified
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [auth]);  // Only run this effect once when the component mounts

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setError(null);

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
              <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '24px', mb: 2 }}>WELCOME</Typography>

              {/* Buttons in a column layout */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: 3, mb: 2, alignItems: 'center'}}>
                <NavButton navigate_to="/master" label="ECTS-Tracker" />
                <NavButton navigate_to="#" label="Bachelor Page" />
                <NavButton navigate_to="#" label="Other Projects" />
                <NavButton navigate_to="#" label="University" />
              </Box>

            </>
        )}
      </div>
  );
}

export default Signup;
