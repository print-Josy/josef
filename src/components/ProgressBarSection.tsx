import React from 'react';
import { Box } from '@mui/material';
import ProgressBar from './ProgressBar';

interface ProgressBarSectionProps {
  currentEcts: number;
  totalEcts: number;
  headerText?: string;
  color: string;
  backgroundColor: string;
  height?: number;
  mt?: number | string; // Optional margin-top
  mb?: number | string; // Optional margin-bottom
  px?: number | string; // Optional padding-x (horizontal padding)
  fontSize?: number;    // Optional font size for the text
  textAlign?: 'left' | 'center';  // Optional text alignment
}

const ProgressBarSection: React.FC<ProgressBarSectionProps> = ({
                                                                 currentEcts,
                                                                 totalEcts,
                                                                 headerText,
                                                                 color,
                                                                 backgroundColor,
                                                                 height = 35,
                                                                 mt = 0,  // Default margin-top
                                                                 mb = 1,  // Default margin-bottom
                                                                 px = 0,  // Default padding-x
                                                                 fontSize = 16,  // Default font size
                                                                 textAlign = 'left',  // Default text alignment
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
            totalEcts={totalEcts}
            color={color}
            height={height}
            headerText={headerText}
            textAlign={textAlign}
            fontSize={fontSize}
            backgroundColor={backgroundColor}
        />
      </Box>
  );
};

export default ProgressBarSection;
