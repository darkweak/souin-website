import React, { useCallback, useRef, useState } from 'react';
import { Icon } from 'components/common/icon';
import useOnClickOutside from 'hooks/useClickOutside';
import { ClassName } from 'types';

type ChipSelectProps = {
  name: string;
  onClick: () => void;
};
const ChipSelect: React.FC<ChipSelectProps> = ({ name, onClick }) => {
  return (
    <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-base border border-success">
      <div className="text-xs font-normal leading-none max-w-full flex-initial">{name}</div>
      <div className="flex flex-auto flex-row-reverse">
        <Icon onClick={onClick} size={12} name="x" className="cursor-pointer hover:text-teal-400 rounded-full ml-2" />
      </div>
    </div>
  );
};

export type option = {
  name: string;
  value: string;
};
type OptionProps = option & {
  onClick: () => void;
};
const Option: React.FC<OptionProps> = ({ name, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer w-full rounded-t border-b border-base-300 hover:bg-base-200">
      <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
        <div className="w-full items-center flex">
          <div className="mx-2 leading-6">{name}</div>
        </div>
      </div>
    </div>
  );
};

export type MultiSelectProps = {
  dynamic?: boolean;
  label: string;
  name?: string;
  options: ReadonlyArray<option>;
  placeholder?: string;
  required?: boolean;
  selectedOptions?: ReadonlyArray<option>;
  handleChange?: (value: ReadonlyArray<option>, additional?: { iterationKey?: string }) => void;
};

export const MultiSelect: React.FC<MultiSelectProps & ClassName> = ({
  className = 'flex flex-col items-center relative w-full',
  dynamic,
  label,
  options,
  placeholder,
  required,
  selectedOptions = [],
  handleChange,
}) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    setOpen(false);
  });

  const addChoice = useCallback(
    (choice: option) => {
      handleChange?.([...selectedOptions, choice]);
    },
    [handleChange, selectedOptions]
  );
  const removeChoice = useCallback(
    (choice: option) => {
      handleChange?.(selectedOptions.filter((c) => c.value !== choice.value));
    },
    [handleChange, selectedOptions]
  );

  return (
    <div className={className} ref={ref}>
      <div className="w-full h-full form-control" onClick={() => setOpen(true)}>
        <label>
          {label}
          {required && ' *'}
        </label>
        <div className="input mt-auto p-1 flex input-bordered">
          <div className="flex flex-auto flex-wrap">
            {selectedOptions.map((choice, id) => (
              <ChipSelect key={id} name={choice.name} onClick={() => removeChoice(choice)} />
            ))}
            <div className="flex-1">
              <input
                onChange={({ target: { value } }) => setValue(value)}
                value={value}
                placeholder={!selectedOptions.length ? placeholder : ''}
                className="h-full w-full input w-full rounded-lg focus:outline-none p-1 px-4 border-0"
              />
            </div>
          </div>
          <div className="w-8 py-1 pl-2 pr-1 border-l flex items-center">
            <Icon className="text-base-content" size={16} name={open ? 'chevron-up' : 'chevron-down'} />
          </div>
        </div>
      </div>
      {open && (
        <div className="absolute shadow top-full bg-base-100 z-40 w-full left-0 rounded max-h-select overflow-y-auto">
          <div className="flex flex-col w-full">
            {dynamic && value !== '' && (
              <Option
                name={`Insert new ${value} tag`}
                value={value}
                onClick={() => {
                  addChoice({
                    name: value,
                    value,
                  });
                  setValue('');
                }}
              />
            )}
            {options
              .filter((o) => {
                return (
                  o.name.toLowerCase().includes(value.toLowerCase()) &&
                  !selectedOptions.some((c) => c.value === o.value)
                );
              })
              .map((o, id) => (
                <Option
                  key={id}
                  {...o}
                  onClick={() => {
                    addChoice(o);
                    setValue('');
                  }}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export type SelectProps = {
  label: string;
  options: ReadonlyArray<option>;
} & (
  | { isMultiple?: false; selectedOption?: option }
  | {
      isMultiple: true;
      selectedOptions?: ReadonlyArray<option>;
      handleChange?: (value: ReadonlyArray<option>, additional?: { iterationKey?: string }) => void;
    }
);

export const Select: React.FC<
  SelectProps & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
> = ({ className, isMultiple, label, name, options, placeholder, ...props }) =>
  isMultiple === true ? (
    <MultiSelect
      className={className}
      label={label}
      name={name}
      options={options}
      placeholder={placeholder}
      {...props}
    />
  ) : (
    <div className={`form-control gap-y-1 ${className ?? ''}`}>
      <label htmlFor={name}>{label}</label>
      <select
        className="select w-full"
        defaultValue={props.defaultValue ?? placeholder}
        name={name}
        id={name}
        {...props}
      >
        {placeholder && <option disabled>{placeholder}</option>}
        {options.map(({ name, value }, id) => (
          <option key={id} value={value}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
