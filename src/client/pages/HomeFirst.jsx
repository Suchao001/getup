import React from 'react';
import { Typography, Button, Grid, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomeFirst() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

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
      style={{ color: '#ff6b6b' }}
    >
      <path d="M8 2v4"></path>
      <path d="M16 2v4"></path>
      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
      <path d="M3 10h18"></path>
      <path d="M8 14h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
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
      style={{ color: '#ffa500' }}
    >
      <circle cx="12" cy="13" r="8"></circle>
      <path d="M12 9v4l2 2"></path>
      <path d="M5 3 2 6"></path>
      <path d="m22 6-3-3"></path>
      <path d="M6.38 18.7 4 21"></path>
      <path d="M17.64 18.67 20 21"></path>
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
      style={{ color: '#ff6b6b' }}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <path d="M12 11h4"></path>
      <path d="M12 16h4"></path>
      <path d="M8 11h.01"></path>
      <path d="M8 16h.01"></path>
    </svg>
  );

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '600px',
          textAlign: 'center',
          background: 'linear-gradient(to right, #ff6b6b, #ffa500)',
          color: 'white',
          px: 2,  // Add padding for small screens
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          สวัสดี! ยินดีต้อนรับสู่ GetUpEveryDay
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
          เริ่มพัฒนานิสัยใหม่ๆ, จัดการงาน และวางแผนอนาคตของคุณได้ที่นี่
        </Typography>
        <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              background: '#ff6b6b',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(to right, #ffa500, #ff6b6b)',
              },
            }}
          >
            เริ่มต้นใช้งาน
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #ffa500, #ff6b6b)',
          color: 'white',
          py: { xs: 4, md: 8 }, // Adjust padding for different screen sizes
          px: { xs: 2, md: 0 }, // Add horizontal padding for small screens
        }}
      >
        <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                backgroundColor: '#ff6b6b',
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 1,
                color: 'white',
              }}
            >
              Key Features
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 2, fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
              Unlock Your Productivity
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Our platform offers a suite of tools and resources to help you stay focused, organized, and motivated throughout the day.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} container spacing={4}>
            <Grid item xs={12}>
              <Card > 
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <CalendarIcon />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                        Daily Planner
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Stay on top of your tasks and appointments with our customizable daily planner.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <WatchIcon />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                        Habit Tracker
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Build and maintain healthy habits with our intuitive tracking system.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <TaskIcon />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', margin: '0.5rem 0' }}>
                        Task Management
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Easily organize and prioritize your tasks to stay on top of your workload.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default HomeFirst;
