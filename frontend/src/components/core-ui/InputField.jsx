// InputField.jsx
import React from 'react';
import '../../css/InputField.css'; // Correct relative import

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, error }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name} className="input-label">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-field--error' : ''}`}
      />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default InputField;