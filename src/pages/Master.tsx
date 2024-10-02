import { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import {  getDoc, doc, setDoc } from 'firebase/firestore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseDialog from '../components/CourseDialog';
import NavButton from "../components/NavButton.tsx";
import ProgressBarSection from '../components/ProgressBarSection';
import CourseSection from '../components/CourseSection';
import CheckboxSection from '../components/CheckboxSection';
import { useCourses } from '../hooks/useCourses';
import { db } from "../firebaseConfig.ts";

function Master() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMasterThesisChecked, setIsMasterThesisChecked] = useState(false);
  const [isOptionalCoursesChecked, setIsOptionalCoursesChecked] = useState(false);
  const [isVertical, setIsVertical] = useState(window.innerHeight > window.innerWidth);
  const [open, setOpen] = useState(false);
  const auth = getAuth();

  // Fetch major and minor courses and ECTS
  const {
    selectedFields: majorFields,
    totalEcts: totalMajorEcts,
    setSelectedFields: setMajorFields,
    handleCourseChange: handleMajorCourseChange,
    handleEctsChange: handleMajorEctsChange,
  } = useCourses('major');

  const {
    selectedFields: minorFields,
    totalEcts: totalMinorEcts,
    setSelectedFields: setMinorFields,
    handleCourseChange: handleMinorCourseChange,
    handleEctsChange: handleMinorEctsChange,
  } = useCourses('minor');

  useEffect(() => {
    const handleResize = () => setIsVertical(window.innerHeight > window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        const checkboxesRef = doc(db, `users/${currentUser.uid}/courses`, 'course_checkboxes');
        const checkboxDoc = await getDoc(checkboxesRef);
        if (checkboxDoc.exists()) {
          const data = checkboxDoc.data();
          setIsMasterThesisChecked(data.isMasterThesisChecked || false);
          setIsOptionalCoursesChecked(data.isOptionalCoursesChecked || false);
        }

        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData?.admin === true);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).then(() => window.location.href = '/');
  };

  const saveCheckboxState = async (label: string, newState: boolean) => {
    if (user) {
      const checkboxesRef = doc(db, `users/${user.uid}/courses`, 'course_checkboxes');
      await setDoc(checkboxesRef, {
        [label]: newState,
      }, { merge: true });
    }
  };

  const updateTotalEcts = () => {
    let totalEcts = totalMajorEcts + totalMinorEcts;
    if (isMasterThesisChecked) totalEcts += 30;
    if (isOptionalCoursesChecked) totalEcts += 6;
    return totalEcts;
  };

  return (
      <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fevening.jpg?alt=media&token=d75fc434-3cd9-4efd-b4f8-13386b2565ed')`,
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
              currentEcts={updateTotalEcts()}
              totalEcts={120}
              color="#7B80F7"
              backgroundColor="#c1bcf4"
              height={35}
              mt={0}
              mb={0}
              fontSize={18}
              textAlign="center"
          />

          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <CheckboxSection
                label="Master Thesis (30 ECTS)"
                isChecked={isMasterThesisChecked}
                onCheckboxChange={() => {
                  const newState = !isMasterThesisChecked;
                  setIsMasterThesisChecked(newState);
                  saveCheckboxState('isMasterThesisChecked', newState);
                }}
            />
            <CheckboxSection
                label="Optional Courses (6 ECTS)"
                isChecked={isOptionalCoursesChecked}
                onCheckboxChange={() => {
                  const newState = !isOptionalCoursesChecked;
                  setIsOptionalCoursesChecked(newState);
                  saveCheckboxState('isOptionalCoursesChecked', newState);
                }}
            />
          </Box>

          <ProgressBarSection currentEcts={totalMajorEcts} totalEcts={60} headerText="Major Courses" color="#CC87F8" backgroundColor="#E5C3FC" height={30} mt={0} mb={0.5} fontSize={16} />
          <CourseSection
              cols={isVertical ? 1 : 2}
              selectedFields={majorFields}
              setSelectedFields={setMajorFields}
              handleCourseChange={handleMajorCourseChange}
              handleEctsChange={handleMajorEctsChange}
              maxHeight="300px"
          />

          <ProgressBarSection currentEcts={totalMinorEcts} totalEcts={24} headerText="Minor Courses" color="#F7C5FC" backgroundColor="#ffe7ff" height={30} mt={2} mb={0.5} fontSize={16} />
          <CourseSection
              cols={isVertical ? 1 : 2}
              selectedFields={minorFields}
              setSelectedFields={setMinorFields}
              handleCourseChange={handleMinorCourseChange}
              handleEctsChange={handleMinorEctsChange}
              maxHeight="260px"
          />


          {isAdmin && (
              <Button variant="outlined" color="secondary" onClick={() => setOpen(true)} sx={{ mt: 1 }}>
                Add New Course
              </Button>
          )}
          <CourseDialog open={open} onClose={() => setOpen(false)} />
          <Box display="flex" justifyContent="right" sx={{ mb: 2 }}>
            <NavButton navigate_to="/" label="Back to Home"  />
          </Box>
        </Container>
      </Box>
  );
}

export default Master;
