import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseGrid from '../components/CourseGrid';
import CourseDialog from '../components/CourseDialog';
import ProgressBar from '../components/ProgressBar';
import ScrollableContainer from '../components/ScrollableContainer';
import NavButton from "../components/NavButton.tsx";  // Import ScrollableContainer

function Master() {
  const [user, setUser] = useState<User | null>(null);
  const [totalEcts, setTotalEcts] = useState(0);
  const [open, setOpen] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).then(() => window.location.href = '/');
  };

  const updateEcts = (ects: number) => {
    setTotalEcts(ects);
  };

  return (
      <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fpastel_easy.webp?alt=media&token=b4d42d6f-0ac8-4e26-869e-735914dff400')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh', // Ensure it covers the full screen height
            padding: '20px',    // Add padding around the content
            overflow: 'auto',   // Allow scrolling when content overflows
          }}
      >
        <Container>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" gutterBottom></Typography>
            <IconButton onClick={handleSignOut} color="inherit">
              <AccountCircleIcon fontSize="large" />
              {user ? <Typography>{user.email}</Typography> : <Typography>Guest</Typography>}
            </IconButton>
          </Box>

          {/* Progress Bar */}
          <ProgressBar currentEcts={totalEcts} totalEcts={120} />

          {/* Major Section */}
          <Box bgcolor="purple" color="white" padding="16px" mb={1}>
            <Typography variant="h6">Major Courses (60 ECTS)</Typography>
          </Box>

          {/* Scrollable Major Grid */}
          <ScrollableContainer maxHeight="300px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid updateEcts={updateEcts} type="major" rows={8} cols={2} />
            </Grid>
          </ScrollableContainer>

          {/* Minor Section */}
          <Box bgcolor="pink" color="black" padding="16px" mt={3} mb={1}>
            <Typography variant="h6">Minor Courses (24 ECTS)</Typography>
          </Box>

          {/* Scrollable Minor Grid */}
          <ScrollableContainer maxHeight="300px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid updateEcts={updateEcts} type="minor" rows={8} cols={2} />
            </Grid>
          </ScrollableContainer>

          <Typography variant="h6" mt={2}>Total ECTS: {totalEcts}</Typography>

          <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} style={{ }}>
            Add New Course
          </Button>

          <CourseDialog open={open} onClose={() => setOpen(false)} />

          <NavButton navigate_to="/master" label="Back to Home" />
        </Container>
      </Box>
  );
}

export default Master;
