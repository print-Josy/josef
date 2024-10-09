import React from 'react';
import { Box } from '@mui/material';
import ProgressBar from './ProgressBar';

interface ProgressBarSectionProps {
  currentEcts: number;
  achievedEcts?: number;          // Optional achieved ECTS for dual progress
  totalEcts: number;
  useDualProgress?: boolean;      // Boolean to toggle dual progress mode
  color: string;
  achievedColor?: string;         // Color for the achieved progress bar
  backgroundColor: string;
  height?: number;
  mt?: number | string;           // Optional margin-top
  mb?: number | string;           // Optional margin-bottom
  px?: number | string;           // Optional padding-x (horizontal padding)
  fontSize?: number;              // Optional font size for the text
  headerText?: string;            // Optional header text
}

const ProgressBarSection: React.FC<ProgressBarSectionProps> = ({
                                                                 currentEcts,
                                                                 achievedEcts = 0,               // Default to 0 if not provided
                                                                 totalEcts,
                                                                 useDualProgress = false,         // Default to single progress bar mode
                                                                 color,
                                                                 achievedColor = 'secondary',     // Default achieved color
                                                                 backgroundColor,
                                                                 height = 35,
                                                                 mt = 0,                         // Default margin-top
                                                                 mb = 1,                         // Default margin-bottom
                                                                 px = 0,                         // Default padding-x
                                                                 fontSize = 16,                  // Default font size
                                                                 headerText = '',                // Default header text
                                                               }) => {
  return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxWidth="100%"
          mx="auto"
          sx={{ mt: mt, mb: mb, px: px }}
      >
        <ProgressBar
            currentEcts={currentEcts}
            achievedEcts={achievedEcts}      // Pass achieved ECTS to the ProgressBar
            totalEcts={totalEcts}
            useDualProgress={useDualProgress} // Pass the flag for dual progress
            color={color}
            achievedColor={achievedColor}     // Pass the color for achieved progress
            height={height}
            headerText={headerText}
            fontSize={fontSize}
            backgroundColor={backgroundColor}
        />
      </Box>
  );
};

export default ProgressBarSection;
