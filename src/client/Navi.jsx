import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Navi.css';
import { Popover, TextField, Button, Typography, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import {  badAlert,goodAlert,Toaster} from './script/sweet';
import {HostName} from './script/HostName'; 
import AuthContext from './context/AuthContext';



function Navi() {
  const [activeLink, setActiveLink] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const {setIslogin,user} = useContext(AuthContext);
 

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
 
  const handleSetLogout =() => {
    setIslogin(false);
  }

const handleLogout = async () => {
  try {
    const response = await axios.post(`${HostName}/api/user/logout`);
    if (response.data.success) {
      goodAlert('success','Logged out successfully');
      handleSetLogout;
      window.location.reload();
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};



  return (
    
    <nav className="custom-navbar">
      <Toaster />
      <div className="custom-navbar-container">
        <div className="custom-navbar-brand">
          <Link to="/" className={`custom-brand-link ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleLinkClick('/')}>
            <h4 className='font1'>GetUpEveryDay</h4>
          </Link>
        </div>

        <div className={`custom-navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`custom-nav-link ${activeLink === '/' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/')}
          >
            <div className='font1'>Home</div>
          </Link>
          <Link
            to="/calendar"
            className={`custom-nav-link ${activeLink === '/calendar' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/calendar')}
          >
            <div className='font1'>Calendar</div>
          </Link>

        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <Button
          className="user-menu-button"
          onClick={handleMenuClick}
          startIcon={
              <Avatar
              sx={{
                background: user.img
                  ? 'transparent' 
                  : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                width: 40,
                height: 40,
              }}
              src={user.img ?`${HostName}/${user.img}` : undefined}
            >
              {!user.img && (user.username).substring(0, 2)}
            </Avatar>
          }
        >
          <Typography variant="button" sx={{ color: 'white' }}>
             {user.username} 
          </Typography>
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
           transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            style: {
              width: '20ch',
              padding: '16px',
            },
          }}
        >
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <Button onClick={()=>navigate('/profile')} >
                profile
              </Button>
              <Button onClick={()=>navigate('/setting')} >
                setting
              </Button>
              <Button onClick={handleLogout} >
                Logout
              </Button>  
              
            </div>
          </Popover>
      </div>
    </nav>
  );
}

export default Navi;
