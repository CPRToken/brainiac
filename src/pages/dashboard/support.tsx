//src/pages/dashboard/support.tsx
import React from "react";
import type { NextPage } from 'next';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';
import { ContactForm } from 'src/sections/contact/contact-form';
import {PricingFaqs} from "src/sections/pricing/pricing-faqs";
import { Layout as DashboardLayout } from 'src/layouts/dashboard';


const Page: NextPage = () => {
  const { t } = useTranslation();

  usePageView();

  return (
    <>
      <Seo title="Contact Us" />


      <Box
        component="main"
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr', // always one column
          flexGrow: 1,
        }}
      >





          <Container
            maxWidth="md"
            sx={{ pl: { lg: 9 } }}
          >

            <Stack spacing={3}>

            </Stack>



            <Stack
              alignItems="center"
              direction="row"
              flexWrap="wrap"
              gap={4}
              sx={{
                color: 'text.primary',
                '& > *': {
                  flex: '0 0 auto',
                },
              }}
            >

            </Stack>

          </Container>


        <Box
          sx={{
            backgroundColor: 'background.paper',
            px: 6,
            py: 7,
          }}
        >


          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.index}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
              }}
              underline="hover"
            >
              <SvgIcon sx={{ mr: 1 }}>
                <ArrowLeftIcon />
              </SvgIcon>
              <Typography variant="subtitle2">Back to Dash</Typography>
            </Link>
          </div>


          <Typography
            sx={{ mt:4, pb: 4, textAlign: 'center' }}
            variant="h6"
          >
            {t(tokens.form.mostQs)}
          </Typography>

          <PricingFaqs />

          <Container
            maxWidth="md"
            sx={{

              mt: 6,
              pr: {
                lg: 15,


              },
            }}
          >

            <Typography variant="h5">  {t(tokens.form.contactUs)}</Typography>

            <Typography
              sx={{ mt:4, pb: 4, textAlign: 'center' }}
              variant="h6"
            >
              {t(tokens.form.ifYouCant)}
            </Typography>
            <ContactForm />



          </Container>
        </Box>
      </Box>
    </>
  );
};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
