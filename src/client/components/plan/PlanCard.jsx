import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import './PlanCard.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import PlanModal from './PlanModal'; 

function PlanCard({ selectedDate }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const fetchPlans = async (date) => {
        setLoading(true);
        try {
            let response;
            if (date) {
                response = await axios.get(`${HostName}/api/plans/date/${date}`);
            } else {
                response = await axios.get(`${HostName}/api/plans`);
            }
            setPlans(response.data);
       
        } catch (error) {
            setPlans([]);
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans(selectedDate);
    }, [selectedDate]);

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

    const handleOpenPlanModal = (plan) => {
        setSelectedPlan(plan);
        setIsPlanModalOpen(true);
    };

    const handleClosePlanModal = () => {
        setSelectedPlan(null);
        setIsPlanModalOpen(false);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box >
            <Typography variant="h6" gutterBottom>
                {selectedDate ? `Plans for ${dayjs(selectedDate).format('MMMM D, YYYY')}` : 'All Plans'}
            </Typography>
            {plans.length === 0 ? (
                <Typography>No plans for this date.</Typography>
            ) : (
                <div className='card-container'>
                    {plans.map((plan) => (
                        <div 
                            className={`plan-card ${plan.is_complete ? 'completed' : ''} font1 gap`} 
                            style={{ backgroundColor: plan.color }}
                            key={plan.id}
                            onClick={() => handleOpenPlanModal(plan)}
                        >
                            <div className="plan-content">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {renderIcon(plan.nameTouse, plan.color)}
                                    <div className="plan-name" style={{ color:'white'}}>
                                        {plan.name}
                                    </div>
                                </div>
                                <div className='plan-date'>
                                    <CalendarMonthIcon />
                                    {plan.start_date} - {plan.end_date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedPlan && (
                <PlanModal
                    open={isPlanModalOpen}
                    onClose={handleClosePlanModal}
                    plan={selectedPlan}
                />
            )}
        </Box>
    );
}

export default PlanCard;
