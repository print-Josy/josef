// src/pages/Master.tsx
import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';  // Import proper User type
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseGrid from '../components/CourseGrid';
import CourseDialog from '../components/CourseDialog';
import ProgressBar from '../components/ProgressBar';
import ScrollableContainer from '../components/ScrollableContainer';

function Master() {
  const [user, setUser] = useState<User | null>(null);  // Replace 'any' with Firebase User or null
  const [totalEcts, setTotalEcts] = useState(0);  // State to track total ECTS
  const [open, setOpen] = useState(false);  // State to manage CourseDialog visibility
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

  const updateEcts = (ects: number) => {
    setTotalEcts(ects);  // Update the total ECTS state
  };

  return (
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>ECTS Tracker</Typography>

          {/* Account Icon */}
          <IconButton onClick={handleSignOut} color="inherit">
            <AccountCircleIcon fontSize="large" />
            {user ? <Typography>{user.email}</Typography> : <Typography>Guest</Typography>}
          </IconButton>
        </Box>

        {/* ECTS Master and Progress Bar Section */}
        <ProgressBar currentEcts={totalEcts} totalEcts={120} />

        <Grid container spacing={2} mt={2}>
          {/* Major and Minor sections */}
          <Grid item xs={6}>
            <Box bgcolor="purple" color="white" padding="16px" display="flex" justifyContent="space-between">
              <Typography variant="h6">Major</Typography>
              <Typography variant="h6">60 ECTS</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box bgcolor="pink" color="black" padding="16px" display="flex" justifyContent="space-between">
              <Typography variant="h6">Minor</Typography>
              <Typography variant="h6">24 ECTS</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Scrollable Course Grid */}
        <ScrollableContainer maxHeight="50vh">  {/* Apply scroll to course grid */}
          <CourseGrid updateEcts={updateEcts} />  {/* Ensure CourseGrid receives updateEcts */}
        </ScrollableContainer>

        <Typography variant="h6" mt={2}>Total ECTS: {totalEcts}</Typography>

        <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} style={{ marginTop: '20px' }}>
          Add New Course
        </Button>

        {/* Course input popup */}
        <CourseDialog open={open} onClose={() => setOpen(false)} />

        {/* Back to Menu Button */}
        <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => window.location.href = '/'}>
          Back to Menu
        </Button>
      </Container>
  );
}

export default Master;
