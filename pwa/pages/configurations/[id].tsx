import { Configuration } from 'actions';
import { JsonEditor } from 'components/common/editor';
import { UserFriendlyEditor } from 'components/common/editor/friendly';
import { Tabbar } from 'components/common/tab';
import Head from 'components/layout/head';
import { JsonProvider, useRedirectIfNotLogged } from 'context';
import { Configuration as ConfigurationModel } from 'model';
import { NextPage, NextPageContext } from 'next';
import React, { useMemo } from 'react';

type ConfigurationProps = {
  configuration?: ConfigurationModel;
};

const Configurations: NextPage<ConfigurationProps> = ({ configuration }) => {
  useRedirectIfNotLogged();
  const memoizedConfigurationId = useMemo(() => {
    return configuration?.id || '';
  }, [configuration?.id]);

  return (
    <>
      <Head title="Configuration edition" />
      <div className="container m-auto">
        <JsonProvider
          configurationId={memoizedConfigurationId}
          json={configuration?.configuration ? JSON.parse(configuration?.configuration) : undefined}
        >
          <Tabbar
            tabs={[
              { name: 'User friendly', TabItem: <UserFriendlyEditor /> },
              { name: 'JSON', TabItem: <JsonEditor /> },
            ]}
          />
        </JsonProvider>
      </div>
    </>
  );
};

Configurations.getInitialProps = (ctx: NextPageContext & { req: { cookies: Record<string, string> } }) => {
  return new Configuration()
    .getOne({
      id: ctx.query.id,
      ...(ctx?.req?.cookies ? { config: { headers: { Authorization: `Bearer ${ctx.req.cookies.token}` } } } : {}),
    } as ConfigurationModel)
    .then((configuration) => ({ configuration } as ConfigurationProps))
    .catch(({ response: { status } }) => {
      if ([401, 403, 404].includes(status)) {
        ctx.res?.writeHead(301, { location: '/domains' });
        ctx.res?.end();
      }

      return { configuration: undefined };
    });
};

export default Configurations;
