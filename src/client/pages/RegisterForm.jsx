import React, { useContext, useEffect } from 'react';
import { Button, TextField, Typography, Container, Grid, Paper } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { HostName } from '../script/HostName';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {Toaster ,goodAlert,badAlert} from '../script/sweet';



const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm = () => {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin]);

  const handleSubmit = (values) => {
    const url = `${HostName}/api/user/register`;
    axios.post(url, {
      username: values.username,
      password: values.password
    })
    .then(response => {
      console.log('Response:', response.data);
      if (response.status===201) {
        goodAlert('success','Register successful');
        navigate('/');
      }
    })
    .catch(error => {
      badAlert('error','Register failed');
      console.error('Error:', error);
    });
  };


  return (
    <>
    <Toaster />
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Register
        </Typography>
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="username"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
    </>
  );
};

export default RegisterForm;
