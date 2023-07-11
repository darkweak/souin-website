import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavItemProps = {
  isActive?: (path: string) => boolean;
  path?: string;
  withLink?: boolean;
} & React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;

export const NavItem: React.FC<React.PropsWithChildren<NavItemProps>> = ({
  children,
  isActive,
  path = '/',
  withLink = true,
  ...rest
}) => {
  const pathname = usePathname();
  const active = isActive?.(pathname) ?? pathname === path ? 'active' : '';
  return (
    <li className="w-fit" {...rest}>
      {withLink ? (
        <Link href={path} className={`text-lg my-auto ${active}`}>
          {children}
        </Link>
      ) : (
        <span className={`text-lg my-auto ${active}`}>{children}</span>
      )}
    </li>
  );
};
