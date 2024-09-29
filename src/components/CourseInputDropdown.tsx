import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

interface Course {
  id: string;
  name: string;
  ects: number;
}

interface CourseInputDropdownProps {
  courses: Course[];
  ectsOptions: number[];
  selectedCourse: string;
  selectedEcts: number;
  onCourseChange: (course: string) => void;
  onEctsChange: (ects: number) => void;

  // New optional props for styling and spacing
  courseFieldWidth?: number;     // Width for the course dropdown
  ectsFieldWidth?: number;       // Width for the ECTS dropdown
  courseFieldPadding?: string;   // Padding for the course dropdown
  ectsFieldPadding?: string;     // Padding for the ECTS dropdown
  spacingBetweenFields?: number; // Spacing between the two fields
  fieldHeight?: number;          // Height of the input fields
  labelFontSize?: string;        // Font size of the labels
  inputFontSize?: string;        // Font size of the input text
}

const CourseInputDropdown: React.FC<CourseInputDropdownProps> = ({
                                                                   ectsOptions,
                                                                   courses,
                                                                   selectedCourse,
                                                                   selectedEcts,
                                                                   onCourseChange,
                                                                   onEctsChange,
                                                                   courseFieldWidth = 9, // Default width (9 of 12 grid columns)
                                                                   ectsFieldWidth = 3,   // Default width (3 of 12 grid columns)
                                                                   courseFieldPadding = '0px', // Default padding
                                                                   ectsFieldPadding = '2px',    // Default padding
                                                                   spacingBetweenFields = 0,    // Default spacing
                                                                   fieldHeight = 30,            // Default field height in px
                                                                   labelFontSize = '13px',      // Default label font size
                                                                   inputFontSize = '14px',      // Default input font size
                                                                 }) => {
  return (
      <Grid container spacing={spacingBetweenFields} alignItems="center">
        {/* Course Name Dropdown */}
        <Grid item xs={courseFieldWidth} style={{ paddingLeft: courseFieldPadding }}>
          <TextField
              select
              label="Course"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                style: {
                  height: `${fieldHeight}px`,      // Adjust field height
                  fontSize: inputFontSize,         // Adjust input text font size
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: labelFontSize,         // Adjust label font size
                },
              }}
          >
            <MenuItem value="">
              <em>None</em> {/* This option clears the course */}
            </MenuItem>
            {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
                </MenuItem>
            ))}
          </TextField>
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
                  height: `${fieldHeight}px`,      // Adjust field height
                  fontSize: inputFontSize,         // Adjust input text font size
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: labelFontSize,         // Adjust label font size
                },
              }}
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
