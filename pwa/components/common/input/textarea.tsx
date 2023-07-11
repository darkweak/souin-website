import React from 'react';

export const Textarea: React.FC<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = ({ ...props }) => {
  return <textarea className="form-control textarea w-full h-full textarea-bordered" {...props} />;
};
