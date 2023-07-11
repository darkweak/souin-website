import React from 'react';
import { InputBase, inputType } from './input';
import { MultiSelectProps, Select, SelectProps } from './select';
import { Group, GroupProps } from './group';
import { Switch, SwitchProps } from './switch';
import { Iterator, IteratorProps } from './iterator';

type Selectable = { type: 'select' } & (
  | MultiSelectProps
  | (SelectProps & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>)
);
export type Iterable = { type: 'iterator' } & IteratorProps;
export type Groupable = { type: 'group' } & GroupProps;
export type Switchable = { type: 'switch' } & SwitchProps;
export type InputGuesserProps = Selectable | Switchable | Groupable | inputType;

export const InputGuesser: React.FC<InputGuesserProps> = ({ type, ...props }) => {
  switch (type) {
    case 'iterator':
      return <Iterator {...(props as Iterable)} />;
    case 'group':
      return <Group {...(props as Groupable)} />;
    case 'select':
      return <Select {...(props as Selectable)} />;
    case 'switch':
      return <Switch {...(props as Switchable)} />;
    default:
      return <InputBase type={type} {...(props as inputType)} />;
  }
};
