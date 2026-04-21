import React from 'react';

type Props = { width?: number; height?: number };

export const Grid: React.FC<Props> = ({ width = 10, height = 10 }) => {
  return (
    <div>
      <p>Grid: {width} x {height}</p>
    </div>
  );
};

export default Grid;
