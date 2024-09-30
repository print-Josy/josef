import React from 'react';
import { Grid } from '@mui/material';
import ScrollableContainer from './ScrollableContainer';
import CourseGrid from './CourseGrid';

interface CourseField {
  selectedCourse: string;
  selectedEcts: number;
}

interface CourseSectionProps {
  updateEcts: (ects: number) => void;
  type: 'major' | 'minor';
  rows: number;
  cols: number;
  selectedFields: CourseField[];  // Typed instead of `any`
  setSelectedFields: React.Dispatch<React.SetStateAction<CourseField[]>>;
  maxHeight: string;

}

const CourseSection: React.FC<CourseSectionProps> = ({
                                                       updateEcts,
                                                       type,
                                                       rows,
                                                       cols,
                                                       selectedFields,
                                                       setSelectedFields,
                                                       maxHeight,

                                                     }) => {
  return (
      <ScrollableContainer maxHeight={maxHeight}>
        <Grid container spacing={0}>
          <CourseGrid
              updateEcts={updateEcts}
              type={type}
              rows={rows}
              cols={cols}
              selectedFields={selectedFields}
              setSelectedFields={setSelectedFields}
          />
        </Grid>
      </ScrollableContainer>
  );
};

export default CourseSection;
