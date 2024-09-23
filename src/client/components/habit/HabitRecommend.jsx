import React, { useState, useEffect } from 'react'
import CustomModal from '../common/CustomModal' 
import { Button } from '@mui/material'
import axios from 'axios'
import {HostName} from '../../script/HostName'
import './HabitRecommend.css'
import NestedCustomModal from '../common/CustomModal'
import { ArrowBack } from '@mui/icons-material';
import HabitForm from './HabitForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; 



const HabitRecommend = ({fetchHabits}) => {
    const [open, setOpen] = useState(false);
    const [openHabit, setOpenHabit] = useState(false);
    const [recommendCategory, setRecommendCategory] = useState([]);
    const [recommendHabit, setRecommendHabit] = useState([]);
    const [openHabitForm, setOpenHabitForm] = useState(false);
    const [habit, setHabit] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCloseHabit = () => setOpenHabit(false);
    const handleCloseHabitForm = () => setOpenHabitForm(false);

    const fetchRecommendCategory = async () => {
        try {
            const res = await axios.get(`${HostName}/api/HabitRecommendCategory`, { withCredentials: true });
            setRecommendCategory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRecommendCategory();
    }, []);

    const fetchRecommendHabit = async (id) => {
        try {
            const res = await axios.get(`${HostName}/api/HabitRecommendHabit/${id}`, { withCredentials: true });
            setRecommendHabit(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const RecommendCard = ({ recommendCategory }) => {
        const handleClick = (id) => {
            fetchRecommendHabit(id);
            console.log(id);
            setOpenHabit(true);
        };

        return (
            <div className='recommend-card' style={{backgroundColor:recommendCategory.color,color:'#fff'}} onClick={() => handleClick(recommendCategory.id)}>
                <h3>{recommendCategory.name}</h3>
            </div>
        );
    };

    const RecommendHabit = ({ recommendHabit, setOpenHabit, setOpenCategory }) => {
        const handleClick = (id) => {
            fetchRecommendHabit(id);
    
            setHabit(recommendHabit);
            setOpenHabit(false);
            setOpenCategory(false);
            setOpenHabitForm(true);
        };

        return (
            <div className='recommend-habit'  style={{backgroundColor:recommendHabit.color}}   onClick={() => handleClick(recommendHabit.id)}>
                <div className='recommend-habit-icon' >
                    <FontAwesomeIcon icon={ficons[recommendHabit.nameToUse]} />
                </div>
                <h3>{recommendHabit.name}</h3>
            </div>
        );
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Habit Recommendation
            </Button>
            <CustomModal title="Habit Recommend" open={open} onClose={handleClose}>
                <div className='recommend-card-container'>
                    {recommendCategory.map((item, index) => (
                        <RecommendCard key={index} recommendCategory={item} />
                    ))}
                </div>
            </CustomModal>
            
            <NestedCustomModal  open={openHabit} onClose={handleCloseHabit}>
                <ArrowBack sx={{position:'absolute', top:30, left:20,cursor:'pointer', '&:hover':{color:'#333'}}} onClick={handleCloseHabit} />
                <h2 className='recommend-habit-title' style={{marginTop:30}}>
                    Habit Recommendation    
                </h2>
                <div className='recommend-habit-container'>
                    {recommendHabit.map((item, index) => (
                        <RecommendHabit key={index} recommendHabit={item} setOpenHabit={setOpenHabit} setOpenCategory={setOpen} />
                    ))}
                </div>
            </NestedCustomModal>
            <CustomModal title="Habit Recommend" open={openHabitForm} onClose={handleCloseHabitForm}>
                <HabitForm recommendHabit={habit} fetchHabits={fetchHabits}/>
            </CustomModal>
        </>
    );
};

export default HabitRecommend;