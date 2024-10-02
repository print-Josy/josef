import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

export interface SelectedField {
  selectedCourse: string;
  selectedEcts: number;
}


export const useCourses = (type: 'major' | 'minor') => {
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([...Array(16)].map(() => ({ selectedCourse: '', selectedEcts: 0 })));
  const [totalEcts, setTotalEcts] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);

      let totalEcts = 0;
      const updatedFields = [...selectedFields];

      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        const courseType = doc.id.startsWith('course_minor') ? 'minor' : 'major';

        // Only update fields if they match the current type (major/minor)
        if (courseType === type) {
          const index = parseInt(doc.id.replace(`course_${type}`, ''), 10);
          updatedFields[index] = {
            selectedCourse: courseData.selectedCourse || '',
            selectedEcts: courseData.selectedEcts || 0,
          };
          totalEcts += courseData.selectedEcts || 0;  // Ensure it defaults to 0
        }
      });

      setSelectedFields(updatedFields);
      setTotalEcts(totalEcts);
    };

    fetchCourses();
  }, [user, type]);

  const handleCourseChange = async (index: number, course: string) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedCourse: course };
    setSelectedFields(updatedFields);

    if (user) {
      const courseDocId = `${type === 'minor' ? 'course_minor' : 'course_major'}${index}`;
      const courseDoc = doc(db, `users/${user.uid}/courses`, courseDocId);
      await setDoc(courseDoc, {
        selectedCourse: course,
        selectedEcts: updatedFields[index].selectedEcts,
      });
    }
  };

  const handleEctsChange = async (index: number, ects: number) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedEcts: ects };
    setSelectedFields(updatedFields);

    if (user) {
      const courseDocId = `${type === 'minor' ? 'course_minor' : 'course_major'}${index}`;
      const courseDoc = doc(db, `users/${user.uid}/courses`, courseDocId);
      await setDoc(courseDoc, {
        selectedCourse: updatedFields[index].selectedCourse,
        selectedEcts: ects,
      });
    }

    const newTotalEcts = updatedFields.reduce((sum, field) => sum + field.selectedEcts, 0);
    setTotalEcts(newTotalEcts);
  };

  return { selectedFields, setSelectedFields, totalEcts, handleCourseChange, handleEctsChange };
};
