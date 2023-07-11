import React, { useState } from 'react';

export type SwitchProps = {
  className?: string;
  defaultChecked?: boolean;
  label: string;
};

export const Switch: React.FC<SwitchProps> = ({ className = '', defaultChecked = false, label, ...props }) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="form-control">
      <label className="flex-nowrap whitespace-nowrap">{label}</label>
      <input
        type="checkbox"
        className={`toggle toggle-info my-auto ${className}`}
        onClick={() => setChecked(!checked)}
        defaultChecked={checked}
        {...props}
      />
    </div>
  );
};
