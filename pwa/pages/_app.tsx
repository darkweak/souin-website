import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProviders, ToastProvider } from 'context';
import { Layout } from 'components/layout';
import { NextPage, NextPageContext } from 'next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <AuthProviders authenticated={pageProps.authenticated} requestToken={pageProps.token}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProviders>
    </ToastProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }: { Component: NextPage; ctx: NextPageContext }) => {
  let authenticated = false;
  let token;

  const { req } = ctx;
  if (req) {
    const cookies = req.headers.cookie?.split(';').reduce((acc: Record<string, string>, current) => {
      const [name, value] = current.split('=');
      acc[name.trim()] = value.trim();
      return acc;
    }, {});

    token = cookies?.token;
    authenticated = !!cookies?.token;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ctx.req as any).cookies = cookies;
  }

  if (Component.getInitialProps) {
    const props = await Component.getInitialProps(ctx);
    return {
      pageProps: {
        ...props,
        authenticated,
        token,
      },
    };
  }

  return {
    pageProps: {
      authenticated,
      token,
    },
  };
};

export default MyApp;
