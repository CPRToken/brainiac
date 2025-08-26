//src/sections/pricing/pricing-faqs.tsx
import React, { FC, useState } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import { tokens } from "src/locales/tokens";
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

interface FaqType {
  question: string;
  answer: string | string[]; // allow both
}

const Faq: FC<FaqType> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);



  return (
    <Stack
      onClick={() => setIsExpanded((prevState) => !prevState)}
      spacing={2}
      sx={{ cursor: 'pointer' }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 2, mb: 1 }}>
          {question}
        </Typography>
        <SvgIcon>{isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</SvgIcon>
      </Stack>
      <Collapse in={isExpanded}>
        {Array.isArray(answer) ? (
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            {answer.map((item, i) => (
              <Box component="li" key={i} sx={{ mb: 1 }}>
                <Typography color="text.secondary" variant="body2">
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" variant="body2">
            {answer}
          </Typography>
        )}
      </Collapse>

    </Stack>
  );
};

Faq.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export const PricingFaqs: FC = (props) => {
  const { t } = useTranslation();

  const faqs: FaqType[] = [

    {
      question: t(tokens.form.question6),
      answer: [
        t(tokens.form.answer6),
        t(tokens.form.answer7),
        t(tokens.form.answer8),
        t(tokens.form.answer9),
        t(tokens.form.answer10),
        t(tokens.form.answer11),
        t(tokens.form.answer12),
        t(tokens.form.answer13),
        t(tokens.form.answer14),
        t(tokens.form.answer15),
        t(tokens.form.answer16),
        t(tokens.form.answer17),
      ],
    },
    {
      question: t(tokens.form.question1),
      answer: t(tokens.form.answer1),
    },
    {
      question: t(tokens.form.question2),
      answer: t(tokens.form.answer2),
    },
    {
      question: t(tokens.form.question3),
      answer: t(tokens.form.answer3),
    },
    {
      question: t(tokens.form.question4),
      answer: t(tokens.form.answer4),
    },
    {
      question: t(tokens.form.question5),
      answer: t(tokens.form.answer5),
    },
  ];

  return (
    <Box
      sx={{ py: '120px' }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
        >
          <Grid
            xs={12}
            md={6}
          >
            <Stack spacing={2}>
              <Typography sx={{ ...typography.h4, color: 'text.primary', mt: 2, mb: 0 }}>
                {t(tokens.headings.FAQ)}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            xs={12}
            md={6}
          >
            <Stack spacing={4}>
              {faqs.map((faq, index) => (
                <Faq
                  key={index}
                  {...faq}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
