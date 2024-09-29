import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  currentEcts: number;
  totalEcts: number;
  color?: string;
  height?: number;
  headerText?: string;          // Optional header text (e.g., "Major Courses")
  textAlign?: 'left' | 'center'; // Alignment of the text
  fontSize?: number;            // Optional font size for the text
  backgroundColor?: string;     // Background color for the unfilled bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                   currentEcts,
                                                   totalEcts,
                                                   color = 'primary',
                                                   height = 20,
                                                   headerText = '',
                                                   textAlign = 'center',
                                                   fontSize = 16,
                                                   backgroundColor = '#ccc'
                                                 }) => {
  const progress = Math.min((currentEcts / totalEcts) * 100, 100);

  return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={0}
          width="100%"
          maxWidth="100%"
      >
        {/* Wrapping both the progress bar and text inside a relative container */}
        <Box sx={{ position: "relative", width: "100%" }}>
          {/* Progress bar */}
          <LinearProgress
              variant="determinate"
              value={progress}
              style={{ height: `${height}px`, width: '100%' }}
              sx={{
                '& .MuiLinearProgress-bar': { backgroundColor: color },
                backgroundColor: backgroundColor  // Set background color for the unfilled bar
              }}
          />

          {/* Text inside the bar */}
          <Box
              sx={{
                position: "absolute",
                top: "0",
                left: textAlign === 'left' ? '5px' : '50%',  // Align text left or center
                transform: textAlign === 'center' ? 'translateX(-50%)' : 'none', // Only center if textAlign is 'center'
                width: "100%",
                display: "flex",
                justifyContent: textAlign === 'left' ? 'space-between' : 'center',  // Align text accordingly
                alignItems: "center",
                height: "100%",
                padding: '0 15px'  // Adjust padding to create space between the edge and text
              }}
          >
            {/* Left text (Header like "Major Courses") */}
            {headerText && textAlign === 'left' && (
                <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
                >
                  {headerText}
                </Typography>
            )}

            {/* Right or centered ECTS text */}
            <Typography
                variant="body1"
                color="textPrimary"
                sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
            >
              {`${currentEcts} / ${totalEcts}`}
            </Typography>
          </Box>
        </Box>
      </Box>
  );
};

export default ProgressBar;