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
  headerText?: string;           // Optional header text (e.g., "Major Courses" or "Master")
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
                                                   fontSize = 16,
                                                   backgroundColor = '#ccc'
                                                 }) => {
  const progress = Math.min((currentEcts / totalEcts) * 100, 100);
  const achievedProgress = useDualProgress ? Math.min((achievedEcts / totalEcts) * 100, 100) : 0;

  // Apply border and pulse effect only when achievedEcts equals or exceeds totalEcts
  const pulseEffect = achievedEcts >= totalEcts;
  const isMasterBar = !headerText;  // If there's no header text, center the bar

  return (
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={0}
          width="100%"
          maxWidth="100%"
          sx={{
            ...(pulseEffect && {
              border: '4px solid rgba(255, 223, 0, 0.6)',  // Light transparent yellow border
              animation: 'pulse 1.5s infinite',
            }),
            borderRadius: '12px', // Optional: to give the border a smooth corner
          }}
      >
        <Box sx={{ position: "relative", width: "100%" }}>
          {/* Main Progress Bar (current ECTS at the bottom) */}
          <LinearProgress
              variant="determinate"
              value={progress}
              style={{ height: `${height}px`, width: '100%', borderRadius: '7px', position: 'relative' }}
              sx={{
                '& .MuiLinearProgress-bar': { backgroundColor: color },
                backgroundColor: backgroundColor // Set background color for the unfilled bar
              }}
          />

          {/* Achieved ECTS Progress Bar (on top) */}
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
                  }}
                  sx={{
                    '& .MuiLinearProgress-bar': { backgroundColor: achievedColor },
                    backgroundColor: 'transparent' // Transparent background to overlay on the main progress bar
                  }}
              />
          )}

          {/* Text layout */}
          <Box
              sx={{
                position: "absolute",
                top: "0",
                left: isMasterBar ? '50%' : '0',  // Align center for Master, left for others
                transform: isMasterBar ? 'translateX(-50%)' : 'none',  // Center for Master
                width: "100%",
                display: "flex",
                justifyContent: isMasterBar ? 'center' : 'space-between',  // Center for Master, space between for others
                alignItems: "center",
                height: "100%",
                padding: '0 15px',  // Padding for some space on the sides
              }}
          >
            {/* Header Text (on the left for non-Master bar) */}
            {headerText && !isMasterBar && (
                <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
                >
                  {headerText}
                </Typography>
            )}

            {/* ECTS values (centered for Master, right-aligned for others) */}
            <Box display="flex" alignItems="center">

              <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ fontWeight: 'bold', fontSize: `${fontSize}px`, paddingLeft: '20px' }}
              >
                {achievedEcts}
              </Typography>

              <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ fontWeight: 'bold', fontSize: `${fontSize}px`, mx: 0.5 }}
              >
                {" / "}
              </Typography>

              <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ fontWeight: 'bold', fontSize: `${fontSize}px` }}
              >
                {totalEcts}
              </Typography>

              {(currentEcts - achievedEcts > 0) && useDualProgress && (
                <Typography
                    variant="body1"
                    color="textPrimary"
                    sx={{ fontWeight: 'italic', fontSize: `${fontSize - 3}px`, ml: 1 }}
                >
                  {`(open ${currentEcts - achievedEcts}/${currentEcts})`}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* CSS for pulsing animation */}
        {pulseEffect && (
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
        )}
      </Box>
  );
};

export default ProgressBar;
