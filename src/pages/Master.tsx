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
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
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

  // New state to track if the screen is vertical (portrait mode)
  const [isVertical, setIsVertical] = useState(window.innerHeight > window.innerWidth);

  // Detect screen orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData?.admin === true); // Set admin status
        }
        const checkboxesRef = doc(db, `users/${currentUser.uid}/courses`, 'course_checkboxes');
        const checkboxDoc = await getDoc(checkboxesRef);
        if (checkboxDoc.exists()) {
          const data = checkboxDoc.data();
          setIsMasterThesisChecked(data.isMasterThesisChecked || false);
          setIsOptionalCoursesChecked(data.isOptionalCoursesChecked || false);
        }

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

  const handleSignOut = () => {
    signOut(auth).then(() => window.location.href = '/');
  };

  const updateEcts = (ects: number) => {
    setTotalEcts(ects);
  };

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

  const handleMasterThesisChange = () => {
    const newMasterThesisState = !isMasterThesisChecked;
    setIsMasterThesisChecked(newMasterThesisState);
    saveCheckboxes(newMasterThesisState, isOptionalCoursesChecked);
  };

  const handleOptionalCoursesChange = () => {
    const newOptionalCoursesState = !isOptionalCoursesChecked;
    setIsOptionalCoursesChecked(newOptionalCoursesState);
    saveCheckboxes(isMasterThesisChecked, newOptionalCoursesState);
  };

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

          <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              maxWidth="100%"
              mx="auto"
              sx={{ mt: 0, mb: 3, px: 0 }}
          >
            <ProgressBar currentEcts={totalEcts} totalEcts={120} color="#7B80F7" height={35} textAlign="center" fontSize={18} backgroundColor="#c1bcf4" />
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center" width="100%" maxWidth="100%" mx="auto" sx={{ mt: 0, mb: 0.5, px: 0 }}>
            <ProgressBar currentEcts={totalMajorEcts} totalEcts={60} color="#CC87F8" height={35} headerText="Major Courses" textAlign="left" fontSize={16} backgroundColor="#E5C3FC" />
          </Box>

          <ScrollableContainer maxHeight="300px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid
                  updateEcts={updateEcts}
                  type="major"
                  rows={isVertical ? 16 : 8}  // 16 rows if in portrait, 8 rows if landscape
                  cols={isVertical ? 1 : 2}    // 1 column if in portrait, 2 columns if landscape
                  selectedFields={majorFields}
                  setSelectedFields={setMajorFields}
              />
            </Grid>
          </ScrollableContainer>

          <Box display="flex" justifyContent="center" alignItems="center" width="100%" maxWidth="100%" mx="auto" sx={{ mt: 2, mb: 0.5, px: 0 }}>
            <ProgressBar currentEcts={totalMinorEcts} totalEcts={24} color="#F7C5FC" height={35} headerText="Minor Courses" textAlign="left" fontSize={16} backgroundColor="#ffe7ff" />
          </Box>

          <ScrollableContainer maxHeight="260px">
            <Grid container spacing={2} mt={0}>
              <CourseGrid
                  updateEcts={updateEcts}
                  type="minor"
                  rows={isVertical ? 16 : 6}  // 16 rows if in portrait, 6 rows if landscape
                  cols={isVertical ? 1 : 2}    // 1 column if in portrait, 2 columns if landscape
                  selectedFields={minorFields}
                  setSelectedFields={setMinorFields}
              />
            </Grid>
          </ScrollableContainer>

          <Box display="flex" alignItems="center">
            <Checkbox checked={isMasterThesisChecked} onChange={handleMasterThesisChange} />
            <Typography>Master Thesis (30 ECTS)</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Checkbox checked={isOptionalCoursesChecked} onChange={handleOptionalCoursesChange} />
            <Typography>Optional Courses (6 ECTS)</Typography>
          </Box>

          {isAdmin && (
              <Button variant="outlined" color="secondary" onClick={() => setOpen(true)}>
                Add New Course
              </Button>
          )}

          <CourseDialog open={open} onClose={() => setOpen(false)} />
          <NavButton navigate_to="/" label="Back to Home" />
        </Container>
      </Box>
  );
}

export default Master;
