import React from 'react';
import { Grid } from '@mui/material';
import ScrollableContainer from './ScrollableContainer';
import CourseGrid from './CourseGrid';
import { EctsStatusChange, SelectedField } from '../hooks/useCourses'; // Ensure correct import



interface CourseSectionProps {
  cols: number;
  selectedFields: SelectedField[];
  setSelectedFields: React.Dispatch<React.SetStateAction<SelectedField[]>>;
  maxHeight: string;
  handleCourseChange: (index: number, course: string) => void;  // Add course handler
  handleEctsChange: (index: number, change: EctsStatusChange) => void;
}

const CourseSection: React.FC<CourseSectionProps> = ({

                                                       cols,
                                                       selectedFields,
                                                       setSelectedFields,
                                                       maxHeight,
                                                       handleCourseChange,  // Receive handler
                                                       handleEctsChange,  // Receive handler
                                                     }) => {
  return (
      <ScrollableContainer maxHeight={maxHeight}>
        <Grid container spacing={0}>
          <CourseGrid
              cols={cols}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
              handleCourseChange={handleCourseChange}  // Pass handler to CourseGrid
              handleEctsChange={handleEctsChange}  // Pass handler to CourseGrid
          />
        </Grid>
      </ScrollableContainer>
  );
};

export default CourseSection;
