// src/pages/Master.tsx
import { Container, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import NavButton from '../components/NavButton';  // Import the NavButton
import CourseInput from '../components/CourseInput';  // Import the reusable component

function Master() {
  const handleSubmit = async (courseName: string, ectsPoints: number) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        // Save the field data under the user's Firestore document
        const userCoursesRef = collection(db, 'users', user.uid, 'courses');
        await setDoc(doc(userCoursesRef), {
          courseName,
          ectsPoints,
          createdAt: new Date(),
        });

        console.log("Course added successfully!");
      } catch (error) {
        console.error("Error adding document:", error);
      }
    }
  };

  return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Add Course
        </Typography>

        {/* Use the reusable input component */}
        <CourseInput onSubmit={handleSubmit} />

        {/* Button to navigate back to the Main page */}
        <NavButton navigate_to="/" label="Back to Main" />
      </Container>
  );
}

export default Master;
