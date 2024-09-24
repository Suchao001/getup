import React, { useState, useContext,useEffect } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import axios from 'axios';
import { badAlert, goodAlert, Toaster } from '../script/sweet';
import { HostName } from '../script/HostName';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${HostName}/api/user/login`, { username, password });
      const { success } = response.data;
      if (success) {
        window.location.reload();
        goodAlert('Success', 'Login successful');
      } else {
        badAlert('Login failed', response.data.message);
      }
    } catch (error) {
      badAlert('Login failed', 'Error');
      console.error('Error:', error);
    }
  };

  return (
   
    <Container className='font1' component="main" maxWidth="xs" sx={{minHeight:'100vh',padding:3 }}>
      <Toaster />
      <Paper elevation={3} sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' ,borderRadius:'10px'}}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '16px' }}>
          <label htmlFor="username">Username</label>
          <TextField
            label="Username"
            variant="outlined"
            size="small"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            margin="normal"
          />
          <label htmlFor="password">Password</label>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ background: 'linear-gradient(to right, #007bff, #00bfff)', mt: 2, width: '100%', '&:hover': { background: 'linear-gradient(to right, #00bfff, #007bff)' }}}
          >
            Sign in
          </Button>
          <Button sx={{mt:2,width:'100%'}}>register</Button>
        </form>
      </Paper>
    </Container>

  );
};

export default LoginForm;
