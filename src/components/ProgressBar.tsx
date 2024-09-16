// src/components/ProgressBar.tsx
import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  currentEcts: number; // The current ECTS accumulated
  totalEcts: number;   // The maximum ECTS (120 in this case)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentEcts, totalEcts }) => {
  const progress = (currentEcts / totalEcts) * 100; // Calculate the percentage of the bar

  return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
        {/* Progress bar */}
        <Box width="100%" maxWidth="600px" mb={1}>
          <LinearProgress variant="determinate" value={progress} style={{ height: '25px', backgroundColor: '#ccc' }} />
        </Box>

        {/* Display current progress (e.g., "60 ECTS") */}
        <Typography variant="h6" color="primary">{`${currentEcts} ECTS of ${totalEcts}`}</Typography>
      </Box>
  );
};

export default ProgressBar;
