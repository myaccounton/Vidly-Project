import React from 'react';
import Skeleton from './skeleton';
import TableSkeleton from './tableSkeleton';

const MoviesSkeleton = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Skeleton width="150px" height="32px" className="mb-2" />
          <Skeleton width="200px" height="16px" />
        </div>
        <Skeleton width="120px" height="38px" rounded />
      </div>

      <div className="row">
        <div className="col-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <Skeleton width="80px" height="20px" className="mb-3" />
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="mb-2">
                  <Skeleton width="100%" height="40px" rounded />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="mb-3">
                <Skeleton width="100%" height="38px" rounded />
              </div>
              <TableSkeleton rows={8} columns={5} />
            </div>
          </div>
          <div className="d-flex justify-content-center mb-4">
            <Skeleton width="300px" height="40px" rounded />
          </div>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <Skeleton width="100%" height="200px" rounded />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesSkeleton;
