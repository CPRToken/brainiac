import type { NextPage } from 'next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';

import { HomeCta } from 'src/sections/home/home-cta';
import { HomeHero } from 'src/sections/home/home-hero';




const Page: NextPage = () => {
    usePageView();

  return (
    <>


      <Seo />
      <main>

        <HomeHero />
        <HomeCta />


      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
