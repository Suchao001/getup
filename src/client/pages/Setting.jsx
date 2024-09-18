import React from 'react';
import {
   Typography, Button, Paper, Avatar, List, 
  ListItem, ListItemIcon, ListItemText, Box, Container,
} from '@mui/material';
import {
  Person, Settings
} from '@mui/icons-material';
import CheckLogin from '../components/auth/CheckLogin';
import { useNavigate } from 'react-router-dom';
import useFetchUserProfile from '../hooks/FetchUserProfile';

function Setting({children, title}) {    
  const navigate = useNavigate();
  const { userProfile, avatarSrc, loading, error } = useFetchUserProfile();

  const goSetting = (part) => {
    navigate(`/setting/${part}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <CheckLogin page={
        <Box sx={{ display: 'flex', p: 3 }}>
          <Box sx={{ width: 250, mr: 4 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={avatarSrc} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{userProfile?.username || 'Username'}</Typography>
                  <Typography variant="body2" color="textSecondary">Your personal account</Typography>
                </Box>
              </Box>
              <Button variant="outlined" fullWidth onClick={() => navigate('/profile')}>Go to your personal profile</Button>
            </Paper>
            <List component="nav">
              <ListItem 
                button 
                selected={title === "Profile"}
                onClick={() => goSetting('profile')}
              >
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Public profile" />
              </ListItem>
              <ListItem 
                button 
                selected={title === "Account"}
                onClick={() => goSetting('account')}
              >
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
        </Box>
      } />
    </Container>
  );
}

export default Setting;
