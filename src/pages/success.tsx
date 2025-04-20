//src/pages/success.tsx
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Success} from 'src/sections/components/detail-lists/success';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Typography } from '@mui/material';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
 import {tokens} from "../locales/tokens";
import {useTranslation} from "react-i18next";



const Page: NextPage = () => {



  const { t } = useTranslation();





  usePageView();

  return (
    <>
      <Seo title="Success - Subscription" />
      <Box component="main" sx={{ flexGrow: 1, py: 8, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5"
                      sx={{ flexGrow: 1, py: 2, mt: 3, mb:3 }}>
          {t(tokens.headings.success)}</Typography>


        <Success/>
        </Container>
        </Box>

    </>
  );
};


Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;


export default Page;
