import type { FC } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const Seo: FC<SeoProps> = (props) => {
  const { title, description, keywords } = props;

  const fullTitle = title ? `${title} | Brainiac Media` : 'Brainiac Media';

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
    </Head>
  );
};

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
};
