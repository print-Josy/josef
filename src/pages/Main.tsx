import { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Signup from '../components/Signup';  // Import the Signup component
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';  // Import your custom theme
import CssBaseline from '@mui/material/CssBaseline';

function Main() {
  const [user, setUser] = useState<FirebaseUser | null>(null); // Use FirebaseUser type
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

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.display = 'block';

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
              backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fmain_background.webp?alt=media&token=3e814c18-5236-4613-8397-f078f472b1ae")`,
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
                padding: '10px',
                borderRadius: '20px',
                maxWidth: '600px',
                textAlign: 'center',
                width: '60%',
                paddingTop: '20px',
              }}
          >
            <Signup />

            {/* Account Icon */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <IconButton onClick={handleSignOut} color="inherit">
                <AccountCircleIcon fontSize="large" />
                {user ? <Typography>{user.email}</Typography> : <Typography paddingLeft={1}>Please sign in</Typography>}
              </IconButton>
            </Box>

          </Container>
        </Box>
      </ThemeProvider>
  );
}

export default Main;
