// src/components/CourseGrid.tsx
import React, { useState } from 'react';
import { Grid } from '@mui/material';
import CourseInputDropdown from './CourseInputDropdown';
import { useCourses } from '../hooks/useCourses';

interface CourseGridProps {
  updateEcts: (ects: number) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({ updateEcts }) => {
  const [selectedFields, setSelectedFields] = useState(
      Array(64).fill({ selectedCourse: '', selectedEcts: 0 })
  );

  const ectsOptions = [0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 10, 30];  // Define ECTS options here

  // Use your useCourses hook
  const { courses, handleCourseChange, handleEctsChange } = useCourses(selectedFields, setSelectedFields, updateEcts);

  return (
      <Grid container spacing={2}>
        {selectedFields.map((field, index) => (
            <Grid item xs={3} key={index}>
              <CourseInputDropdown
                  courses={courses}
                  ectsOptions={ectsOptions}  // Pass the ectsOptions here
                  selectedCourse={field.selectedCourse}
                  selectedEcts={field.selectedEcts}
                  onCourseChange={(course) => handleCourseChange(index, course)}
                  onEctsChange={(ects) => {
                    handleEctsChange(index, ects);
                    updateEcts(ects);
                  }}
              />
            </Grid>
        ))}
      </Grid>
  );
};

export default CourseGrid;
