import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  currentEcts: number;
  achievedEcts?: number;         // Optional achieved ECTS for dual progress
  totalEcts: number;
  useDualProgress?: boolean;     // Boolean to toggle dual progress mode
  color?: string;
  achievedColor?: string;        // Color for the achieved progress bar
  height?: number;
  headerText?: string;           // Optional header text (e.g., "Major Courses")
  textAlign?: 'left' | 'center'; // Alignment of the text
  fontSize?: number;             // Optional font size for the text
  backgroundColor?: string;      // Background color for the unfilled bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                   currentEcts,
                                                   achievedEcts = 0,
                                                   totalEcts,
                                                   useDualProgress = false,      // Default to single bar mode
                                                   color = 'primary',
                                                   achievedColor = 'secondary',   // Default color for achieved progress
                                                   height = 20,
                                                   headerText = '',
                                                   textAlign = 'center',
                                                   fontSize = 16,
                                                   backgroundColor = '#ccc'
                                                 }) => {
  const progress = Math.min((currentEcts / totalEcts) * 100, 100);
  const achievedProgress = useDualProgress ? Math.min((achievedEcts / totalEcts) * 100, 100) : 0;

  return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={0}
          width="100%"
          maxWidth="100%"
          sx={{
            ...(progress >= 100 && {
              border: '4px solid rgba(255, 223, 0, 0.6)',  // Light transparent yellow border
              animation: 'pulse 1.5s infinite',
            }),
            borderRadius: '12px', // Optional: to give the border a smooth corner
          }}
      >
        <Box sx={{ position: "relative", width: "100%" }}>
          {/* Achieved ECTS Progress Bar (if useDualProgress is true) */}
          {useDualProgress && (
              <LinearProgress
                  variant="determinate"
                  value={achievedProgress}
                  style={{
                    position: 'absolute',
                    top: 0,
                    height: `${height}px`,
                    width: '100%',
                    borderRadius: '7px',
                    opacity: 0.6  // Semi-transparent to differentiate from the main progress bar
                  }}
                  sx={{
                    '& .MuiLinearProgress-bar': { backgroundColor: achievedColor },
                    backgroundColor: backgroundColor // Set background color for the unfilled bar
                  }}
              />
          )}

          {/* Main Progress Bar */}
          <LinearProgress
              variant="determinate"
              value={progress}
              style={{ height: `${height}px`, width: '100%', borderRadius: '7px', position: 'relative' }}
              sx={{
                '& .MuiLinearProgress-bar': { backgroundColor: color },
                backgroundColor: backgroundColor // Set background color for the unfilled bar
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
            {headerText && textAlign === 'left' && (
                <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
                >
                  {headerText}
                </Typography>
            )}

            <Typography
                variant="body1"
                color="textPrimary"
                sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
            >
              {`${currentEcts} / ${totalEcts}`} {useDualProgress && `(${achievedEcts})`}
            </Typography>
          </Box>
        </Box>

        {/* CSS for pulsing animation */}
        <style>
          {`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 10px rgba(255, 223, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(255, 223, 0, 0.5);
          }
          100% {
            box-shadow: 0 0 10px rgba(255, 223, 0, 0.3);
          }
        }
      `}
        </style>
      </Box>
  );
};

export default ProgressBar;
