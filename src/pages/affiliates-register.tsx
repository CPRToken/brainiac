// src/pages/auth/firebase/affiliates-register.tsx
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { paths } from 'src/paths';
import { useTranslation } from 'react-i18next';
import { GuestGuard } from 'src/guards/guest-guard';
import { IssuerGuard } from 'src/guards/issuer-guard';
import { Issuer } from 'src/utils/auth';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from 'src/libs/firebase';
import { tokens } from '../locales/tokens';
import { typography } from '../theme/typography';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  paypalEmail: Yup.string().email('Must be a valid PayPal email').nullable(),

  password: Yup.string().min(7).max(255).required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Password confirmation is required'),
  policy: Yup.boolean().oneOf([true], 'You must accept the Terms & Conditions'),
});

const Page: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      paypalEmail: '',
      promotionMethod: '',

      password: '',
      confirmPassword: '',
      policy: false,
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Save affiliate record in Firestore
        const refName = values.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const refUrl = `${refName}${user.uid.slice(0, 3).toLowerCase()}`;





        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
          email: user.email,
          promotionMethod: values.promotionMethod,
          paypalEmail: values.paypalEmail,
          createdAt: serverTimestamp(),
          role: 'Affiliate',
          refUrl: refUrl,


        });

        // Redirect affiliate to dashboard
        router.push(paths.dashboard.index);
      } catch (err: any) {
        console.error(err);
        setErrors({ email: err.message });
      }
    },
  });

  return (
    <>
      <Seo title="Affiliate Register" />
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 2 }}>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Already have an account?&nbsp;
                <Link component={RouterLink} href={paths.auth.firebase.login} underline="hover" variant="subtitle2">
                  {t(tokens.form.login)}
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Affiliate Sign Up"
          />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="First Name"
                  name="firstName"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  fullWidth
                />




                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  fullWidth
                />
                <TextField
                  label="Where will you promote Brainiac Media? Example: YouTube, TikTok, blog, email list, or social media"
                  name="promotionMethod"
                  multiline
                  minRows={2}
                  onChange={formik.handleChange}
                  value={formik.values.promotionMethod}
                  fullWidth


                />
                <TextField
                  label="PayPal Email (optional — only if you want payouts via PayPal)"
                  name="paypalEmail"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.paypalEmail}
                  error={Boolean(formik.touched.paypalEmail && formik.errors.paypalEmail)}
                  helperText={formik.touched.paypalEmail && formik.errors.paypalEmail}
                  fullWidth
                />
                <Box sx={{ display: 'flex', alignItems: 'center', ml: -1, mt: 1 }}>
                  <Checkbox checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
                  <Typography color="text.secondary" variant="body2">
                    I agree to the{' '}
                    <Link
                      href="/affiliate-terms"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Affiliate Terms & Conditions
                    </Link>
                  </Typography>

                </Box>
                {formik.touched.policy && formik.errors.policy && (
                  <FormHelperText error>{formik.errors.policy}</FormHelperText>
                )}
                <Typography sx={{ ...typography.h6, color: 'text.primary', mt: 9 }}>
                  <Button fullWidth type="submit" variant="contained" disabled={formik.isSubmitting}>
                    Register as Affiliate
                  </Button>
                </Typography>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.Firebase}>
    <GuestGuard>
      <AuthLayout>{page}</AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
