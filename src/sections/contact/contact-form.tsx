//src/sections/contact/contact-form.tsx
import type { FC, FormEvent } from 'react';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import {tokens} from "src/locales/tokens";
import { useTranslation } from 'react-i18next';

export const ContactForm: FC = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const body = {
      name: formData.get('name'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message')
    };

    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert('Message sent!');
      (event.target as HTMLFormElement).reset();
    } else {
      alert('Something went wrong.');
    }
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb:3}}>

        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {open ? 'Hide Support Form' : 'Contact Support'}
        </Button>
      </Box>

      <Collapse in={open}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ color: 'text.primary', mb: 1 }}>{t(tokens.form.name)}</FormLabel>
                <OutlinedInput name="name" required />

              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel sx={{ color: 'text.primary', mb: 1 }}>{t(tokens.form.email)}</FormLabel>
                <OutlinedInput name="company" required />
              </FormControl>
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ color: 'text.primary', mb: 1 }}>{t(tokens.form.message)}</FormLabel>
                <OutlinedInput fullWidth name="message" required multiline rows={6} />
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button fullWidth size="large" variant="contained" type="submit">
              {t(tokens.form.submit)}
            </Button>
          </Box>
          <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
            By submitting this, you agree to the{' '}
            <Link color="text.primary" href="#" underline="always" variant="subtitle2">
              Privacy Policy
            </Link>{' '}and{' '}
            <Link color="text.primary" href="#" underline="always" variant="subtitle2">
              Cookie Policy
            </Link>
            .
          </Typography>
        </form>
      </Collapse>
    </>
  );
};
