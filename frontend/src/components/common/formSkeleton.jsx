import React from 'react';
import Skeleton from './skeleton';

const FormSkeleton = () => {
  return (
    <div className="col-md-6">
      <Skeleton width="200px" height="32px" className="mb-4" />
      
      <div className="card shadow-sm">
        <div className="card-body">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-3">
              <Skeleton width="80px" height="16px" className="mb-2" />
              <Skeleton width="100%" height="38px" rounded />
            </div>
          ))}
          
          <Skeleton width="100px" height="38px" rounded className="mt-3" />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
