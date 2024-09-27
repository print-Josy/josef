import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

interface Course {
  id: string;
  name: string;
  ects: number;
}

interface CourseInputDropdownProps {
  courses: Course[];  // Use the proper Course interface here
  ectsOptions: number[];
  selectedCourse: string;
  selectedEcts: number;
  onCourseChange: (course: string) => void;
  onEctsChange: (ects: number) => void;
}

const CourseInputDropdown: React.FC<CourseInputDropdownProps> = ({
                                                                   ectsOptions,
                                                                   courses,
                                                                   selectedCourse,
                                                                   selectedEcts,
                                                                   onCourseChange,
                                                                   onEctsChange,
                                                                 }) => {
  return (
      <Grid container spacing={1} alignItems="center">
        {/* Course Name Dropdown (75% width) */}
        <Grid item xs={9} style={{ paddingLeft: '20px' }}>
          <TextField
              select
              label="Course"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
          >
            {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name} {/* Display LECTURES names */}
                </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ECTS Dropdown (25% width) */}
        <Grid item xs={3} style={{ paddingLeft: '2px' }}>
          <TextField
              select
              label="ECTS"
              value={selectedEcts}
              onChange={(e) => onEctsChange(Number(e.target.value))}
              fullWidth
              variant="outlined"
              size="small"
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
