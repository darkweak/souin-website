import React from 'react';
import { useRedirectIfLogged } from 'context';
import { SigninForm } from 'components/user';
import { NextPage } from 'next';
import Head from 'components/layout/head';

const Signin: NextPage = () => {
  useRedirectIfLogged();

  return (
    <>
      <Head title="Authentication" />
      <SigninForm />
    </>
  );
};

export default Signin;
