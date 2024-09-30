// src/components/NavButton.tsx
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type NavButtonProps = {
  navigate_to: string;
  label: string;
};

const NavButton: React.FC<NavButtonProps> = ({ navigate_to, label }) => {
  const navigate = useNavigate();

  return (
      <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(navigate_to)}
          style={{ minWidth: '200px', maxWidth: '200px' }}
      >
        {label}
      </Button>
  );
};

export default NavButton;
