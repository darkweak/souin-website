import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { Activation as ActivationAction } from 'actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from 'routes';
import { usePushToast } from 'context';
import { InformationalAlert } from 'components/common/popup';
import Head from 'components/layout/head';

const Activation: NextPage = () => {
  const { push } = useRouter();
  const params = useSearchParams();
  const pushToast = usePushToast();

  useEffect(() => {
    new ActivationAction().activate({ email: params.get('email') ?? '', token: params.get('token') ?? '' }).then(() => {
      push(ROUTES.SIGN_IN);
      pushToast({ text: 'Account validated !', variant: 'success' });
    });
  }, [params, push, pushToast]);

  return (
    <>
      <Head title="Email validation" />
      <InformationalAlert text={'Please wait during we are validating your account.'} />
    </>
  );
};

export default Activation;
