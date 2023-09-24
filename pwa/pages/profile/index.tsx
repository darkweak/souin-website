import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Title } from 'components/common/text';
import { useMe, usePushToast, useRedirectIfNotLogged } from 'context';
import { Form } from 'components/common/form/forms';
import { SimpleCard } from 'components/common/card';
import { PasswordUpdater, User } from 'actions';
import { User as UserModel, UserPasswordUpdate } from 'model';
import Head from 'components/layout/head';

const Profile: NextPage = () => {
  useRedirectIfNotLogged();
  const { username, user_id } = useMe();
  const [me, setMe] = useState<UserModel | undefined>();
  const pushToast = usePushToast();

  useEffect(() => {
    new User()
      .getOne({ id: user_id } as UserModel)
      .then(user => user && setMe(user));
  }, [user_id]);

  return (
    <>
      <Head title="Your profile" />
      <div className="container m-auto">
        <Title title="Profile" />
        <div className="prose md:prose-xl py-8 max-w-full">
          <h2 className="text-neutral-content">
            Welcome on your profile {username}
          </h2>
        </div>
        <div className="gap-8 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-fit">
            <SimpleCard className="py-8">
              <Form
                buttonProps={{
                  text: 'Change password',
                  className: 'btn-outline',
                  variant: 'warning',
                }}
                subtitle="Update password"
                inputs={[
                  {
                    placeholder: 'mucurrentpassword',
                    name: 'current_password',
                    label: 'current password',
                    type: 'password',
                  },
                  {
                    placeholder: 'mynewpassword',
                    name: 'new_password',
                    label: 'new password',
                    type: 'password',
                  },
                ]}
                handleSubmit={values => {
                  return new PasswordUpdater()
                    .patch(values as UserPasswordUpdate)
                    .then(() => {
                      pushToast({
                        text: 'Your password has been updated!',
                        variant: 'success',
                      });
                    })
                    .catch(err => {
                      pushToast({
                        text: 'We cannot update your password!',
                        variant: 'danger',
                      });
                      throw err;
                    });
                }}
              />
            </SimpleCard>
          </div>
          <div className="w-full lg:w-1/2 h-fit">
            <SimpleCard className="py-8">
              <Form
                buttonProps={{
                  text: 'Update your profile',
                  className: 'btn-outline',
                  variant: 'warning',
                }}
                subtitle="Profile informations"
                inputs={[
                  {
                    defaultValue: me?.firstname,
                    placeholder: 'john',
                    name: 'firstname',
                    label: 'firstname',
                    type: 'text',
                  },
                  {
                    defaultValue: me?.lastname,
                    placeholder: 'doe',
                    name: 'lastname',
                    label: 'lastname',
                    type: 'text',
                  },
                  {
                    defaultValue: me?.company,
                    placeholder: 'vinvin corp',
                    name: 'company',
                    label: 'company',
                    type: 'text',
                    optional: true,
                  },
                ]}
                handleSubmit={values => {
                  return new User()
                    .update(user_id, values as UserModel)
                    .then(() => {
                      pushToast({
                        text: 'Your informations have been updated!',
                        variant: 'success',
                      });
                    })
                    .catch(err => {
                      pushToast({
                        text: 'We cannot update your informations!',
                        variant: 'danger',
                      });
                      throw err;
                    });
                }}
              />
            </SimpleCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
