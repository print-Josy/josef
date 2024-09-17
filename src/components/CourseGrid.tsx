import React, { useState } from 'react';
import { Grid } from '@mui/material';
import CourseInputDropdown from './CourseInputDropdown';
import { useCourses } from '../hooks/useCourses';

interface CourseGridProps {
  updateEcts: (ects: number) => void;
  type: 'major' | 'minor';  // Add type prop for Major and Minor distinction
  rows: number;
  cols: number;
}

const CourseGrid: React.FC<CourseGridProps> = ({ updateEcts, type, rows, cols }) => {
  const totalFields = rows * cols;
  const [selectedFields, setSelectedFields] = useState(
      Array(totalFields).fill({ selectedCourse: '', selectedEcts: 0 })
  );

  const ectsOptions = [0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 10, 30];
  const { courses, handleCourseChange, handleEctsChange } = useCourses(selectedFields, setSelectedFields, updateEcts, type);

  return (
      <Grid container spacing={2}>
        {selectedFields.map((field, index) => (
            <Grid item xs={12 / cols} key={index}>
              <CourseInputDropdown
                  courses={courses}
                  ectsOptions={ectsOptions}
                  selectedCourse={field.selectedCourse}
                  selectedEcts={field.selectedEcts}
                  onCourseChange={(course) => handleCourseChange(index, course, type)}
                  onEctsChange={(ects) => handleEctsChange(index, ects, type)}
              />
            </Grid>
        ))}
      </Grid>
  );
};

export default CourseGrid;
