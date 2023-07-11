import React, { useState } from 'react';

export const Collapse: React.FC<React.PropsWithChildren<{ title: React.ReactNode }>> = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`collapse collapse-arrow border border-base-300 bg-base-200/20 rounded-box ${
        open ? 'collapse-open shadow-lg' : 'collapse-close'
      }`}
    >
      <div
        className="collapse-title text-xl font-medium flex md:justify-between gap-x-4 pl-4 pr-10 md:px-10 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {title}
      </div>
      <div className="collapse-content px-2 md:px-4 justify-between gap-y-4 items-center overflow-x-scroll">
        {children}
      </div>
    </div>
  );
};
