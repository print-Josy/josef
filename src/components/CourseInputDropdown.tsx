import React from 'react';
import { Grid, MenuItem, TextField, Typography, Box } from '@mui/material';
import { JSX } from 'react/jsx-runtime';

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
                                                                   courses,
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
  // Sort courses alphabetically
  const sortedCourses = [...courses].sort((a, b) => a.name.localeCompare(b.name));

  // Helper function to create separators for new starting letters
  const renderCourseOptions = () => {
    let lastInitial = ''; // Track the last starting letter
    const options: JSX.Element[] = []; // Create an array for options

    sortedCourses.forEach((course) => {
      const initial = course.name.charAt(0).toUpperCase();
      const isNewLetter = initial !== lastInitial; // Check if a new letter section starts
      lastInitial = initial;

      if (isNewLetter) {
        options.push(
            <Box
                key={`separator-${initial}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
              <Box
                  sx={{
                    flex: 1,
                    borderBottom: '0.5px solid lightgrey',  // Thin grey line on the left
                  }}
              />
              <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: '#555',
                    fontSize: '12px',
                    padding: '0 12px',  // Padding between the letter and the lines
                  }}
              >
                {initial}
              </Typography>
              <Box
                  sx={{
                    flex: 1,
                    borderBottom: '0.5px solid lightgrey',  // Thin grey line on the right
                  }}
              />
            </Box>
        );
      }

      options.push(
          <MenuItem key={course.id} value={course.name}
              sx={{
                fontSize: '12px',
              }}
          >
            {course.name}
          </MenuItem>
      );
    });

    return options; // Return the array instead of fragments
  };

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
                  height: `${fieldHeight}px`,
                  fontSize: inputFontSize,
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: labelFontSize,
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 350, // Limit the dropdown height to enable scrolling
                      overflowY: 'auto', // Scroll when there are too many options
                    },
                  },
                },
              }}
          >
            <MenuItem value="">
              <em>None</em> {/* This option clears the course */}
            </MenuItem>
            {renderCourseOptions()}
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
