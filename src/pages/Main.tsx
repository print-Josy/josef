// src/pages/Main.tsx
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import NavButton from '../components/NavButton';  // Import your reusable button
import Signup from '../components/Signup';  // Import the Signup component

function Main() {
  // Apply custom body styles when this component loads
  useEffect(() => {
    // Set individual style properties
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.display = 'block';  // Ensure the body acts as a block element

    return () => {
      // Cleanup the specific styles when the component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.display = '';
    };
  }, []);

  return (
      <div
          style={{
            backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fcs24.webp?alt=media&token=77356202-96fe-40d7-bc34-9c6611531b75")`,
            backgroundSize: 'cover',    // Cover the entire viewport
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',  // Center the background image
            minHeight: '100vh',         // Take up full viewport height
            width: '100%',              // Ensure it covers the full width
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
      >
        <Container
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Semi-transparent background for content
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '600px',          // Limit the width of the content
              textAlign: 'center',        // Center-align text
            }}
        >
          <Signup />
          <Typography variant="h3" gutterBottom>
            Welcome to the ECTS Tracker
          </Typography>
          <NavButton navigate_to="/master" label="Go to Master Page" />
        </Container>
      </div>
  );
}

export default Main;
