// src/components/Signup.tsx
import { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { getAuth, signInAnonymously } from "firebase/auth";
import { db } from '../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignup = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      // Firebase anonymous authentication
      const auth = getAuth();
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Store the username in Firestore with the user ID
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        createdAt: new Date(),
      });

      setIsAuthenticated(true);
      setError(null);
      console.log("Anonymous user signed in with username:", username);

    } catch (error) {
      console.error("Error signing in anonymously:", error);
      setError("Error signing in. Please try again.");
    }
  };

  return (
      <div>
        {!isAuthenticated ? (
            <>
              <Typography variant="h4" gutterBottom>
                Sign Up with your unique Username
              </Typography>
              <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  margin="normal"
              />
              {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
              )}
              <Button variant="contained" color="primary" onClick={handleSignup}>
                Sign Up
              </Button>
            </>
        ) : (
            <Typography variant="h5" gutterBottom>
              Welcome, {username}!
            </Typography>
        )}
      </div>
  );
}

export default Signup;
