import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import {goodAlert,badAlert,deleteConfirm} from '../../script/sweet';
import { useSwitch } from '../../context/SwitchContext';


const PlanDrawer = ({ open, onClose, plans, selectedDate, onAddPlan, setIsEdit, setSelectedPlan, setPopupOpen }) => {
  const {toggleSwitch} = useSwitch();
  const setToEdit = (plan) => {
    setIsEdit(true);
    setSelectedPlan(plan);
    setPopupOpen(true);
    toggleSwitch();
  };
  

  const handleDeletePlan = async (plan) => {
    const result = await deleteConfirm('Are you sure you want to delete this plan?', 'This action cannot be undone.');
    try {
     if(result){
      const response = await axios.delete(`${HostName}/api/plans/delete/${plan.id}`, { withCredentials: true });
      if(response.status === 200){
        goodAlert('Plan deleted successfully');
        toggleSwitch();
      }
     }
     return;
   
    } catch (error) {
      badAlert('Error deleting plan:', error.message);
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} style={{zIndex: 1000,width:'100vh'}}>
      <div style={{ padding: '20px' }}>
        <Typography variant="h6">Plans for {selectedDate}</Typography>
        <IconButton onClick={onAddPlan} aria-label="add plan">
          <AddIcon />
        </IconButton>

        {plans.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No plans for this date.
          </Typography>
        ) : (
          <List>
            {plans.map((plan) => (
              <div key={plan.id}>
                <ListItem>
                  <ListItemText primary={plan.name} secondary={plan.description || 'No description'} />
                  <IconButton aria-label="edit" onClick={() => setToEdit(plan)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeletePlan(plan)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </div>
    </Drawer>
  );
};

export default PlanDrawer;
