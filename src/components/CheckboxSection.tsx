import React from 'react';
import { Box, Checkbox, Typography } from '@mui/material';

interface CheckboxSectionProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const CheckboxSection: React.FC<CheckboxSectionProps> = ({ checked, onChange, label }) => {
  return (
      <Box display="flex" alignItems="center">
        <Checkbox checked={checked} onChange={onChange} />
        <Typography>{label}</Typography>
      </Box>
  );
};

export default CheckboxSection;
