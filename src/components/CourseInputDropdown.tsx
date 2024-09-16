// src/components/CourseInputDropdown.tsx
import React, {useEffect, useState} from 'react';
import {Grid, MenuItem, TextField} from '@mui/material';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../firebaseConfig';  // Firestore config

interface CourseInputDropdownProps {
  ectsOptions: number[];  // List of available ECTS options
  selectedCourse: string;
  selectedEcts: number;
  onCourseChange: (course: string) => void;
  onEctsChange: (ects: number) => void;
}

interface CourseInputDropdownProps {
  courses?: any[]
}

const CourseInputDropdown: React.FC<CourseInputDropdownProps> = ({
                                                                   ectsOptions,
                                                                   selectedCourse,
                                                                   selectedEcts,
                                                                   onCourseChange,
                                                                   onEctsChange
                                                                 }) => {
  const [courses, setCourses] = useState<any[]>([]);

  // Fetch the course names from Firestore (lectures collection)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lectures'));
        const courseList: any[] = [];
        querySnapshot.forEach((doc) => {
          const courseData = doc.data();
          courseList.push({id: doc.id, name: courseData.Name, ects: courseData.ECTS});  // Push course name and ECTS into array
        });
        setCourses(courseList);  // Update state with fetched courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();  // Fetch courses when the component mounts
  }, []);

  return (
      <Grid container spacing={2} alignItems="center">
        {/* Course Name Dropdown (75% width) */}
        <Grid item xs={9}>
          <TextField
              select
              label="Course"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
          >
            {courses.map((course, index) => (
                <MenuItem key={index} value={course.name}>
                  {course.name} {/* Display course name */}
                </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ECTS Dropdown (25% width) */}
        <Grid item xs={3}>
          <TextField
              select
              label="ECTS"
              value={selectedEcts}
              onChange={(e) => onEctsChange(Number(e.target.value))}
              fullWidth
              variant="outlined"
              size="small"
          >
            {ectsOptions.map((ects, index) => (
                <MenuItem key={index} value={ects}>
                  {ects}
                </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
  );
};

export default CourseInputDropdown;
