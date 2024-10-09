import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

export interface SelectedField {
  selectedCourse: string;
  selectedEcts: number;
  achieved: boolean;
}

export interface EctsStatusChange {
  ects: number;
  achieved: boolean;
}

export const useCourses = (type: 'major' | 'minor') => {
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([...Array(16)].map(() => ({ selectedCourse: '', selectedEcts: 0, achieved: false})));
  const [totalEcts, setTotalEcts] = useState(0);
  const [totalAchievedEcts, setTotalAchievedEcts] = useState(0);  // Track achieved ECTS
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      const coursesRef = collection(db, `users/${user.uid}/courses`);
      const querySnapshot = await getDocs(coursesRef);

      let totalEcts = 0;
      let totalAchievedEcts = 0;  // Initialize achieved ECTS sum
      const updatedFields = [...selectedFields];

      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        const courseType = doc.id.startsWith('course_minor') ? 'minor' : 'major';

        // Only update fields if they match the current type (major/minor)
        if (courseType === type) {
          const index = parseInt(doc.id.replace(`course_${type}`, ''), 10);
          const ects = courseData.selectedEcts || 0;
          const achieved = courseData.achieved || false;

          updatedFields[index] = {
            achieved,
            selectedCourse: courseData.selectedCourse || '',
            selectedEcts: ects,
          };

          totalEcts += ects;
          if (achieved) totalAchievedEcts += ects;  // Add to achieved ECTS if the course is marked as achieved
        }
      });

      setSelectedFields(updatedFields);
      setTotalEcts(totalEcts);
      setTotalAchievedEcts(totalAchievedEcts);  // Set achieved ECTS
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
        achieved: updatedFields[index].achieved || false,
      });
    }
  };

  const handleEctsChange = async (index: number, { ects, achieved }: EctsStatusChange) => {
    const updatedFields = [...selectedFields];
    updatedFields[index] = { ...updatedFields[index], selectedEcts: ects, achieved };  // Update both ECTS and achieved

    setSelectedFields(updatedFields);

    if (user) {
      const courseDocId = `${type === 'minor' ? 'course_minor' : 'course_major'}${index}`;
      const courseDoc = doc(db, `users/${user.uid}/courses`, courseDocId);
      await setDoc(courseDoc, {
        selectedCourse: updatedFields[index].selectedCourse,
        selectedEcts: ects,
        achieved: achieved, // Add the achieved status
      });
    }

    // Update total ECTS and total achieved ECTS
    const newTotalEcts = updatedFields.reduce((sum, field) => sum + field.selectedEcts, 0);
    const newTotalAchievedEcts = updatedFields.reduce((sum, field) => field.achieved ? sum + field.selectedEcts : sum, 0);

    setTotalEcts(newTotalEcts);
    setTotalAchievedEcts(newTotalAchievedEcts);  // Update achieved ECTS
  };

  return {
    selectedFields,
    setSelectedFields,
    totalEcts,
    totalAchievedEcts,  // Return achieved ECTS as well
    handleCourseChange,
    handleEctsChange
  };
};
