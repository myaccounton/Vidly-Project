import React from 'react';

const Skeleton = ({ 
  width, 
  height, 
  className = '', 
  rounded = false,
  circle = false 
}) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: circle ? '50%' : rounded ? '0.25rem' : '0',
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
