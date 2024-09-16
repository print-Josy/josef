// src/pages/Main.tsx
import { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NavButton from '../components/NavButton';
import Signup from '../components/Signup';  // Import the Signup component
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';  // Import your custom theme
import CssBaseline from '@mui/material/CssBaseline';

function Main() {
  const [user, setUser] = useState<any>(null);
  const auth = getAuth();

  // Monitor user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    });
  };

  // Apply custom body styles when this component loads
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.display = 'block';  // Ensure the body acts as a block element

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.display = '';
    };
  }, []);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Apply baseline styling */}
        <Box
            sx={{
              backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fcs24.webp?alt=media&token=77356202-96fe-40d7-bc34-9c6611531b75")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              minHeight: '100vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
        >
          <Container
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '600px',
                textAlign: 'center',
              }}
          >
            <Signup />
            <Typography variant="h3" gutterBottom>
              Welcome to the ECTS Tracker
            </Typography>

            {/* Account Icon */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={handleSignOut} color="inherit">
                <AccountCircleIcon fontSize="large" />
                {user ? <Typography>{user.email}</Typography> : <Typography>Guest</Typography>}
              </IconButton>
            </Box>

            <NavButton navigate_to="/master" label="Go to Master Page" />
          </Container>
        </Box>
      </ThemeProvider>
  );
}

export default Main;
