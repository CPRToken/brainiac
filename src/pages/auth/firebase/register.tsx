// src/pages/auth/firebase/register.tsx
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
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { loadStripe } from '@stripe/stripe-js';
import { paths } from 'src/paths';
import { GuestGuard } from 'src/guards/guest-guard';
import { IssuerGuard } from 'src/guards/issuer-guard';
import { Issuer } from 'src/utils/auth';
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from 'src/libs/firebase';
import { db } from 'src/libs/firebase';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().min(7).max(255).required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Password confirmation is required'),
  policy: Yup.boolean().oneOf([true], 'This field must be checked'),
});

const Page: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [planName, setPlanName] = useState('');
  const [priceId, setPriceId] = useState('');
  const [uid, setUid] = useState('');
  const router = useRouter();

  useEffect(() => {
    const ref = router.query.ref;
    if (ref) {
      localStorage.setItem('referrer', ref as string);
    }
  }, [router.query.ref]);

  useEffect(() => {
    console.log('Query params:', router.query);
    if (router.query.plan && router.query.priceId && router.query.uid) {
      setPlanName(router.query.plan as string);
      setPriceId(router.query.priceId as string);
      setUid(router.query.uid as string);
    }
  }, [router.query]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      policy: false,
    },
    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        // Create the Firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Create the Firestore user record without email verification
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
          email: user.email,
          plan: 'Trial',
          role: 'User',
          stripeCustomerId: '',
          creationDate: serverTimestamp(),
          loginEvents: []
        });

        // Call the Checkout Session API to create the Stripe checkout session.
        const referrer = localStorage.getItem('referrer');
        const response = await fetch('/api/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: values.email,
            planName,
            priceId,
            referrer, //
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        const { sessionId } = await response.json();
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        await stripe?.redirectToCheckout({ sessionId });
      } catch (err: any) {
        console.error(err);
        setErrors({ email: err.message });
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Seo title="Register" />
      <Card elevation={16}>
        <CardHeader
          subheader={
            <Typography color="text.secondary" variant="body2">
              Already have an account? &nbsp;
              <Link component={RouterLink} href={paths.auth.firebase.login} underline="hover" variant="subtitle2">
                Log in
              </Link>
            </Typography>
          }
          title="Register"
        />
        <CardContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField label="First Name" name="firstName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.firstName} error={Boolean(formik.touched.firstName && formik.errors.firstName)} helperText={formik.touched.firstName && formik.errors.firstName} fullWidth />
              <TextField label="Last Name" name="lastName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.lastName} error={Boolean(formik.touched.lastName && formik.errors.lastName)} helperText={formik.touched.lastName && formik.errors.lastName} fullWidth />
              <TextField label="Email" name="email" type="email" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} error={Boolean(formik.touched.email && formik.errors.email)} helperText={formik.touched.email && formik.errors.email} fullWidth />
              <TextField label="Password" name="password" type={showPassword ? 'text' : 'password'} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} error={Boolean(formik.touched.password && formik.errors.password)} helperText={formik.touched.password && formik.errors.password} fullWidth InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={handleClickShowPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              <TextField label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.confirmPassword} error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} fullWidth />
              <Box sx={{ display: 'flex', alignItems: 'center', ml: -1, mt: 1 }}>
                <Checkbox checked={formik.values.policy} name="policy" onChange={formik.handleChange} />
                <Typography color="text.secondary" variant="body2">
                  I have read the <Link href="/terms-conditions">Terms & Conditions</Link>
                </Typography>
              </Box>
              {formik.touched.policy && formik.errors.policy && (
                <FormHelperText error>{formik.errors.policy}</FormHelperText>
              )}
              <Button fullWidth type="submit" variant="contained" disabled={formik.isSubmitting}>
                Start Free Trial
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
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
