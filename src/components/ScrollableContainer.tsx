import React from 'react';
import { Box } from '@mui/material';

interface ScrollableContainerProps {
  children: React.ReactNode;
  maxHeight: string;
  sx?: object;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, maxHeight }) => {
  return (
      <Box
          sx={{
            overflowY: 'auto',
            maxHeight: maxHeight,
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Slightly opaque white background
            border: '1px solid #ccc',  // Optional border for clarity
          }}
      >
        {children}  {/* Render the course grid inside the scrollable box */}
      </Box>
  );
};

export default ScrollableContainer;
