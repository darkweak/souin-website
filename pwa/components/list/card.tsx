import { Card, cardProps } from 'components/common/card';
import React from 'react';
import { Icon } from 'components/common/icon';

const listCardProps: ReadonlyArray<React.PropsWithChildren<cardProps>> = [
  {
    children: <Icon name="box" className="text-info/80" />,
    title: 'Easy deploy',
    text: 'Souin is a Cloud Native application shipped as a ready-to-use single Docker image. It is compatible with Kubernetes or baremetal.',
  },
  {
    children: <Icon name="server" className="text-info/80" />,
    title: 'Self-hosted',
    text: "Souin has been designed with simplicity in mind: only one service only one binary as it's written in go.",
  },
  {
    children: <Icon name="code" className="text-info/80" />,
    title: 'Open source',
    text: 'Everyone can access to the source-code on Github. To make it transparent and to serve a greater good.',
  },
  {
    children: <Icon name="box" className="text-info/80" />,
    title: 'Compatible',
    text: 'Shipped with a production-grade web server built on top of Caddy: automatic HTTPS, HTTP/3, logging, zstd compression...',
  },
  {
    children: <Icon name="zap" className="text-info/80" />,
    title: 'Blazing fast',
    text: 'Store and serve your responses without delay. Minimal TTFB combined to go performances.',
  },
  {
    children: <Icon name="extensible" className="text-info/80" />,
    title: 'Extensible',
    text: 'Souin is available as module or plugin for most of the golang webservers, proxies, API. (e.g. Træfik, Tyk, Echo,...)',
  },
];
export const CardList: React.FC = () => {
  return (
    <div className="container m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-4 md:gap-8 lg:gap-16">
      {listCardProps.map((card, id) => (
        <Card key={id} {...card} />
      ))}
    </div>
  );
};
