import type { NextPage } from 'next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as MarketingLayout } from 'src/layouts/marketing';

import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next'
import { tokens } from  'src/locales/tokens';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { typography } from "src/theme/typography";
import Typography from '@mui/material/Typography';

const TermsAndConditions: NextPage = () => {
  usePageView();

  const { t } = useTranslation();
  return (
    <>

      <Seo title="Terms and Conditions" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">

          <Stack spacing={3}>
            <Typography
              color="text.primary"
              sx={{ ...typography.h4, mt:5, pt:6, mb: 4 }}
            >
              {t(tokens.headings.tocs)}
            </Typography>
            <Typography variant="body1">


            </Typography>
            <Typography
              color="text.primary"
              sx={{ ...typography.h4, mt:4, pt:4, mb: 4 }}
            >
              {t(tokens.headings.general)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.brainiacIntro)}
            </Typography>
            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.agreementToTerms)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.acceptConditions)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.platformAndServices)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.servicesProvided)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.fairUsePolicy)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.customerResponsibilities)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.contentAndData)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.useRestrictions)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.modificationsAndUpgrades)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.modificationsBody)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.termination)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.termAndRenewal)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.terminationForBreach)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.immediateTermination)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.effectOfTermination)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.intellectualProperty)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.brainiacMediaMaterials)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.customerContentAndData)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.outputContent)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.confidentiality)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.confidentialityBody)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.privacyAndDataProtection)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.privacyAndDataProtectionBody)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.limitationOfLiability)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.consequentialDamages)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.liabilityCap)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.governingLaw)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.governingLawBody)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.changesToTerms)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.changesToTermsBody)}
            </Typography>

            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.headings.miscellaneous)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.miscellaneousBody)}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.acceptConditions)}
            </Typography>
            <Typography variant="h5" sx={{ mt: 6 }}>
              {t(tokens.form.apiCalls)}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ ...typography.body1, pt:2, mb: 4 }}
            >
              {t(tokens.form.apiPurpose)}
            </Typography>

          </Stack>
        </Container>
      </Box>
    </>
  );
};

TermsAndConditions.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default TermsAndConditions;
