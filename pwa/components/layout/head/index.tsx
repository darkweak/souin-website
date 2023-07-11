import NextHead from 'next/head';
import React from 'react';

type HeadProps = {
  title: string;
};

const prefixPage = 'Souin - ';

const Head: React.FC<HeadProps> = ({ title }) => {
  return (
    <NextHead>
      <title>{prefixPage + title}</title>
      <meta property="og:title" content={prefixPage + title} key="title" />
    </NextHead>
  );
};

export default Head;
