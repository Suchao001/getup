import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons'; 
import { HostName } from '../script/HostName';

const IconDisplay = ({ iconId }) => {
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const response = await axios.get(`${HostName}/api/icons/${iconId}`);
        setIcon(response.data);
      } catch (error) {
        setError('Error fetching icon');
      }
    };

    fetchIcon();
  }, [iconId]);

  if (error) return <div>{error}</div>;
  if (!icon) return <div>Loading...</div>;

  const IconComponent = icons[icon.nameTouse];

  return (
    <div>
      {IconComponent ? (
        <FontAwesomeIcon icon={IconComponent} />
      ) : (
        <div>Icon not found {icon.name}</div>
      )}
    </div>
  );
};

export default IconDisplay;
