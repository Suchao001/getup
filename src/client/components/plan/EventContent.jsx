import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-regular-svg-icons';


const renderEventContent = (eventInfo) => {
    const { title, extendedProps, backgroundColor } = eventInfo.event;
    const priority = extendedProps.priority;
    const icon = extendedProps.icon;

    return (
        <div className="fc-event-main-frame" style={{
            backgroundColor,
            color: '#fff',
            padding: '2px 4px',
            borderRadius: '0px', // Adjust border radius here
            fontSize: '0.85em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none' // Ensure no underline
          }}>
        <FontAwesomeIcon 
          icon={ficons[icon]} 
          style={{ marginRight: '5px' }} 
        />
        <span>{title}</span>
        {priority}

        {priority == '1' && (
          <FontAwesomeIcon 
            icon={ficons['faStar']} 
            style={{ marginLeft: '5px', color: 'white', fontSize: '0.5rem' }} 
          />
        )}
        {priority == '2' && (
          <FontAwesomeIcon 
            icon={faStar} 
            style={{ marginLeft: '5px', color: 'white', fontSize: '0.5rem' }} 
          />
        )}
      </div>
    );
  };

  export default renderEventContent;