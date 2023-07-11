import React from 'react';
import { Form } from 'components/common/form/forms';
import { buttonType } from 'components/common/button';
import { Auth } from 'actions/user';
import { useDispatchAuth, usePushToast } from 'context';
import { ROUTES } from 'routes';
import { UserLogin } from 'model';

const inputs = [
  {
    placeholder: 'johndoe@example.com',
    name: 'email',
    label: 'email',
    type: 'email',
  },
  {
    placeholder: 'mysecretpassword',
    name: 'password',
    label: 'password',
    type: 'password',
  },
];

const button: buttonType = {
  text: 'sign in',
  variant: 'success',
};

const redirection = {
  text: 'No account yet?',
  highlightText: 'Create one',
  redirectionLink: ROUTES.REGISTER,
};

const Signin = () => {
  const setConnected = useDispatchAuth();
  const pushToast = usePushToast();
  return (
    <Form
      title="Sign in"
      inputs={inputs}
      buttonProps={button}
      redirectionInformation={redirection}
      handleSubmit={(values) => {
        return new Auth()
          .login(values as UserLogin)
          .then(() => {
            setConnected(true);
            pushToast({ text: 'Logged in successfully', variant: 'success' });
          })
          .catch((err) => {
            pushToast({ text: 'Invalid credentials', variant: 'danger' });
            throw err;
          });
      }}
    />
  );
};

export default Signin;
