// src/components/CardSettings.jsx

import React from 'react';

const CardSettings = ({ visibleFields, setVisibleFields }) => {
  const toggleField = (field) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h4>Campos visíveis no card:</h4>
      {Object.keys(visibleFields).map((field) => (
        <label key={field} style={{ display: 'block', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={visibleFields[field]}
            onChange={() => toggleField(field)}
          />
          {' '}
          {field.replace('_', ' ')}
        </label>
      ))}
    </div>
  );
};

export default CardSettings;
