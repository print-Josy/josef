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
  id: string;  // Add the id to match Firestore document IDs
  name: string;  // Course name
  ects: number;  // Course ECTS points
}

export const useCourses = (
    selectedFields: SelectedField[],
    setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>,
    updateEcts: (totalEcts: number) => void,
    type: 'major' | 'minor'
) => {
  const [courses, setCourses] = useState<Course[]>([]);  // Use the proper Course interface
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        const coursesRef = collection(db, `users/${user.uid}/courses`);
        const querySnapshot = await getDocs(coursesRef);
        const fetchedCourses: Course[] = [];

        let totalEcts = 0;
        const updatedFields = [...selectedFields];

        querySnapshot.forEach((doc) => {
          const courseData = doc.data();
          fetchedCourses.push({
            id: doc.id,  // Firestore document ID
            name: courseData.selectedCourse,  // Store course name
            ects: courseData.selectedEcts,  // Store ECTS points
          });
          totalEcts += courseData.selectedEcts;

          const isMinor = doc.id.startsWith('course_minor');
          const index = parseInt(doc.id.replace('course_', '').replace(type === 'major' ? 'major' : 'minor', ''), 10);

          if ((type === 'minor' && isMinor) || (type === 'major' && !isMinor)) {
            updatedFields[index] = {
              selectedCourse: courseData.selectedCourse,
              selectedEcts: courseData.selectedEcts,
            };
          }
        });

        setCourses(fetchedCourses);
        setSelectedFields(updatedFields);
        updateEcts(totalEcts);
      }
    };

    fetchCourses();
  }, [user, updateEcts, type, selectedFields, setSelectedFields]);

  const handleCourseChange = async (index: number, course: string, type: 'major' | 'minor') => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedCourse: course };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    const courseDocId = type === 'minor' ? `course_minor${index}` : `course_major${index}`;

    if (user) {
      const courseDoc = doc(db, `users/${user.uid}/courses`, courseDocId);
      await setDoc(courseDoc, {
        selectedCourse: course,
        selectedEcts: updatedFields[index].selectedEcts || 0,
      });

      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);
      let totalEcts = 0;
      querySnapshot.forEach((doc) => {
        totalEcts += doc.data().selectedEcts;
      });
      updateEcts(totalEcts);
    }
  };

  const handleEctsChange = async (index: number, ects: number, type: 'major' | 'minor') => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedEcts: ects };
    setSelectedFields(updatedFields);

    const user = auth.currentUser;
    const courseDocId = type === 'minor' ? `course_minor${index}` : `course_major${index}`;

    if (user) {
      const courseDoc = doc(db, `users/${user.uid}/courses`, courseDocId);
      await setDoc(courseDoc, {
        selectedCourse: updatedFields[index].selectedCourse,
        selectedEcts: ects,
      });

      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);
      let totalEcts = 0;
      querySnapshot.forEach((doc) => {
        totalEcts += doc.data().selectedEcts;
      });
      updateEcts(totalEcts);
    }
  };

  return { courses, handleCourseChange, handleEctsChange };
};
