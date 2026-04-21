import React from 'react';

type Props = { onRun?: () => void };

export const Controls: React.FC<Props> = ({ onRun }) => {
  return (
    <div>
      <button onClick={onRun}>Run</button>
    </div>
  );
};

export default Controls;
