import React from 'react';
import { Grid } from '@mui/material';
import CourseInputDropdown from './CourseInputDropdown';
import { SelectedField } from '../hooks/useCourses';

interface CourseGridProps {
  cols: number;
  selectedFields: SelectedField[];
  setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>;
  handleCourseChange: (index: number, course: string) => void;  // Add course handler
  handleEctsChange: (index: number, ects: number) => void;  // Add ECTS handler
}

const CourseGrid: React.FC<CourseGridProps> = ({

                                                 cols,
                                                 selectedFields,
                                                 handleCourseChange,  // Receive handler
                                                 handleEctsChange,  // Receive handler
                                               }) => {

  return (
      <Grid container spacing={1}>
        {selectedFields.map((field, index) => (
            <Grid item xs={12 / cols} key={index} style={{ paddingLeft: "10px" }}>
              <CourseInputDropdown
                  selectedCourse={field.selectedCourse}
                  selectedEcts={field.selectedEcts}
                  onCourseChange={(course) => handleCourseChange(index, course)}  // Use handler
                  onEctsChange={(ects) => handleEctsChange(index, ects)}  // Use handler
              />
            </Grid>
        ))}
      </Grid>
  );
};

export default CourseGrid;
