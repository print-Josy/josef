import React from 'react';
import { Grid } from '@mui/material';
import CourseInputDropdown from './CourseInputDropdown';
import { SelectedField } from '../hooks/useCourses';
import { EctsStatusChange } from '../hooks/useCourses'; // Ensure correct import

interface CourseGridProps {
  cols: number;
  selectedFields: SelectedField[];
  setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>;
  handleCourseChange: (index: number, course: string) => void;
  handleEctsChange: (index: number, change: EctsStatusChange) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({
                                                 cols,
                                                 selectedFields,
                                                 handleCourseChange,
                                                 handleEctsChange,
                                               }) => {

  return (
      <Grid container spacing={1}>
        {selectedFields.map((field, index) => (
            <Grid item xs={16 / cols} key={index} style={{ paddingLeft: "10px" }}>
              <CourseInputDropdown
                  selectedCourse={field.selectedCourse}
                  selectedEcts={field.selectedEcts}
                  achieved={field.achieved}
                  onCourseChange={(course) => handleCourseChange(index, course)}
                  onEctsChange={(change) => handleEctsChange(index, change)} // Directly pass the structured object
              />
            </Grid>
        ))}
      </Grid>
  );
};

export default CourseGrid;
