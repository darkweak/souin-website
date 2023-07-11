import React from 'react';

type titleProps = {
  title: string;
  className?: string;
};

export const Title: React.FC<titleProps> = ({ title, className }) => (
  <div className="m-auto">
    <h1
      className={`inline relative group font-black text-4xl sm:text-5xl lg:text-6xl w-fit mb-4 m-auto box-decoration-clone ${className}`}
    >
      {title}
    </h1>
  </div>
);
