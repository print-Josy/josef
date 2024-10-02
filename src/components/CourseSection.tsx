import React from 'react';
import { Grid } from '@mui/material';
import ScrollableContainer from './ScrollableContainer';
import CourseGrid from './CourseGrid';

interface CourseField {
  selectedCourse: string;
  selectedEcts: number;
}

interface CourseSectionProps {
  cols: number;
  selectedFields: CourseField[];
  setSelectedFields: React.Dispatch<React.SetStateAction<CourseField[]>>;
  maxHeight: string;
  handleCourseChange: (index: number, course: string) => void;  // Add course handler
  handleEctsChange: (index: number, ects: number) => void;  // Add ECTS handler
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
