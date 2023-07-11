import React from 'react';
import { RegisterForm } from 'components/user';
import { NextPage } from 'next';
import { useRedirectIfLogged } from 'context';
import Head from 'components/layout/head';

const Register: NextPage = () => {
  useRedirectIfLogged();

  return (
    <>
      <Head title="Account creation" />
      <RegisterForm />
    </>
  );
};

export default Register;
