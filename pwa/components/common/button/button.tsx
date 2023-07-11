import React from 'react';
import { AllowedVariant } from 'types';
import { AllowedIcons, Icon } from '../icon';

type buttonIcon = { icon: AllowedIcons; position: 'left' | 'right' };
type buttonText = { text?: string };
type additionalTypes = { variant?: AllowedVariant } & (buttonText | (buttonText & buttonIcon) | buttonIcon);
export type buttonType = additionalTypes &
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Base: React.FC<React.PropsWithChildren<buttonType>> = ({ variant = 'info', type, className = '', ...props }) => (
  <button
    type={type}
    className={`btn border-2 font-extrabold ${computeClassFromProps({ variant })} ${className}`}
    {...props}
  >
    {(props as buttonIcon).icon && (props as buttonIcon).position !== 'right' ? (
      <Icon name={(props as buttonIcon).icon} className="text-inherit" size={24} />
    ) : null}
    {(props as buttonText).text ?? ''}
    {(props as buttonIcon).icon && (props as buttonIcon).position === 'right' ? (
      <Icon name={(props as buttonIcon).icon} className="text-inherit" size={24} />
    ) : null}
    {props.children}
  </button>
);

export const OutlinedButton: React.FC<buttonType> = (props) => (
  <Base {...props} className={`btn-outline ${props.className}`} />
);

export const computeClassFromProps = ({ variant }: Omit<additionalTypes, 'text'>): string => {
  switch (variant) {
    case 'info':
      return 'btn-info';
    case 'danger':
      return 'btn-error';
    case 'success':
      return 'btn-success';
    case 'warning':
      return 'btn-warning';
    case 'ghost':
      return 'btn-ghost';
  }

  return '';
};

export const BaseButton: React.FC<buttonType> = (props) => {
  let textColor = '';
  switch (props.variant ?? 'info') {
    case 'info':
      textColor = 'hover:text-info';
      break;
    case 'danger':
      textColor = 'hover:text-error';
      break;
    case 'success':
      textColor = 'hover:text-success';
      break;
    case 'warning':
      textColor = 'hover:text-warning';
      break;
    case 'ghost':
      textColor = 'hover:text-ghost';
      break;
  }

  return <Base {...props} className={`${props.className} text-base-100 hover:bg-transparent ${textColor}`} />;
};
