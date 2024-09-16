// src/pages/Master.tsx
import { Container, Typography } from '@mui/material';
import NavButton from '../components/NavButton'; // Import NavButton

function Master() {
  return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Master Page
        </Typography>
        <Typography variant="body1">
          Here, we will add the dynamic ECTS table.
        </Typography>

        {/* Button to navigate back to the Main page */}
        <NavButton navigate_to="/" label="Back to Main" />
      </Container>
  );
}

export default Master;
