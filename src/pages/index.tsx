//src/pages/index.tsx
import type { NextPage } from 'next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { HomeCta } from 'src/sections/home/home-cta';
import { HomeHero } from 'src/sections/home/home-hero';
import PricingSection from  'src/pages/pricing'
import { useRouter } from 'next/router';
import { useEffect } from 'react';


const Page: NextPage = () => {
    usePageView();

  const router = useRouter();

  useEffect(() => {
    const ref = router.query.ref;
    if (ref) {
      localStorage.setItem('referrer', ref as string);
    }
  }, [router.query.ref]);

  return (
    <>


      <Seo />
      <main>

        <HomeHero />
        <HomeCta />
<PricingSection/>

      </main>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
