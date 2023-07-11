import React from 'react';

const SubtitleForm: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="prose md:prose-xl">
    <h2>{children}</h2>
  </div>
);

export default SubtitleForm;
