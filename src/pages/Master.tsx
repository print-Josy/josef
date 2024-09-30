import { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseDialog from '../components/CourseDialog';
import NavButton from "../components/NavButton.tsx";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ProgressBarSection from '../components/ProgressBarSection';
import CourseSection from '../components/CourseSection';
import CheckboxSection from '../components/CheckboxSection';

function Master() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalEcts, setTotalEcts] = useState(0);
  const [majorFields, setMajorFields] = useState([...Array(16)].map(() => ({ selectedCourse: '', selectedEcts: 0 })));
  const [minorFields, setMinorFields] = useState([...Array(16)].map(() => ({ selectedCourse: '', selectedEcts: 0 })));
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const [isMasterThesisChecked, setIsMasterThesisChecked] = useState(false);
  const [isOptionalCoursesChecked, setIsOptionalCoursesChecked] = useState(false);
  const [isVertical, setIsVertical] = useState(window.innerHeight > window.innerWidth);

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
          setIsAdmin(userData?.admin === true);
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
          totalEcts += 30;
        }
        if (isOptionalCoursesChecked) {
          totalEcts += 6;
        }

        updateEcts(totalEcts);
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

          <ProgressBarSection
              currentEcts={totalEcts}
              totalEcts={120}
              color="#7B80F7"
              backgroundColor="#c1bcf4"
              height={35}  // Custom height
              mt={0}       // Custom margin-top
              mb={2}       // Custom margin-bottom
              fontSize={18} // Custom font size
              textAlign="center"  // Centered text
          />
          <ProgressBarSection currentEcts={totalMajorEcts} totalEcts={60} headerText="Major Courses" color="#CC87F8" backgroundColor="#E5C3FC"
              height={30}  // Custom height
              mt={0}       // Custom margin-top
              mb={0.5}       // Custom margin-bottom
              fontSize={16} // Custom font size
        />
          <CourseSection
              updateEcts={updateEcts}
              type="major"
              rows={isVertical ? 16 : 8}
              cols={isVertical ? 1 : 2}
              selectedFields={majorFields}
              setSelectedFields={setMajorFields}
              maxHeight="300px"
          />

          <ProgressBarSection currentEcts={totalMinorEcts} totalEcts={24} headerText="Minor Courses" color="#F7C5FC" backgroundColor="#ffe7ff"
              height={30}  // Custom height
              mt={2}       // Custom margin-top
              mb={0.5}       // Custom margin-bottom
              fontSize={16} // Custom font size
          />
          <CourseSection
              updateEcts={updateEcts}
              type="minor"
              rows={isVertical ? 16 : 6}
              cols={isVertical ? 1 : 2}
              selectedFields={minorFields}
              setSelectedFields={setMinorFields}
              maxHeight="260px"

          />

          <CheckboxSection checked={isMasterThesisChecked} onChange={handleMasterThesisChange} label="Master Thesis (30 ECTS)" />
          <CheckboxSection checked={isOptionalCoursesChecked} onChange={handleOptionalCoursesChange} label="Optional Courses (6 ECTS)" />

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
