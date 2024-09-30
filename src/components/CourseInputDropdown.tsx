import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';
import LectureDropdown from './LectureDropdown'; // Import the new LectureDropdown component

interface CourseInputDropdownProps {
  ectsOptions: number[];
  selectedCourse: string;
  selectedEcts: number;
  onCourseChange: (course: string) => void;
  onEctsChange: (ects: number) => void;

  courseFieldWidth?: number;
  ectsFieldWidth?: number;
  courseFieldPadding?: string;
  ectsFieldPadding?: string;
  spacingBetweenFields?: number;
  fieldHeight?: number;
  labelFontSize?: string;
  inputFontSize?: string;
}

const CourseInputDropdown: React.FC<CourseInputDropdownProps> = ({
                                                                   ectsOptions,
                                                                   selectedCourse,
                                                                   selectedEcts,
                                                                   onCourseChange,
                                                                   onEctsChange,
                                                                   courseFieldWidth = 9,
                                                                   ectsFieldWidth = 3,
                                                                   courseFieldPadding = '0px',
                                                                   ectsFieldPadding = '2px',
                                                                   spacingBetweenFields = 0,
                                                                   fieldHeight = 30,
                                                                   labelFontSize = '13px',
                                                                   inputFontSize = '14px',
                                                                 }) => {
  return (
      <Grid container spacing={spacingBetweenFields} alignItems="center">
        {/* Course Name Dropdown */}
        <Grid item xs={courseFieldWidth} style={{ paddingLeft: courseFieldPadding }}>
          <LectureDropdown
              selectedCourse={selectedCourse}
              onCourseChange={onCourseChange}
              labelFontSize={labelFontSize}
              inputFontSize={inputFontSize}
              fieldHeight={fieldHeight}
          />
        </Grid>

        {/* ECTS Dropdown */}
        <Grid item xs={ectsFieldWidth} style={{ paddingLeft: ectsFieldPadding }}>
          <TextField
              select
              label="ECTS"
              value={selectedEcts}
              onChange={(e) => onEctsChange(Number(e.target.value))}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                style: {
                  height: `${fieldHeight}px`,
                  fontSize: inputFontSize,
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: labelFontSize,
                },
              }}
          >
            {ectsOptions.map((ects, index) => (
                <MenuItem key={index} value={ects} sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {ects}
                </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
  );
};

export default CourseInputDropdown;
