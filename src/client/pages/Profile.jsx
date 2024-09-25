import React, { useState } from 'react';
import { Container, Grid, Button, Typography, Avatar, Box, Paper, Chip, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../components/auth/CheckLogin';
import useFetchUserProfile from '../hooks/FetchUserProfile';
import dayjs from 'dayjs';
import LifeCalculator from '../components/LifeCalculator/LifeCalculator';
import YearProgress from '../components/LifeCalculator/YearProgress'
import FaceIcon from '@mui/icons-material/Face';
import TaskIcon from '@mui/icons-material/Task';
import ActivityPage from './History/ActivityPage';
// สร้างธีมสีสันสดใส
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
  },
});

function Profile() {
    const navigate = useNavigate();
    const { userProfile, avatarSrc, loading, error } = useFetchUserProfile();
    const [page, setPage] = useState('profile');

    const goSetting = () => {
        navigate('/setting');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const parseGoals = (goalsString) => {
        try {
            return JSON.parse(goalsString) || [];
        } catch (error) {
            console.error('Error parsing goals:', error);
            return [];
        }
    };

    const goals = parseGoals(userProfile?.goals);
  
    const ProfilePage = () => {
        return(
            <>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper',borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom color="primary">Personal Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Birthdate</Typography>
                                        <Typography variant="body1">
                                            {userProfile?.birthdate ? dayjs(userProfile.birthdate).format('MMMM D, YYYY') : 'Not set'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Estimated Death Date</Typography>
                                        <Typography variant="body1">
                                            {userProfile?.estimated_death_date ? dayjs(userProfile.estimated_death_date).format('MMMM D, YYYY') : 'Not set'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                                            goals
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                                            {goals.length > 0 ? (
                                                goals.map((goal, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={goal}
                                                        color="secondary"
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: '16px',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.9rem',
                                                            padding: '10px 15px',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                backgroundColor: 'secondary.main',
                                                                color: 'white',
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                            }
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                    No goals set yet. Dream big and add your aspirations!
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper',borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom color="primary">Life Calculator</Typography>
                                <LifeCalculator 
                                    initialBirthDate={userProfile?.birthdate}
                                    initialExpectedAge={userProfile?.estimated_death_date ? 
                                        dayjs(userProfile.estimated_death_date).diff(dayjs(userProfile.birthdate), 'year') : 
                                        undefined}
                                />
                            </Paper>

                            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper',borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom color="primary">Year Progress</Typography>
                                <YearProgress />
                            </Paper>
            </>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CheckLogin />
            <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Box elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Avatar
                                    src={avatarSrc} 
                                    alt="Profile"
                                    sx={{ width: 150, height: 150, margin: 'auto', border: '4px solid', borderColor: 'primary.main' }}
                                />
                                <Typography variant="h5" sx={{ mt: 2, color: 'primary.main' }}>
                                    {userProfile?.username || 'Username'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    "{userProfile?.motto || 'No motto set'}"
                                </Typography>
                                <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={goSetting}>
                                    Edit profile
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <Avatar sx={{ width: '3rem', height: '3rem', '&:hover': { backgroundColor: 'primary.main' }, backgroundColor: page === 'profile' ? 'primary.main' : undefined, cursor: 'pointer' }} onClick={() => setPage('profile')}><FaceIcon /></Avatar>
                                    <Avatar sx={{ width: '3rem', height: '3rem', '&:hover': { backgroundColor: 'primary.main' }, backgroundColor: page === 'activity' ? 'primary.main' : undefined, cursor: 'pointer' }} onClick={() => setPage('activity')}><TaskIcon /></Avatar>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {page === 'activity' ? <ActivityPage /> : <ProfilePage />}
                         
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Profile;
