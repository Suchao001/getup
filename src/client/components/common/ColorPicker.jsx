import React from 'react';
import { ColorPicker } from 'antd';

const CustomColorPicker = ({ color, onChange }) => {

  const handleColorChange = (newColor) => {
    
    const formattedColor = newColor.toHexString().substring(0, 7);
    onChange(formattedColor);
  };
  return (
    <div style={{ zIndex: 1500 }}>
      <ColorPicker
        value={color}
        onChange={handleColorChange}
        presets={[
          {
            label: 'Recommended',
            colors: [
              '#000000',
              '#F5222D',
              '#FA8C16',
              '#FADB14',
              '#8BBB11',
              '#52C41A',
              '#13A8A8',
              '#1677FF',
              '#2F54EB',
              '#722ED1',
              '#EB2F96',
            ],
          },
        ]}
        getPopupContainer={(trigger) => trigger.parentElement} // Ensure it appends to the correct DOM node
      />
    </div>
  );
};

export default CustomColorPicker;
