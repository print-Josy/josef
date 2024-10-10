import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage'; // Import Firebase functions

const PDFPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store image URLs

  // Fetch image URLs from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, 'doc'); // Reference to the "doc" folder
      const imageList = await listAll(storageRef);

      // Get URLs for all the images
      const urls = await Promise.all(
          imageList.items.map((item) => getDownloadURL(item))
      );

      // Sort URLs by the numeric suffix at the end of each filename
      const sortedUrls = urls.sort((a, b) => {
        const numA = a.match(/-(\d+)\./)?.[1] || '0';
        const numB = b.match(/-(\d+)\./)?.[1] || '0';
        return parseInt(numA, 10) - parseInt(numB, 10);
      });

      setImageUrls(sortedUrls);
    };

    fetchImages();
  }, []);

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
            maxWidth="md"  // Set max width for the dialog to simulate A4 aspect ratio
            sx={{ maxHeight: '90vh' }}  // Limit the height to keep it scrollable
        >
          <DialogContent sx={{ padding: 0, overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {imageUrls.map((url, index) => (
                  <img
                      key={index}
                      src={url}
                      alt={`PDF page ${index + 1}`}
                      style={{
                        width: '100%',  // Full width on mobile
                        maxWidth: '850px',  // Limit max width for desktop or larger devices
                        height: 'auto',  // Keep aspect ratio
                        marginBottom: '10px'  // Add some space between images
                      }}
                  />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      </>
  );
};

export default PDFPopup;
