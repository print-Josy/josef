import { useState, useEffect } from 'react';
import { collection, onSnapshot, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

// Define a type for each field in selectedFields
interface SelectedField {
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
  const [lectures, setLectures] = useState<Course[]>([]);  // Stores predefined lecture data for dropdowns
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch courses (user data)
  useEffect(() => {
    if (!user) return;

    const coursesRef = collection(db, `users/${user.uid}/courses`);

    // Use onSnapshot to listen for changes in courses and reduce the number of reads
    const unsubscribe = onSnapshot(coursesRef, (querySnapshot) => {
      const fetchedCourses: Course[] = [];
      let totalEcts = 0;
      const updatedFields = [...selectedFields];

      querySnapshot.forEach((doc) => {
        const courseData = doc.data();
        const courseType = doc.id.startsWith('course_minor') ? 'minor' : 'major';  // Identify type based on ID

        fetchedCourses.push({
          id: doc.id,  // Firestore document ID
          name: courseData.selectedCourse,  // Course name
          ects: courseData.selectedEcts,  // Course ECTS points
          type: courseType,  // Major or Minor
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
      updateEcts(totalEcts);  // Update the total ECTS after loading all courses
    });

    return () => unsubscribe();  // Cleanup the listener on component unmount
  }, [user, updateEcts, setSelectedFields, selectedFields, type]);

  // Fetch predefined lectures (for dropdown options)
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesCollection = collection(db, 'lectures');
        const querySnapshot = await getDocs(lecturesCollection);
        const fetchedLectures: Course[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedLectures.push({
            id: doc.id,
            name: data.Name,  // Ensure the field names match Firestore data
            ects: data.ECTS,
          });
        });

        setLectures(fetchedLectures);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };

    fetchLectures();  // Fetch lectures when component mounts
  }, []);

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

  return { courses, lectures, handleCourseChange, handleEctsChange };
};
