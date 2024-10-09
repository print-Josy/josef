import React from 'react';
import {Grid, MenuItem, TextField} from '@mui/material';
import LectureDropdown from './LectureDropdown';
import {EctsStatusChange} from "../hooks/useCourses.ts";


interface CourseInputDropdownProps {
  selectedCourse: string;
  selectedEcts: number;
  achieved: boolean;  // New prop for the achieved status
  onCourseChange: (course: string) => void;
  onEctsChange: (change: EctsStatusChange) => void; // Use structured change

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
                                                                   selectedCourse,
                                                                   selectedEcts,
                                                                   achieved,  // Use the achieved status
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

  const ectsOptions = [0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 10];

  // Apply conditional styles
  const FieldStyle = {
    backgroundColor: achieved ? 'rgba(85, 162, 235, 0.4)' : 'rgba(255, 255, 255, 0)',  // Light green background when achieved
  };

  return (
      <Grid container spacing={spacingBetweenFields} alignItems="center">
        <Grid item xs={courseFieldWidth} style={{ paddingLeft: courseFieldPadding }}>
          <LectureDropdown
              selectedCourse={selectedCourse}
              onCourseChange={onCourseChange}
              labelFontSize={labelFontSize}
              inputFontSize={inputFontSize}
              fieldHeight={fieldHeight}
              fieldStyle={FieldStyle}
          />
        </Grid>

        <Grid item xs={ectsFieldWidth} style={{ paddingLeft: ectsFieldPadding }}>
          <TextField
              select
              label="ECTS"
              value={selectedEcts}
              onChange={(e) => {
                let ects = Number(e.target.value);
                let achieved = false;

                if (ects === -1) { // If DONE is selected
                  achieved = true;
                  ects = selectedEcts; // Keep the current ECTS when "DONE" is selected
                }
                onEctsChange({ ects, achieved }); // Send structured change
              }}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                style: {
                  ...FieldStyle,
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
            <MenuItem value={-1} sx={{ fontSize: '13px', fontWeight: 'bold' }}>
              DONE
            </MenuItem>
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
