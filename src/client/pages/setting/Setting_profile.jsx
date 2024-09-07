import React, { useState, useEffect, useContext } from 'react';
import {
   Typography, TextField, Button, Grid, Paper, Avatar,Box,
} from '@mui/material';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

function SettingProfile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && user?.img) {
      setPreview(user.img);
    }
  }, [loading, user]);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      setUploading(true);
      try {
        const response = await axios.post('/api/user/upload_img', formData, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log('Image uploaded successfully');
          // Update user image URL in context
          const updatedUser = { ...user, img: response.data.imageUrl }; // Adjust according to actual response
          setUser(updatedUser);
          setPreview(response.data.imageUrl); // Update preview with the new URL
        } else {
          console.error('Image upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" gutterBottom>Public profile</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TextField label="Name" fullWidth variant="outlined" margin="normal" />
          <Typography variant="caption" display="block" gutterBottom>
            ชื่อจริงและนามสกุลจะถูกแสดงให้คนอื่นเห็น
          </Typography>   
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Avatar src={preview} sx={{ width: 200, height: 200, margin: 'auto' }} />
            <Button variant="text" component="label" sx={{ mt: 2 }}>
              {uploading ? 'Uploading...' : 'Edit'}
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit} disabled={uploading}>
        Save Changes
      </Button>
    </Box>
  );
}

export default SettingProfile;
