import React from 'react';
import { InputGuesser, InputGuesserProps } from './guesser';

export type GroupProps = {
  className?: string;
  label?: string;
  name?: string;
  inputs: ReadonlyArray<InputGuesserProps>;
  prefix?: string;
};

export const Group: React.FC<GroupProps> = ({ className = 'flex gap-4', label, name = '', inputs, prefix = '' }) => {
  return (
    <div className="form-control w-full">
      {label && <label className="text-xl font-bold">{label}</label>}
      <div className={className}>
        {inputs.map((inputProps, id) => (
          <InputGuesser key={id} name={`${prefix ? `${prefix}.` : ''}${name}`} {...inputProps} />
        ))}
      </div>
    </div>
  );
};
