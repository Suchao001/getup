import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { HostName } from '../../script/HostName';

function PlanCard() {
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true); // Handle loading state

    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${HostName}/api/plans`);
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const renderIcon = (iconTouse, color = 'gray') => { // Added default color
        if (iconTouse && ficons[iconTouse]) {
            return (
                <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
                    <FontAwesomeIcon icon={ficons[iconTouse]} />
                </Avatar>
            );
        }
        return <Avatar sx={{ bgcolor: color, width: 40, height: 40 }} />;
    };

    if (loading) {
        return <Typography>Loading...</Typography>; // Render a loading state
    }

    return (
        <>
            {plans && (
                <Grid container spacing={2}>
                    {plans.map((plan) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id}> {/* Corrected key placement */}
                            <Tooltip title={plan.description || "No description available"} arrow>
                                <Card>
                                    <CardContent>
                                        <Grid container alignItems="center">
                                            <Grid item xs={3}>
                                                {renderIcon(plan.nameTouse,plan.color)}
                                            </Grid>
                                            <Grid item xs={9} display="flex" alignItems="center">
                                                <Typography variant="h5">{plan.name}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
}

export default PlanCard;
