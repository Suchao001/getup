import React from 'react';
import { Popover, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons'; 

const IconPicker = ({ icons, icon, onSelectIcon, onSelectIconId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleIconSelect = (selectedIcon, selectedIconId) => {
    onSelectIcon(selectedIcon);
    onSelectIconId(selectedIconId);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton color="primary" onClick={handleIconClick}>
        <EditIcon />
      </IconButton>
      <Popover
        style={{ maxWidth: '800px', minWidth: '300px' }} // Set minWidth here
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="p-2">
          <Grid container spacing={1}>
            {icons.map((iconItem) => {
              const IconComponent = ficons[iconItem.nameTouse];
              return (
                <Grid item key={iconItem.id}>
                  <IconButton onClick={() => handleIconSelect(iconItem.nameTouse, iconItem.id)}>
                    <FontAwesomeIcon icon={IconComponent} /> 
                  </IconButton>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Popover>
    </div>
  );
};

export default IconPicker;
