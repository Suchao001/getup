import React, {useContext, useEffect,useState } from 'react';
import {
   Typography, Button, Paper, Avatar, List, 
  ListItem, ListItemIcon, ListItemText,Box,Container,
} from '@mui/material';
import {
  Person, Settings
} from '@mui/icons-material';
import CheckLogin from '../components/auth/CheckLogin';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingProfile from './setting/Setting_profile';
import SettingAccount from './setting/Setting_accout';
import AuthContext from '../context/AuthContext';

function Setting() {    
  const navigate = useNavigate();
  const { user,loading } = useContext(AuthContext);
  const location = useLocation().pathname;
  const getUser = user || {};
  const [avatarSrc, setAvatarSrc] = useState(getUser.img || '/path-to-default-avatar.jpg');

  useEffect(() => {
    if(!loading){
      setAvatarSrc(getUser.img || '/path-to-default-avatar.jpg');
      console.log(avatarSrc);
    }
  }, [location]);
  const goSetting = (part) => {
    navigate(`/setting/${part}`);
  };

  const renderContent = () => {
    switch (location) {
      case '/setting/profile':
        return <SettingProfile/>;
      case '/setting/account':
        return <SettingAccount/>;
      default:
        return <SettingProfile/>;
    }
  };

    return (
      <Container>
      <CheckLogin page={
        <Box sx={{ display: 'flex', p: 3 }}>
          <Box sx={{ width: 250, mr: 4 }}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={avatarSrc} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="h6">Suchao</Typography>
                  <Typography variant="body2" color="textSecondary">Your personal account</Typography>
                </Box>
              </Box>
              <Button variant="outlined" fullWidth>Go to your personal profile</Button>
            </Paper>
            <List component="nav">
              <ListItem 
                button 
                selected={location === '/setting/profile' || location === '/setting'}
                onClick={() => goSetting('profile')}
              >
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Public profile" />
              </ListItem>
              <ListItem 
                button 
                selected={location === '/setting/account'}
                onClick={() => goSetting('account')}
              >
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
              {/* Add more list items for other sections */}
            </List>
          </Box>
          <Box sx={{ flex: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      } />
    </Container>
  );
}

export default Setting;
