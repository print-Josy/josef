import React, {  } from 'react';
import { Grid } from '@mui/material';
import CourseInputDropdown from './CourseInputDropdown';
import { useCourses, SelectedField } from '../hooks/useCourses';

interface CourseGridProps {
  updateEcts: (ects: number) => void;
  type: 'major' | 'minor';
  rows: number;
  cols: number;
  selectedFields: SelectedField[]; // Passed from Master component
  setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>; // Passed from Master component
}

const CourseGrid: React.FC<CourseGridProps> = ({ updateEcts, type, cols, selectedFields, setSelectedFields }) => {

  const ectsOptions = [0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 10];
  const { lectures, handleCourseChange, handleEctsChange } = useCourses(selectedFields, setSelectedFields, updateEcts, type);

  return (
      <Grid container spacing={1}>
        {selectedFields.map((field, index) => (
            <Grid item xs={12 / cols} key={index} style={{
              paddingLeft: "20px",  // Add custom right padding here
            }}>
              <CourseInputDropdown
                  courses={lectures}  // Pass the predefined lectures for the dropdown
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
