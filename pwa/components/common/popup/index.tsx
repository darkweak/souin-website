//import { AllowedIcons} from 'components/common/icon';
import React from 'react';

export type AllowedVariantPopup = 'alert-success' | 'alert-error' | 'alert-ghost' | 'alert-info' | 'alert-warning';

type popupProps = {
  text: string;
  variant: AllowedVariantPopup;
};

export const Popup: React.FC<popupProps> = ({ text, variant }) => (
  <div className={`alert ${variant}`}>
    <span>{text}</span>
  </div>
);

export const InformationalAlert: React.FC<{ text: string }> = ({ text }) => (
  <div className="alert">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <span>{text}</span>
  </div>
);

export default Popup;
