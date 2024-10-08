import React from "react";
import {
  Typography,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// SVG icons for calendar, watch, and task
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#ff6b6b" }}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const WatchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#ffa500" }}
  >
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3 2 6" />
    <path d="m22 6-3-3" />
    <path d="M6.38 18.7 4 21" />
    <path d="M17.64 18.67 20 21" />
  </svg>
);

const TaskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "#ff6b6b" }}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

function HomeFirst() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "600px",
          textAlign: "center",
          background: "linear-gradient(to right, #ff6b6b, #ffa500)",
          color: "white",
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: "bold" }}
        >
          Hello! Welcome to GetUpEveryDay
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", md: "1.5rem" }, fontWeight: "300" }}
        >
          Start developing new habits, manage tasks, and plan your future here
        </Typography>
        <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              background: "#ff6b6b",
              color: "white",

              "&:hover": {
                background: "linear-gradient(to right, #ffa500, #ff6b6b)",
              },
              padding: "12px 24px", // Adjust padding for a better button size
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(to right, #ffa500, #ff6b6b)",
          color: "white",
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 4 },
          overflow: "hidden",
          marginLeft: "-60px",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}
        >
          {" "}
          {/* เพิ่ม padding แนวนอน */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: "#ff6b6b",
                display: "inline-block",
                px: 2,
                py: 1,
                borderRadius: 1,
                color: "white",
                fontWeight: "bold",
                boxShadow: "0px 4px 15px rgba(255, 107, 107, 0.3)",
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mt: 2,
                fontSize: { xs: "1.5rem", md: "2.5rem" },
              }}
            >
              Unlock Your Productivity
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Our platform offers a suite of tools and resources to help you
              stay focused, organized, and motivated throughout the day.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} container spacing={4}>
            {[
              {
                icon: <CalendarIcon />,
                title: "Daily Planner",
                description:
                  "Stay on top of your tasks and appointments with our customizable daily planner.",
              },
              {
                icon: <WatchIcon />,
                title: "Habit Tracker",
                description:
                  "Build and maintain healthy habits with our intuitive tracking system.",
              },
              {
                icon: <TaskIcon />,
                title: "Task Management",
                description:
                  "Easily organize and prioritize your tasks to stay on top of your workload.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: "8px",
                    background: "white",
                    width: "100%",
                    maxWidth: "1000px", // ตั้งค่า maxWidth ให้เหมาะสม
                    margin: "auto",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                      {feature.icon}
                      <Box sx={{ ml: 2 }}>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "bold", margin: "0.5rem 0" }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(to right, #ffa500, #ff6b6b)",
          color: "white",
          py: { xs: 2, md: 2 },
          px: { xs: 2, md: 0 },
          borderTop: "1px solid white",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", md: "1rem" },
            marginLeft: "1rem",
            color: "white",
          }}
          variant="body2"
        >
          © 2024 GetUpEveryDay. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}

export default HomeFirst;
