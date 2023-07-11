import React, { FC, useState } from 'react';
import Link from 'next/link';
import { useDispatchAuth, useIsAuth } from 'context';
import { BaseButton, OutlinedButton, buttonType } from 'components/common/button';
import { Blur } from 'components/common/block';
import { ROUTES } from 'routes';
import { Token } from 'storage';
import { NavItem } from './item';

type commonElementProps = {
  text: string;
  link: string;
  isActive?: (v: string) => boolean;
};

const loggedOut: ReadonlyArray<commonElementProps & buttonType> = [
  {
    text: 'Register',
    link: ROUTES.REGISTER,
    className: 'btn-outline',
    variant: 'ghost',
  },
  {
    text: 'Sign in',
    link: ROUTES.SIGN_IN,
    variant: 'success',
  },
];

const loggedIn: ReadonlyArray<commonElementProps> = [
  {
    text: 'Domains',
    link: '/domains',
    isActive: (pathname) => pathname.includes('/domains') || pathname.includes('/configurations'),
  },
  {
    text: 'Profile',
    link: '/profile',
  },
];

const LoggedOutItems: React.FC = () => (
  <>
    {loggedOut.map(({ link, text, ...props }, id) => (
      <Link href={link} key={id} className="w-fit">
        {props.className?.includes('outline') ? (
          <OutlinedButton text={text} {...props} />
        ) : (
          <BaseButton text={text} {...props} />
        )}
      </Link>
    ))}
  </>
);

const Logout = () => {
  const setConnected = useDispatchAuth();

  return (
    <NavItem
      isActive={() => false}
      withLink={false}
      onClick={() => {
        new Token().delete();
        setConnected(false);
      }}
    >
      Logout
    </NavItem>
  );
};

const LoggedInItems: React.FC = () => (
  <>
    {loggedIn.map(({ link, text, ...props }, id) => (
      <NavItem key={id} path={link} {...props}>
        {text}
      </NavItem>
    ))}
  </>
);

const CommonNavbarItem: React.FC = () => <NavItem path="/terms-of-service">Terms of service</NavItem>;

const ResponsiveMenuItems: React.FC = () => {
  const connected = useIsAuth();

  return connected ? (
    <>
      <LoggedInItems />
      <CommonNavbarItem />
      <Logout />
    </>
  ) : (
    <>
      <CommonNavbarItem />
      <LoggedOutItems />
    </>
  );
};

const Headband = () => (
  <div className="beta-headband backdrop-blur-sm absolute bg-warning/80 absolute text-accent-content font-bold text-xl -z-10 text-center px-4 top-full left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-md">
    Currently in BETA
  </div>
);

export const Navbar: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative shadow transition-all transition-duration-300 sticky top-0 z-10">
      <Blur className="lg:px-8 lg:m-auto">
        <Headband />
        <div className="w-full navbar">
          <div className="flex-none lg:hidden absolute">
            <label className="btn btn-square btn-ghost" onClick={() => setOpen(!open)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </label>
          </div>
          <div className="navbar-start m-auto">
            <Link href="/" className="text-2xl btn btn-ghost normal-case m-auto lg:m-0">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="auto" height="100%" viewBox="10 10 80 80">
                <g>
                  <path
                    d="M 34.79 77.89 Q 90 70 50 50 Q 10 30 65.21 22.11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeMiterlimit="10"
                    pointerEvents="stroke"
                  />
                  <path
                    d="M 28.85 78.74 L 36.21 73.64 L 34.79 77.89 L 37.34 81.56 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeMiterlimit="10"
                    pointerEvents="all"
                  />
                  <path
                    d="M 71.15 21.26 L 63.79 26.36 L 65.21 22.11 L 62.66 18.44 Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeMiterlimit="10"
                    pointerEvents="all"
                  />
                </g>
              </svg>
            </Link>
          </div>
          <div className="navbar-end hidden lg:flex w-full">
            <ul className="menu menu-horizontal px-1 gap-4">
              <ResponsiveMenuItems />
            </ul>
          </div>
        </div>
        <div className={`px-4 pb-2 flex ${!open ? 'h-0 hidden' : 'h-full'} lg:hidden`}>
          <ul className="menu gap-2">
            <ResponsiveMenuItems />
          </ul>
        </div>
      </Blur>
    </nav>
  );
};

export default Navbar;
