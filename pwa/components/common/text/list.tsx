import React from 'react';

type listPropsType = {
  items: ReadonlyArray<string>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;

export const List: React.FC<listPropsType> = ({ items, ...props }) => (
  <ul {...props}>{items && items.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
);
