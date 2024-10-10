import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
interface PDFPopupProps {
  pdfUrl: string;
}

const PDFPopup: React.FC<PDFPopupProps> = ({ pdfUrl }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
      <>
        <IconButton onClick={handleOpen} color="primary" sx={{ marginRight: '10px' }}>
          <SchoolIcon fontSize="large" />
        </IconButton>
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md" // Medium width for the PDF
        >
          <DialogContent sx={{ height: '800px', overflow: 'hidden' }}>
            <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                title="PDF Viewer"
                style={{ border: 'none' }}
            />
          </DialogContent>
        </Dialog>
      </>
  );
};

export default PDFPopup;
