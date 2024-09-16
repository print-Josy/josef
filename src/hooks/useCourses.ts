// src/hooks/useCourses.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

// Define a type for each field in selectedFields
interface SelectedField {
  selectedCourse: string;
  selectedEcts: number;
}

// Define the Course interface that represents a course document
interface Course {
  selectedCourse: string;
  selectedEcts: number;
}

export const useCourses = (
    selectedFields: SelectedField[],
    setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>,
    updateEcts: (totalEcts: number) => void // Pass the updateEcts function to accumulate ECTS
) => {
  const [courses, setCourses] = useState<Course[]>([]);  // State for courses
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        const coursesRef = collection(db, `users/${user.uid}/courses`);
        const querySnapshot = await getDocs(coursesRef);
        const fetchedCourses: Course[] = [];  // Use the Course interface

        let totalEcts = 0;

        querySnapshot.forEach((doc) => {
          const course = doc.data() as Course;  // Cast doc.data() to Course
          fetchedCourses.push(course);
          totalEcts += course.selectedEcts;  // Accumulate ECTS for each course
        });

        setCourses(fetchedCourses);  // Update courses state
        updateEcts(totalEcts);  // Update the total ECTS in the parent component (Master)
      }
    };

    fetchCourses();
  }, [user, updateEcts]);

  // Function to handle course changes
  const handleCourseChange = async (index: number, course: string) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedCourse: course };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    if (user && updatedFields[index].selectedEcts) {
      const courseDoc = doc(db, `users/${user.uid}/courses`, `course${index}`);
      await setDoc(courseDoc, {
        selectedEcts: updatedFields[index].selectedEcts || 0,  // Default ECTS to 0 if not selected
        selectedCourse: course,
      });

      // Re-fetch all courses to update the total ECTS
      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);
      let totalEcts = 0;
      querySnapshot.forEach((doc) => {
        totalEcts += doc.data().selectedEcts;
      });
      updateEcts(totalEcts);  // Update total ECTS in Master
    }
  };

  // Function to handle ECTS changes
  const handleEctsChange = async (index: number, ects: number) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedEcts: ects };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    if (user && updatedFields[index].selectedCourse) {
      const courseDoc = doc(db, `users/${user.uid}/courses`, `course${index}`);
      await setDoc(courseDoc, {
        selectedEcts: ects,
        selectedCourse: updatedFields[index].selectedCourse,
      });

      // Re-fetch all courses to update the total ECTS
      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);
      let totalEcts = 0;
      querySnapshot.forEach((doc) => {
        totalEcts += doc.data().selectedEcts;
      });
      updateEcts(totalEcts);  // Update total ECTS in Master
    } else {
      console.error('Course or user is not properly selected.');
    }
  };

  return { courses, handleCourseChange, handleEctsChange };
};
