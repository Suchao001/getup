import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { HostName } from '../../script/HostName';
import {goodAlert,badAlert} from '../../script/sweet';



const PlanDrawer = ({ open, onClose, plans, selectedDate, onAddPlan, setIsEdit, setSelectedPlan, setPopupOpen }) => {
  const setToEdit = (plan) => {
    setIsEdit(true);
    setSelectedPlan(plan);
    setPopupOpen(true);
  };
  

  const handleDeletePlan = async (plan) => {
    try {
      const response = await axios.delete(`${HostName}/api/plans/delete/${plan.id}`, { withCredentials: true });
      if(response.status === 200){
        goodAlert('Plan deleted successfully');
      }
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
