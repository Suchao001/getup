import React, { useState } from 'react';
import {
   Typography, Button, Grid, Paper, Avatar, Box, CircularProgress,
} from '@mui/material';
import axios from 'axios';
import ProfileForm from './ProfileForm';
import useFetchUserProfile from '../../hooks/FetchUserProfile';
import { HostName } from '../../script/HostName';

function SettingProfile() {
  const { userProfile, avatarSrc, loading, error, refetchUserProfile } = useFetchUserProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

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
        const response = await axios.post(`${HostName}/api/user/upload_img`, formData, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log('Image uploaded successfully');
          refetchUserProfile(); // Refetch user profile to get updated image
          setPreview(response.data.imageUrl);
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

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" gutterBottom>Public profile</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProfileForm userProfile={userProfile} refetchUserProfile={refetchUserProfile} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', width: 200, height: 200, margin: 'auto' }}>
              {imageLoading && (
                <CircularProgress
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-20px',
                    marginLeft: '-20px',
                  }}
                />
              )}
              <Avatar
                src={preview || avatarSrc}
                sx={{
                  width: 200,
                  height: 200,
                  display: imageLoading ? 'none' : 'block',
                }}
                onLoad={handleImageLoad}
              />
            </Box>
            <Button variant="text" component="label" sx={{ mt: 2 }}>
              {uploading ? 'Uploading...' : 'Change Avatar'}
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit} disabled={uploading}>
              Save Avatar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettingProfile;
