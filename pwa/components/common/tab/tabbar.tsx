import Link from 'next/link';
import React, { useMemo, useState } from 'react';

type tabProps = {
  name: string;
  TabItem: React.ReactNode;
};

type tabbarProps = {
  className?: string;
  defaultTab?: number;
  tabs: ReadonlyArray<tabProps>;
};

export const Tabbar: React.FC<tabbarProps> = ({ className = '', defaultTab = 0, tabs }) => {
  const [selected, setSelected] = useState(defaultTab);
  const tabNames = useMemo(() => tabs.map((tab) => tab.name), [tabs]);
  const TabItem = useMemo(() => tabs[selected].TabItem, [tabs, selected]);

  return (
    <>
      <div className="flex">
        <div className={`tabs tabs-boxed ${className}`}>
          {tabNames.map((name, index) => (
            <Link
              href="#"
              onClick={() => {
                setSelected(index);
              }}
              key={index}
              className={`tab tab-lg ${index === selected ? 'tab-active' : ''}`}
            >
              <span className={`text-xl font-bold ${index === selected ? 'text-base-100' : ''}`}>{name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-base-200/50 p-8 mt-4 rounded-xl">{TabItem}</div>
    </>
  );
};
