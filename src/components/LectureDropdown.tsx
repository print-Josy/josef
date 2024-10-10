import React from 'react';
import { MenuItem, Typography, Box, TextField } from '@mui/material';
import { lectureNames } from '../assets/lectures.ts';  // Import the lecture names

interface LectureDropdownProps {
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  labelFontSize?: string;
  inputFontSize?: string;
  fieldHeight?: number;
  fieldStyle?: React.CSSProperties;  // New prop for passing field styles
}

const LectureDropdown: React.FC<LectureDropdownProps> = ({
                                                           selectedCourse,
                                                           onCourseChange,
                                                           labelFontSize = '13px',
                                                           inputFontSize = '14px',
                                                           fieldHeight = 30,
                                                           fieldStyle = {},  // Default to an empty style
                                                         }) => {
  // Sort courses alphabetically
  const sortedLectures = [...lectureNames].sort((a, b) => a.localeCompare(b));

  // Helper function to create separators for new starting letters
  const renderCourseOptions = () => {
    let lastInitial = ''; // Track the last starting letter
    const options: JSX.Element[] = []; // Create an array for options

    sortedLectures.forEach((course) => {
      const initial = course.charAt(0).toUpperCase();
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
                    borderBottom: '0.5px solid lightgrey', // Thin grey line on the left
                  }}
              />
              <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: '#555',
                    fontSize: '12px',
                    padding: '0 12px', // Padding between the letter and the lines
                  }}
              >
                {initial}
              </Typography>
              <Box
                  sx={{
                    flex: 1,
                    borderBottom: '0.5px solid lightgrey', // Thin grey line on the right
                  }}
              />
            </Box>
        );
      }

      options.push(
          <MenuItem key={course} value={course} sx={{ fontSize: '12px' }}>
            {course}
          </MenuItem>
      );
    });

    return options; // Return the array instead of fragments
  };

  return (
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
              ...fieldStyle,
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
  );
};

export default LectureDropdown;
