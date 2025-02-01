import { useState, useEffect } from 'react';
import { Container, Typography, Box, IconButton, Button } from '@mui/material';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CourseDialog from '../components/CourseDialog';
import NavButton from "../components/NavButton.tsx";
import PDFPopup from '../components/PDFPopup'; // Import the PDFPopup component

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
    totalAchievedEcts: totalAchievedMajorEcts,
    setSelectedFields: setMajorFields,
    handleCourseChange: handleMajorCourseChange,
    handleEctsChange: handleMajorEctsChange,
  } = useCourses('major');

  const {
    selectedFields: minorFields,
    totalEcts: totalMinorEcts,
    totalAchievedEcts: totalAchievedMinorEcts,
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

  const updateTotalAchievedEcts = () => {
    let totalAchievedEcts = totalAchievedMajorEcts + totalAchievedMinorEcts;
    if (isMasterThesisChecked) totalAchievedEcts += 30;
    if (isOptionalCoursesChecked) totalAchievedEcts += 6;
    return totalAchievedEcts;
  };

  return (
      <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/josef-website.appspot.com/o/background%2Fevening.jpg?alt=media&token=d75fc434-3cd9-4efd-b4f8-13386b2565ed')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            width: '200vh',
            padding: '20px',
            overflow: 'auto',
          }}
      >
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" gutterBottom></Typography>
            <IconButton onClick={handleSignOut} color="inherit">
              <AccountCircleIcon fontSize="large" />
              {user ? <Typography>{user.email}</Typography> : <Typography>Guest</Typography>}
            </IconButton>
          </Box>

          {/* Total Progress Bar */}
          <ProgressBarSection
              currentEcts={updateTotalEcts()}
              achievedEcts={updateTotalAchievedEcts()}
              totalEcts={120}
              useDualProgress={true}
              color='rgba(168, 42, 119, 0.6)'
              achievedColor="#a82a77"
              backgroundColor='rgba(255, 255, 255, 0.80)'
              height={35}
              mt={0}
              mb={0}
              fontSize={18}
          />

          <Box
              display="flex"
              alignItems="flex-start"
              sx={{ mb: 1 }}
              flexDirection={isVertical ? 'column' : 'row'}
          >
            <CheckboxSection
                label="MA - Thesis"
                isChecked={isMasterThesisChecked}
                onCheckboxChange={() => {
                  const newState = !isMasterThesisChecked;
                  setIsMasterThesisChecked(newState);
                  saveCheckboxState('isMasterThesisChecked', newState);
                }}
            />
            <CheckboxSection
                label="Optional Courses"
                isChecked={isOptionalCoursesChecked}
                onCheckboxChange={() => {
                  const newState = !isOptionalCoursesChecked;
                  setIsOptionalCoursesChecked(newState);
                }}
            />
          </Box>

          {/* Major Courses Progress Bar */}
          <ProgressBarSection
              currentEcts={totalMajorEcts}
              achievedEcts={totalAchievedMajorEcts}
              totalEcts={60}
              useDualProgress={true}
              achievedColor="#55A2EB"
              headerText="Major Courses"
              color= 'rgba(85, 162, 235, 0.4)'
              backgroundColor='rgba(255, 255, 255, 0.80)'
              height={30}
              mt={0}
              mb={0.5}
              fontSize={16}
          />

          <CourseSection
              cols={isVertical ? 1 : 2}
              selectedFields={majorFields}
              setSelectedFields={setMajorFields}
              handleCourseChange={handleMajorCourseChange}
              handleEctsChange={handleMajorEctsChange}
              maxHeight="300px"
          />

          {/* Minor Courses Progress Bar */}
          <ProgressBarSection
              currentEcts={totalMinorEcts}
              achievedEcts={totalAchievedMinorEcts}
              totalEcts={24}
              useDualProgress={true}
              achievedColor="#55A2EB"
              headerText="Minor Courses"
              color='rgba(85, 162, 235, 0.5)'
              backgroundColor='rgba(255, 255, 255, 0.80)'
              height={30}
              mt={2}
              mb={0.5}
              fontSize={16}
          />

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

          <Box display="flex" justifyContent="right" alignItems="center" sx={{ mt: 1 }}>
            {/* PDF Popup button (next to the Back to Home button) */}
            <PDFPopup />

            {/* Back to Home button */}
            <NavButton navigate_to="/" label="Back to Home" />
          </Box>
        </Container>
      </Box>
  );
}

export default Master;
