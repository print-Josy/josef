// src/pages/Main.tsx


import { Container, Typography } from '@mui/material';
import NavButton from '../components/NavButton'; // Import your reusable button

function Main() {
  return (
      <Container>
        <Typography variant="h3" gutterBottom>
          Welcome to the ECTS Tracker
        </Typography>
        <NavButton navigate_to="/master" label="Go to Master Page" />
      </Container>
  );
}

export default Main;
