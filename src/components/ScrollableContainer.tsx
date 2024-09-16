// src/components/ScrollableContainer.tsx
import React from 'react';
import { Box } from '@mui/material';

interface ScrollableContainerProps {
  children: React.ReactNode;
  maxHeight: string;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, maxHeight }) => {
  return (
      <Box
          sx={{
            overflowY: 'auto',
            maxHeight: maxHeight,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
      >
        {children}  {/* Render children, which may include CourseGrid */}
      </Box>
  );
};

export default ScrollableContainer;
