import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

// Define a type for each field in selectedFields
export interface SelectedField {
  selectedCourse: string;
  selectedEcts: number;
}

// Define the Course interface that represents a course document
interface Course {
  id: string;  // Firestore document ID
  name: string;  // Course name
  ects: number;  // Course ECTS points
  type?: 'major' | 'minor';  // Optional course type (major/minor)
}

export const useCourses = (
    selectedFields: SelectedField[],
    setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>,
    updateEcts: (totalEcts: number) => void,
    type: 'major' | 'minor'
) => {
  const [courses, setCourses] = useState<Course[]>([]);  // Stores user courses (major/minor)
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch courses (user data)
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);

      const fetchedCourses: Course[] = [];
      let totalEcts = 0;
      const updatedFields = [...selectedFields];

      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        const courseType = doc.id.startsWith('course_minor') ? 'minor' : 'major';

        fetchedCourses.push({
          id: doc.id,
          name: courseData.selectedCourse,
          ects: courseData.selectedEcts,
          type: courseType,
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
    };

    fetchCourses();
  }, [user, type]);


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
    }
  };

  return { courses, handleCourseChange, handleEctsChange };
};

