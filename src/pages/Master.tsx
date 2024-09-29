import { SaveCourses } from '../hooks/useCourses';
import { useState, useEffect } from 'react';
import {Container, Typography, Grid, Box, IconButton, Button, Checkbox} from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseGrid from '../components/CourseGrid';
import CourseDialog from '../components/CourseDialog';
import ProgressBar from '../components/ProgressBar';
import ScrollableContainer from '../components/ScrollableContainer';
import NavButton from "../components/NavButton.tsx";

function Master() {
  const [user, setUser] = useState<User | null>(null);
  const [totalEcts, setTotalEcts] = useState(0);
  const [majorFields, setMajorFields] = useState([...Array(16)].map(() => ({
    selectedCourse: '',
    selectedEcts: 0,
  }))); // Track major courses

  const [minorFields, setMinorFields] = useState([...Array(16)].map(() => ({
    selectedCourse: '',
    selectedEcts: 0,
  }))); // Track minor courses

  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const [isMasterThesisChecked, setIsMasterThesisChecked] = useState(false);
  const [isOptionalCoursesChecked, setIsOptionalCoursesChecked] = useState(false);


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

  // Single save handler for both major and minor courses
  const saveCoursesHandler = () => {
    const saveCourses = new SaveCourses(user, majorFields, minorFields);

    saveCourses.save().then(() => {
      // After saving, recalculate the total ECTS and update the progress bar
      const totalMajorEcts = majorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
      const totalMinorEcts = minorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
      // Add ECTS from checkboxes if checked
      let totalEcts = totalMajorEcts + totalMinorEcts;
      if (isMasterThesisChecked) {
        totalEcts += 30;  // Add 30 ECTS for Master Thesis
      }
      if (isOptionalCoursesChecked) {
        totalEcts += 6;  // Add 6 ECTS for Optional Courses
      }

      updateEcts(totalEcts);  // This will trigger the progress bar to update
    });
  };

  // Calculate ECTS for major and minor separately
  const totalMajorEcts = majorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
  const totalMinorEcts = minorFields.reduce((sum, field) => sum + field.selectedEcts, 0);

  return (
      <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fpastel_easy.webp?alt=media&token=b4d42d6f-0ac8-4e26-869e-735914dff400')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            padding: '20px',
            overflow: 'auto',
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

          {/* Total ECTS Progress Bar */}
          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              maxWidth="100%"
              mx="auto"
              sx={{
                mt: 0,
                mb: 4,
                px: 0,
              }}
          >
            <ProgressBar
                currentEcts={totalEcts}
                totalEcts={120}
                color="#7B80F7"
                height={30}
                textAlign="center"  // Center text for total
                fontSize={18}
                backgroundColor="#e0e0e0" // Background for unfilled part
            />
          </Box>


          {/* Major Section */}
          {/* Major Courses Progress Bar */}
          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              maxWidth="100%"
              mx="auto"
              sx={{
                mt: 0,
                mb: 1,
                px: 0,
              }}
          >
            <ProgressBar
                currentEcts={totalMajorEcts}
                totalEcts={60}
                color="#CC87F8"
                height={35}
                headerText="Major Courses"
                textAlign="left"  // Left-align text for Major
                fontSize={16}
                backgroundColor="#E5C3FC" // Light background for unfilled part
            />
          </Box>

          {/* Scrollable Major Grid */}
          <ScrollableContainer maxHeight="300px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid
                  updateEcts={updateEcts}
                  type="major"
                  rows={8}
                  cols={2}
                  selectedFields={majorFields}  // Pass major courses
                  setSelectedFields={setMajorFields}  // Update major courses
              />
            </Grid>
          </ScrollableContainer>


          {/* Minor Section */}
          {/* Minor Courses Progress Bar */}
          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              maxWidth="100%"
              mx="auto"
              sx={{
                mt: 2,
                mb: 1,
                px: 0,
              }}
          >
            <ProgressBar
                currentEcts={totalMinorEcts}
                totalEcts={24}
                color="#F7C5FC"
                height={35}
                headerText="Minor Courses"
                textAlign="left"  // Left-align text for Minor
                fontSize={16}
                backgroundColor="#f0f0f0" // Light background for unfilled part
            />
          </Box>

          {/* Scrollable Minor Grid */}
          <ScrollableContainer maxHeight="260px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid
                  updateEcts={updateEcts}
                  type="minor"
                  rows={6}
                  cols={2}
                  selectedFields={minorFields}  // Pass minor courses
                  setSelectedFields={setMinorFields}  // Update minor courses
              />
            </Grid>
          </ScrollableContainer>


          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center">
              <Checkbox
                  checked={isMasterThesisChecked}
                  onChange={() => setIsMasterThesisChecked(!isMasterThesisChecked)}
              />
              <Typography>Master Thesis (30 ECTS)</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Checkbox
                  checked={isOptionalCoursesChecked}
                  onChange={() => setIsOptionalCoursesChecked(!isOptionalCoursesChecked)}
              />
              <Typography>Optional Courses (6 ECTS)</Typography>
            </Box>

            {/* Update Data Button */}
            <Button variant="contained" color="primary" onClick={saveCoursesHandler}>
              Update Data
            </Button>
          </Box>

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
