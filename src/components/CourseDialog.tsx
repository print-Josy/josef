// src/components/CourseDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';

interface CourseDialogProps {
  open: boolean;
  onClose: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({ open, onClose }) => {
  const [courseName, setCourseName] = useState('');
  const [ectsPoints, setEctsPoints] = useState('');

  const handleSubmit = async () => {
    if (courseName && ectsPoints) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const lecturesRef = collection(db, 'lectures');
          await setDoc(doc(lecturesRef), {
            courseName,
            ectsPoints: Number(ectsPoints),
            createdAt: new Date(),
          });

          console.log("Course added successfully!");
          setCourseName('');
          setEctsPoints('');
          onClose(); // Close the dialog after successful submit
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
    }
  };

  return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
              label="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              margin="normal"
          />
          <TextField
              label="ECTS"
              value={ectsPoints}
              onChange={(e) => setEctsPoints(e.target.value)}
              fullWidth
              margin="normal"
              type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Add Course</Button>
        </DialogActions>
      </Dialog>
  );
};

export default CourseDialog;
