import React, { useState, useMemo } from 'react';
import { Modal, Box, Typography, IconButton, Paper, Fade, Backdrop, ThemeProvider, createTheme, Tooltip ,Button} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import { CalendarToday } from '@mui/icons-material';
import CustomModal from '../common/CustomModal';
import axios from 'axios';
import { badAlert, goodAlert, deleteConfirm } from '../../script/sweet';
import { HostName } from '../../script/HostName';
import './PlanModal.css';
import { useNavigate } from 'react-router-dom';
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '80%',
    md: 500,
  },
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const PlanModal = ({ open, onClose, plan,setUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClose = () => setEditOpen(false);
  const navigate = useNavigate();

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: plan.color,
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: plan.color,
      },
    },
  }), [plan.color]);

  const planDetailsStyle = {
    border: `1px solid ${plan.color}`,
    padding: '15px',
    borderRadius: '8px',
    boxShadow: `0 2px 10px ${plan.color}40`,
    marginBottom: '20px',
  };

  console.log(plan);
  const handleDelete = async () => {
    try {
      const isConfirmed = await deleteConfirm('Delete Plan', 'Are you sure you want to delete this plan?');
      if (!isConfirmed) return;
      const res = await axios.delete(`${HostName}/api/plans/delete/${plan.id}`, { withCredentials: true });
      goodAlert('Plan deleted successfully');
      onClose();
      setUpdate(true);
    } catch (error) {
      badAlert(error.response?.data?.message || error.message);
    }
  };

  const navigateCalendar = (date) => {
    navigate(`/calendar?date=${date}`);
  };

  const priorityColor = useMemo(() => {
    switch (plan.priority) {
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'green';
      default:
        return 'gray';
    }
  }, [plan.priority]);

  const priorityTooltip = useMemo(() => {
    switch (plan.priority) {
      case 1:
        return 'Highest priority';
      case 2:
        return 'Medium priority';
      case 3:
        return 'Low priority';
      default:
        return 'Unknown priority';
    }
  }, [plan.priority]);

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper sx={modalStyle} className="plan-modal">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <IconButton onClick={onClose} edge="start" aria-label="close" className="back-button">
                <ArrowBack />
              </IconButton>
              <Box>
                <IconButton onClick={handleDelete} aria-label="delete" className="delete-button">
                  <Delete />
                </IconButton>
              </Box>
            </Box>

            <CustomModal open={editOpen} onClose={handleEditClose}>
          
            </CustomModal>

            <Box mb={4} className="plan-header">
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <FontAwesomeIcon
                  icon={ficons[plan.nameTouse || 'faUser']}
                  style={{ fontSize: '2.5rem', color: plan.color }}
                />
                <Typography variant="h4" fontWeight="bold" className="plan-name" style={{ color: plan.color }}>
                  {plan.name}
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={priorityTooltip}>
                    <Typography variant="body1" style={{ color: priorityColor, fontWeight: 'bold' }}>
                      Priority: {plan.priority}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            <Box className="plan-section" style={planDetailsStyle}>
              <Typography variant="h6" fontWeight="bold" mb={2} style={{ color: plan.color }}>
                PLAN DETAILS
              </Typography>
              <Typography variant="body1" mb={2} style={{ color: `${plan.color}CC` }}>
                {plan.details || "No details available"}
              </Typography>
            </Box>

            <Box className="plan-section" style={planDetailsStyle}>
              <Typography variant="h6" fontWeight="bold" mb={2} style={{ color: plan.color }}>
                DATE AND TIME  <Button
                startIcon={<CalendarToday />}
                color="primary"
                variant="outlined"
                className="calendar-button"
                onClick={() => navigateCalendar(plan.start_date)}
              >
                See calendar
              </Button>
              </Typography>

              <Typography variant="body1" mb={2} style={{ color: `${plan.color}CC` }}>
                Start: {plan.start_date} {plan.start_time}
              </Typography>
              <Typography variant="body1" mb={2} style={{ color: `${plan.color}CC` }}>
                End: {plan.end_date} {plan.end_time}
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default PlanModal;