// src/hooks/useCourses.ts
import { useState, useEffect, SetStateAction } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

// Define a type for each field in selectedFields
interface SelectedField {
  selectedCourse: string;
  selectedEcts: number;
}

export const useCourses = (
    selectedFields: SelectedField[],  // Explicit type for selectedFields
    setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>  // Type for setSelectedFields
) => {
  const [courses, setCourses] = useState<any[]>([]);  // State for courses
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        const coursesRef = collection(db, `users/${user.uid}/courses`);
        const querySnapshot = await getDocs(coursesRef);
        const fetchedCourses: SetStateAction<any[]> = [];

        querySnapshot.forEach((doc) => {
          const course = doc.data();
          fetchedCourses.push(course);
        });

        setCourses(fetchedCourses);  // Update courses state
      }
    };

    fetchCourses();
  }, [user]);

  // Function to handle course changes
  const handleCourseChange = async (index: number, course: string) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedCourse: course };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    if (user) {
      const courseDoc = doc(db, `users/${user.uid}/courses`, `course${index}`);
      await setDoc(courseDoc, {
        selectedEcts: updatedFields[index].selectedEcts || 0,  // Default ECTS to 0 if not selected
        selectedCourse: course,
      });
    }
  };

  // Function to handle ECTS changes
  const handleEctsChange = async (index: number, ects: number) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedEcts: ects };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    if (user && updatedFields[index].selectedCourse) {  // Ensure course is selected before saving
      const courseDoc = doc(db, `users/${user.uid}/courses`, `course${index}`);
      await setDoc(courseDoc, {
        selectedEcts: ects,
        selectedCourse: updatedFields[index].selectedCourse,
      });
    } else {
      console.error('Course or user is not properly selected.');
    }
  };

  return { courses, handleCourseChange, handleEctsChange };  // Return courses and handlers
};
