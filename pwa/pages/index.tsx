import { NextPage } from 'next';
import React from 'react';
import { Title } from 'components/common/text';
import { Blur } from 'components/common/block';
import { BaseButton, OutlinedButton } from 'components/common/button';
import { useRouter } from 'next/navigation';
import { ROUTES } from 'routes';
import { CardList } from 'components/list/card';
import map from 'public/images/map.png';
import Link from 'next/link';
import Head from 'components/layout/head';

const Home: NextPage = () => {
  const { push } = useRouter();
  return (
    <>
      <Head title="Home" />
      <div
        className="absolute h-screen w-screen bg-center bg-cover top-0"
        style={{ backgroundImage: `url(${map.src})` }}
      />
      <div className="hero min-h-75">
        <div className="hero-content">
          <Blur className="flex flex-col items-center md:max-w-screen-md max-w-screen-sm gap-y-8 py-4 px-8 m-auto lg:py-8 lg:px-16 rounded-xl border border-base-200">
            <Title
              className="text-shadow-blue bg-gradient-to-r from-accent-focus to-info bg-clip-text text-transparent"
              title="The free Saas HTTP cache you've been waiting for"
            />
            <p className="text-left font-bold">
              Souin is an intuitive HTTP cache management application that
              enables servers to cache web data, improving website speed and
              reducing bandwidth usage. With it, you can easily configure and
              manage cache policies, ensuring fast and reliable content delivery
              to your users. Plus, as an open source application, Souin provides
              flexibility and transparency, allowing for customizations and
              contributions from the community.
            </p>
            <BaseButton
              variant="ghost"
              className="xl:btn-lg bg-gradient-to-r from-accent-focus to-info border-none"
              text="Try it now"
              icon="arrow-right"
              position="right"
              onClick={() => push(ROUTES.REGISTER)}
            />
          </Blur>
        </div>
      </div>
      <div className="m-auto max-w-screen-sm lg:max-w-screen-lg">
        <div className="py-16 grid gap-y-8 px-4">
          <Title title="Why use Souin?" />
          <CardList />
        </div>
        <div className="py-16 grid gap-y-8 px-4">
          <Title title="Open-source" />
          <p>
            Souin is built by and for the community. It&apos;s code is totally
            open-source available on the github repository{' '}
            <Link target="_blank" href="https://github.com/darkweak/souin">
              github.com/darkweak/souin
            </Link>
            . Everyone can access, audit and explore the code. Feel free to open
            a PR or issues if you think some parts are not working as expected,
            if you encounter some troubles to configure it or if the doc is not
            clear enough. There are no hidden part, or enterprise edition
            because it doesn&apos;t make sense to make money on the back of the
            contributors and all features in Souin will stay free forever.
          </p>
          <Link
            target="_blank"
            href="https://github.com/darkweak/souin"
            className="m-auto"
          >
            <OutlinedButton
              variant="ghost"
              icon="github"
              text="Join the project"
              className="btn-lg"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
