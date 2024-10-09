import React from 'react';
import { Box, Checkbox, Typography } from '@mui/material';

interface CheckboxSectionProps {
  label: string;
  isChecked: boolean;  // Current checked state
  onCheckboxChange: () => void;  // Function to handle checkbox changes
}

const CheckboxSection: React.FC<CheckboxSectionProps> = ({ label, isChecked, onCheckboxChange }) => {
  return (
      <Box display="flex" alignItems="center" sx={{ paddingRight: 6 }}>
        <Checkbox checked={isChecked} onChange={onCheckboxChange} color="secondary" />
        <Typography>{label}</Typography>
      </Box>
  );
};

export default CheckboxSection;
