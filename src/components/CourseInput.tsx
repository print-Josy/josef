// src/components/CourseInput.tsx
import React, { useState } from 'react';
import {TextField, Grid, IconButton} from '@mui/material';
import DoneIcon from "@mui/icons-material/Done";

interface CourseInputProps {
  onSubmit: (courseName: string, ectsPoints: number) => void;
}

const CourseInput: React.FC<CourseInputProps> = ({ onSubmit }) => {
  const [courseName, setCourseName] = useState('');
  const [ectsPoints, setEctsPoints] = useState('');

  const handleSubmit = () => {
    if (courseName && ectsPoints) {
      onSubmit(courseName, Number(ectsPoints));
      setCourseName('');  // Reset input after submission
      setEctsPoints('');
    }
  };

  return (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <TextField
              label="Lecture"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                style: {
                  height: '40px',  // Reduce height
                  fontSize: '14px',  // Smaller font
                },
              }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
              label="ECTS"
              value={ectsPoints}
              onChange={(e) => setEctsPoints(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
              InputProps={{
                style: {
                  height: '40px',  // Reduce height
                  fontSize: '14px',  // Smaller font
                },
              }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary" onClick={handleSubmit} size="small">
            <DoneIcon />
          </IconButton>
        </Grid>
      </Grid>
  );
};

export default CourseInput;
