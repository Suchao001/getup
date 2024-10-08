import React, { useState, useContext, useEffect } from "react";
import { Button, TextField, Typography, Container, Paper } from "@mui/material";
import axios from "axios";
import { HostName } from "../script/HostName";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toaster, goodAlert, badAlert } from "../script/sweet";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      badAlert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${HostName}/api/user/register`, {
        username,
        password,
      });
      if (response.status === 201) {
        goodAlert("Success", "Register successful");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      badAlert("Error", error.response.data);
      console.error("Error:", error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: "100vh", padding: 3 }}
    >
      <Toaster />
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1rem" }}
        >
          Register
        </Typography>
        <form
          onSubmit={handleRegister}
          style={{ width: "100%", marginTop: "16px" }}
        >
          <label htmlFor="username" className="font1">
            Username
          </label>
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
          <label htmlFor="password" className="font1">
            Password
          </label>
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
          <label htmlFor="confirmPassword" className="font1">
            Confirm Password
          </label>
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #007bff, #00bfff)",
              mt: 2,
              width: "100%",
              "&:hover": {
                background: "linear-gradient(to right, #00bfff, #007bff)",
              },
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
