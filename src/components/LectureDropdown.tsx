import React, { useEffect, useState } from 'react';
import { MenuItem, Typography, Box, TextField } from '@mui/material';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig.ts";

interface Course {
  id: string;
  name: string;
  ects: number;
}

interface LectureDropdownProps {
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  labelFontSize?: string;
  inputFontSize?: string;
  fieldHeight?: number;
}

const LectureDropdown: React.FC<LectureDropdownProps> = ({
                                                           selectedCourse,
                                                           onCourseChange,
                                                           labelFontSize = '13px',
                                                           inputFontSize = '14px',
                                                           fieldHeight = 30,
                                                         }) => {
  const [lectures, setLectures] = useState<Course[]>([]); // Stores predefined lecture data for dropdowns

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesCollection = collection(db, 'lectures');
        const querySnapshot = await getDocs(lecturesCollection);
        const fetchedLectures: Course[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedLectures.push({
            id: doc.id,
            name: data.Name,
            ects: data.ECTS,
          });
        });

        setLectures(fetchedLectures);
        localStorage.setItem('lectures', JSON.stringify(fetchedLectures));
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };

    fetchLectures();
  }, []);

  // Sort courses alphabetically
  const sortedLectures = [...lectures].sort((a, b) => a.name.localeCompare(b.name));

  // Helper function to create separators for new starting letters
  const renderCourseOptions = () => {
    let lastInitial = ''; // Track the last starting letter
    const options: JSX.Element[] = []; // Create an array for options

    sortedLectures.forEach((course) => {
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
  );
};

export default LectureDropdown;
