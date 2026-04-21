import React from 'react';

type Props = { value?: string; onChange?: (v: string) => void };

export const Editor: React.FC<Props> = ({ value = '', onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      style={{ width: '100%', height: 200 }}
    />
  );
};

export default Editor;
