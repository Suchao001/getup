import React, { useState, useEffect } from 'react';
import { Grid, Avatar, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import './PlanCard.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function PlanCard() {
    const [plans, setPlans] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${HostName}/api/plans`);
            setPlans(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const renderIcon = (iconTouse, color = 'gray') => {
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
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            {plans && (
                    <div className='card-container'>
                    {plans.map((plan) => (
                        <div 
                            className={`plan-card ${plan.is_complete ? 'completed' : ''} font1 gap`} 
                            style={{ backgroundColor: plan.color }}
                            key={plan.id}
                        >
                            <div className="plan-content">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {renderIcon(plan.nameTouse, plan.color)}
                                    <div className="plan-name">
                                        {plan.name}
                                    </div>
                                </div>
                                <div className='plan-date '>
                                        <CalendarMonthIcon />
                                        {plan.start_date} - {plan.end_date}
                                    </div>
                            </div>
                        </div>
                    ))}
                    </div>
            
            )}
        </>
    );
}

export default PlanCard;
