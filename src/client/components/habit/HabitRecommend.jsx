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

    const imgUrl= [
        'https://img.freepik.com/free-vector/man-running-with-blue-flowing-wave_1017-9202.jpg?t=st=1727197213~exp=1727200813~hmac=8125f9b0802d8cb04684d466b9111efbec0f2c5f488174e757a1be517dd4f78c&w=740',
        'https://img.freepik.com/free-vector/business-target-dartboard-background-corporate-aim_1017-54557.jpg?t=st=1727197629~exp=1727201229~hmac=24d6ab87093e256d73067952ecc0fd40bb3c72358cce6302867b3c09e5676fcb&w=996',
        'https://img.freepik.com/premium-photo/cake-making-background-with-womans-hands-sprinkled-flour-forming-heart_941742-7373.jpg?w=826',
        'https://img.freepik.com/free-vector/flat-illustration-world-sleep-day_23-2151216583.jpg?t=st=1727197848~exp=1727201448~hmac=81e2a1aab029a832ebea233e7122803521f0c311cb92ed95447411dbc4f5f755&w=740',
        'https://img.freepik.com/free-vector/stretching-exercises-concept-illustration_114360-8922.jpg?t=st=1727197936~exp=1727201536~hmac=a66ed78f4106b57436432ea539ece2f78cff7d8b5390894d1d0c30d0879f44fb&w=996',
        'https://img.freepik.com/free-vector/cleaning-company-brochures_1284-39252.jpg?t=st=1727197977~exp=1727201577~hmac=84f6658cb1a62fab06011745b75428698cf4a4f57ffd5afd91c13236e7559536&w=996',
    ]
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

    const RecommendCard = ({ recommendCategory, index }) => {
        const handleClick = (id) => {
            fetchRecommendHabit(id);
            console.log(id);
            setOpenHabit(true);
        };

        return (
            <div 
                className='recommend-card' 
                style={{ 
                    backgroundColor: recommendCategory.color,
                    backgroundImage: `url(${imgUrl[index]})` 
                }} 
                onClick={() => handleClick(recommendCategory.id)}
            >
                <h3 style={{color:'white',backgroundColor:'rgba(0,0,0,0.5)',padding:10,borderRadius:10,width:'fit-content'}}>{recommendCategory.name}</h3>
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
            <CustomModal open={open} onClose={handleClose}>
                <div className='recommend-card-container'>
                    {recommendCategory.map((item, index) => (
                        <RecommendCard key={index} recommendCategory={item} index={index} />
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