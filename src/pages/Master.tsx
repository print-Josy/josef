import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseGrid from '../components/CourseGrid';
import CourseDialog from '../components/CourseDialog';
import ProgressBar from '../components/ProgressBar';

function Master() {
  const [user, setUser] = useState<User | null>(null);
  const [totalEcts, setTotalEcts] = useState(0);  // Total ECTS for Major and Minor
  const [open, setOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).then(() => console.log('User signed out'));
  };

  const updateEcts = (ects: number) => {
    setTotalEcts(ects);
  };

  return (
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>ECTS Tracker</Typography>
          <IconButton onClick={handleSignOut} color="inherit">
            <AccountCircleIcon fontSize="large" />
            {user ? <Typography>{user.email}</Typography> : <Typography>Guest</Typography>}
          </IconButton>
        </Box>

        {/* Progress Bar */}
        <ProgressBar currentEcts={totalEcts} totalEcts={120} />

        {/* Major Section */}
        <Box bgcolor="purple" color="white" padding="16px" mt={2}>
          <Typography variant="h6">Major Courses (60 ECTS)</Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <CourseGrid updateEcts={updateEcts} type="major" rows={8} cols={2} />
        </Grid>

        {/* Minor Section */}
        <Box bgcolor="pink" color="black" padding="16px" mt={4}>
          <Typography variant="h6">Minor Courses (24 ECTS)</Typography>
        </Box>

        <Grid container spacing={2} mt={2}>
          <CourseGrid updateEcts={updateEcts} type="minor" rows={8} cols={2} />
        </Grid>

        <Typography variant="h6" mt={2}>Total ECTS: {totalEcts}</Typography>

        <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} style={{ marginTop: '20px' }}>
          Add New Course
        </Button>

        <CourseDialog open={open} onClose={() => setOpen(false)} />

        <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => window.location.href = '/'}>
          Back to Menu
        </Button>
      </Container>
  );
}

export default Master;
