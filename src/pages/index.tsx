import type { NextPage } from 'next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { HomeFeatures } from 'src/sections/home/home-features';
import { HomeCta } from 'src/sections/home/home-cta';
import { HomeHero } from 'src/sections/home/home-hero';

import {HomePriceplan } from 'src/sections/home/home-priceplan';


const Page: NextPage = () => {
    usePageView();

  return (
    <>


      <Seo />
      <main>

        <HomeHero />
        <HomeCta />
        <HomePriceplan />

      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
