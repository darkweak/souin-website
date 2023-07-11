import React, { PropsWithChildren } from 'react';
import { ClassName } from 'types';

export const SimpleCard: React.FC<PropsWithChildren & ClassName> = ({ children, className }) => (
  <div
    className={`card bg-base-200/20 shadow-lg rounded-2xl h-full min-w-full flex items-center justify-center border-2 border-primary-content/20 ${className}`}
  >
    {children}
  </div>
);

export type cardProps = {
  text: string;
  title: string;
};
export const Card: React.FC<PropsWithChildren<cardProps>> = ({ children, text, title }) => (
  <SimpleCard className="hover:scale-105 transition-all hover:border-info/50">
    <div className="card-body text-center flex flex-col gap-4 items-center">
      {children}
      <h2 className="card-title font-bold font-sans text-2xl text-info/60">{title}</h2>
      <p>{text}</p>
    </div>
  </SimpleCard>
);
