import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Container, Grid, Card, Button, Typography, Avatar,  CardContent,Box, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckLogin from '../components/auth/CheckLogin';

function Profile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const goSetting = () => {
        navigate('/setting');
    };
    const getUser = user || {};
    const avatarSrc = getUser.img || '/path-to-default-avatar.jpg'; 

    return (
        <>
            <CheckLogin />
            <Container> 
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item md={3} xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={avatarSrc} 
                                alt="Profile"
                                sx={{ width: 120, height: 120 }}
                            />
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                {getUser.username || 'Username'} {/* Fallback to 'Username' if username is not available */}
                            </Typography>
                            <Button variant="outlined" sx={{ mt: 2 }} onClick={goSetting}>
                                Edit profile
                            </Button>
                         
                        </Box>
                    </Grid>
                    <Grid item md={9} xs={12}>
                        <Typography variant="h6">Tasks</Typography>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {['test', 'BlockChain subject', 'Project', 'python-blockchain'].map(repo => (
                                <Grid item md={6} xs={12} key={repo}>
                                    <Card sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{repo}</Typography>
                                            <Typography variant="body2" color="textSecondary">Public</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Contributions</Typography>
                            {/* Add contribution graph component here */}
                            <Box sx={{ mt: 2 }}>
                                {/* Placeholder for contribution graph */}
                                <Typography variant="body2">...........</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Profile;
