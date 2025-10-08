// src/pages/affiliate-terms.tsx
import type { NextPage } from 'next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { typography } from 'src/theme/typography';

const AffiliateTerms: NextPage = () => {
  usePageView();

  return (
    <>
      <Seo title="Affiliate Terms & Conditions" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>

            <Box sx={{ mt: 6 }}>
            <Typography sx={{ ...typography.h4, mt: 8, mb: 4 }}>
              Affiliate Terms & Conditions
            </Typography>
           </Box>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              These Affiliate Terms & Conditions (“Terms”) govern participation in the Brainiac Media Affiliate Program (“Program”).
              By signing up, you agree to these Terms.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>1. Overview</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              The Program allows you to earn commission by referring new paying customers to Brainiac Media using your unique affiliate link.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>2. Commission & Payment</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              You earn 30% commission on every paid subscription made through your referral link.
              Commissions are calculated on the net amount (excluding taxes and refunds) and are paid via PayPal once your balance reaches $20 USD.
              Payments are processed monthly. You are responsible for any PayPal fees or taxes in your country.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>3. Affiliate Responsibilities</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              Affiliates must promote Brainiac Media ethically and lawfully. You may not:
              <ul>
                <li>Use spam, bots, or fake accounts.</li>
                <li>Make false or misleading claims about our services.</li>
                <li>Bid on “Brainiac Media” keywords in ads or pretend to represent the company.</li>
              </ul>
              Failure to comply may result in suspension or termination from the program.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>4. Branding & Content Use</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              You may use Brainiac Media’s name, logo, and promotional materials only as provided by us.
              You must not alter or use these assets in misleading ways.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>5. Termination</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              Brainiac Media reserves the right to terminate or suspend your account at any time, especially for violations of these Terms.
              Upon termination, you forfeit any unpaid commissions obtained through fraudulent or non-compliant activity.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>6. Independent Contractor</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              You are an independent affiliate, not an employee, partner, or representative of Brainiac Media.
              You have no authority to make commitments or representations on behalf of the company.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>7. Limitation of Liability</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              Brainiac Media shall not be liable for any indirect, incidental, or consequential damages arising from this Program.
              Our total liability under these Terms shall not exceed the total commissions paid to you.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>8. Governing Law</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              These Terms are governed by the laws of New South Wales, Australia.
              Any disputes will be handled in Australian courts.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>9. Changes to the Program</Typography>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              Brainiac Media may modify these Terms or the Program at any time, with or without notice.
              Continued participation means you accept any updates.
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>10. Contact</Typography>

            <Box sx={{ mb: 6 }}>
            <Typography color="text.secondary" sx={{ ...typography.body1, mb: 4 }}>
              For any questions, contact us at <b>support@brainiacmedia.ai</b>.
            </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

AffiliateTerms.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default AffiliateTerms;
