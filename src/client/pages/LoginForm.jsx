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
    <div className='mt-4'>
    <Container component="main" maxWidth="xs">
      <Toaster />
      <Paper elevation={3} sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '16px' }}>
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
            color="primary"
            sx={{ mt: 2, width: '100%' }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
    </div>
  );
};

export default LoginForm;
