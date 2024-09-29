import { SaveCourses } from '../hooks/useCourses';
import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, IconButton, Button, Checkbox } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseGrid from '../components/CourseGrid';
import CourseDialog from '../components/CourseDialog';
import ProgressBar from '../components/ProgressBar';
import ScrollableContainer from '../components/ScrollableContainer';
import NavButton from "../components/NavButton.tsx";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
  const [unsavedChanges, setUnsavedChanges] = useState(false); // Track unsaved changes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        // Load courses and checkboxes state when component is mounted
        const checkboxesRef = doc(db, `users/${currentUser.uid}/courses`, 'course_checkboxes');
        const checkboxDoc = await getDoc(checkboxesRef);
        if (checkboxDoc.exists()) {
          const data = checkboxDoc.data();
          setIsMasterThesisChecked(data.isMasterThesisChecked || false);
          setIsOptionalCoursesChecked(data.isOptionalCoursesChecked || false);
        }

        // Load courses and calculate ECTS
        const totalMajorEcts = majorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
        const totalMinorEcts = minorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
        let totalEcts = totalMajorEcts + totalMinorEcts;

        if (isMasterThesisChecked) {
          totalEcts += 30; // Add 30 ECTS for Master Thesis
        }
        if (isOptionalCoursesChecked) {
          totalEcts += 6; // Add 6 ECTS for Optional Courses
        }

        updateEcts(totalEcts); // Trigger the progress bar to update
      }
    });

    return () => unsubscribe();
  }, [auth, majorFields, minorFields, isMasterThesisChecked, isOptionalCoursesChecked]);


  // Monitor unsaved changes (optional, could still be used for major/minor fields)
  useEffect(() => {
    setUnsavedChanges(true);
  }, [majorFields, minorFields, isMasterThesisChecked, isOptionalCoursesChecked]);

  // Auto-save handler before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        saveCoursesHandler(); // Save data before page unloads
        event.preventDefault();
        event.returnValue = ''; // Necessary for modern browsers
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const handleSignOut = () => {
    signOut(auth).then(() => window.location.href = '/');
  };

  const updateEcts = (ects: number) => {
    setTotalEcts(ects);
  };

  // Save handler for both major and minor courses (unchanged)
  const saveCoursesHandler = () => {
    const saveCourses = new SaveCourses(user, majorFields, minorFields);

    saveCourses.save().then(() => {
      const totalMajorEcts = majorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
      const totalMinorEcts = minorFields.reduce((sum, field) => sum + field.selectedEcts, 0);
      let totalEcts = totalMajorEcts + totalMinorEcts;
      if (isMasterThesisChecked) {
        totalEcts += 30; // Add 30 ECTS for Master Thesis
      }
      if (isOptionalCoursesChecked) {
        totalEcts += 6; // Add 6 ECTS for Optional Courses
      }

      updateEcts(totalEcts); // Trigger the progress bar to update
      setUnsavedChanges(false); // Reset unsaved changes
    });
  };

  // Save only the checkboxes when they change
  const saveCheckboxes = async (newMasterThesisState: boolean, newOptionalCoursesState: boolean) => {
    if (user) {
      const checkboxesRef = doc(db, `users/${user.uid}/courses`, 'course_checkboxes');
      await setDoc(checkboxesRef, {
        isMasterThesisChecked: newMasterThesisState,
        isOptionalCoursesChecked: newOptionalCoursesState,
      });
      console.log("Checkbox states saved");
    }
  };

// Handle Master Thesis checkbox changes
  const handleMasterThesisChange = () => {
    const newMasterThesisState = !isMasterThesisChecked;
    setIsMasterThesisChecked(newMasterThesisState);
    saveCheckboxes(newMasterThesisState, isOptionalCoursesChecked); // Only save when it changes
  };

// Handle Optional Courses checkbox changes
  const handleOptionalCoursesChange = () => {
    const newOptionalCoursesState = !isOptionalCoursesChecked;
    setIsOptionalCoursesChecked(newOptionalCoursesState);
    saveCheckboxes(isMasterThesisChecked, newOptionalCoursesState); // Only save when it changes
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
                height={40}
                textAlign="center"
                fontSize={20}
                backgroundColor="#e0e0e0"
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
                textAlign="left"
                fontSize={16}
                backgroundColor="#E5C3FC"
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
                  selectedFields={majorFields}
                  setSelectedFields={setMajorFields}
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
                textAlign="left"
                fontSize={16}
                backgroundColor="#f0f0f0"
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
                  selectedFields={minorFields}
                  setSelectedFields={setMinorFields}
              />
            </Grid>
          </ScrollableContainer>

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center">
              <Checkbox
                  checked={isMasterThesisChecked}
                  onChange={handleMasterThesisChange}
              />
              <Typography>Master Thesis (30 ECTS)</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Checkbox
                  checked={isOptionalCoursesChecked}
                  onChange={handleOptionalCoursesChange}
              />
              <Typography>Optional Courses (6 ECTS)</Typography>
            </Box>

            {/* Update Data Button */}
            <Button
                variant="contained"
                color={unsavedChanges ? "warning" : "primary"} // Change color based on unsaved changes
                onClick={saveCoursesHandler}
            >
              {unsavedChanges ? "Save Changes" : "Update Data"}
            </Button>
          </Box>

          <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} style={{}}>
            Add New Course
          </Button>

          <CourseDialog open={open} onClose={() => setOpen(false)} />

          <NavButton navigate_to="/master" label="Back to Home" />
        </Container>
      </Box>
  );
}

export default Master;
