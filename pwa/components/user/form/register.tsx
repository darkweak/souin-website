import React from 'react';
import { Form } from 'components/common/form/forms';
import { buttonType } from 'components/common/button';
import { User } from 'actions/user';
import { CreatableAPIResource, UserAPI } from 'model';
import { useRouter } from 'next/navigation';
import { usePushToast } from 'context';
import { ROUTES } from 'routes';

const inputs = [
  {
    placeholder: 'johndoe@example.com',
    name: 'email',
    label: 'mail',
    type: 'email',
  },
  {
    placeholder: 'john',
    name: 'firstname',
    label: 'firstname',
    type: 'text',
  },
  {
    placeholder: 'doe',
    name: 'lastname',
    label: 'lastname',
    type: 'text',
  },
  {
    placeholder: 'vinvin corp',
    name: 'company',
    label: 'company',
    type: 'text',
    optional: true,
  },
  {
    placeholder: 'mysecretpassword',
    name: 'password',
    label: 'password',
    type: 'password',
  },
  {
    placeholder: 'mysecretpassword',
    label: 'confirm password',
    type: 'password',
  },
];

const button: buttonType = {
  text: 'register',
  variant: 'success',
};

const redirection = {
  text: 'Already have an account?',
  highlightText: 'Signin here',
  redirectionLink: ROUTES.SIGN_IN,
};

const Register = () => {
  const { push } = useRouter();
  const pushToast = usePushToast();
  const handleSubmit = (values: CreatableAPIResource) => {
    return new User()
      .create(values as UserAPI)
      .then(() => {
        push(redirection.redirectionLink);
        pushToast({ text: 'Account created successfully !', variant: 'success' });
      })
      .catch((err) => {
        pushToast({ text: 'Account creation failed !', variant: 'danger' });
        throw err;
      });
  };

  return (
    <Form
      title="Register"
      inputs={inputs}
      buttonProps={button}
      redirectionInformation={redirection}
      handleSubmit={handleSubmit}
    />
  );
};

export default Register;
