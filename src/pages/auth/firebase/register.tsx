//src/pages/auth/firebase/register.tsx
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
import { serverTimestamp } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";
import { GuestGuard } from 'src/guards/guest-guard';
import { IssuerGuard } from 'src/guards/issuer-guard';
import { useRouter } from 'src/hooks/use-router';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { paths } from 'src/paths';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Issuer } from 'src/utils/auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from 'src/libs/firebase';
import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
  } else {
  }
});




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
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      quote: '',
      firstName: '',
      lastName: '',
        email: '',
      password: '',
      confirmPassword: '',
      policy: false,

    },

    validationSchema,
    onSubmit: async (values, { setErrors }) => {
      console.log('Form onSubmit started');
      try {
        console.log('Firebase createUserWithEmailAndPassword starting');
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password
        );

        console.log('Firebase createUserWithEmailAndPassword finished', user);
        // Construct the user URL




        console.log("User created successfully", user);


        const actionCodeSettings = {
          url: 'https://brainiacmedia.ai/auth/firebase/verify-email', // Replace with your app's verify email page
          handleCodeInApp: true,
        };

        await sendEmailVerification(user, actionCodeSettings);
        // After successfully creating the user
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
          email: user.email,
          plan: 'Trial',
          role: 'User',
          stripeCustomerId: '',
          creationDate: serverTimestamp(), // Add the creation date here
          loginEvents: []  // Initialize the loginEvents array
        });





        // Redirect to the user's profile page
        router.push('/auth/firebase/verify-email?message=check-your-email');


// ... (rest of your catch block and other code)



      } catch (error) {
        // Asserting that error is an instance of Error
        const message = (error as Error).message;
        console.error("Error during user creation or data saving:", message);
        setErrors({ email: message });
      }

    }
  });





  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Seo title="Register" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.auth.firebase.login}
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Register"
          />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                  fullWidth
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  label="First Name"
                  name="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
                <TextField
                  error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                  fullWidth
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  label="Last Name"
                  name="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  fullWidth
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  label="Confirm Password"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: -1,
                    mt: 1,
                  }}
                >
                  <Checkbox
                    checked={formik.values.policy}
                    name="policy"
                    onChange={formik.handleChange}
                  />
                  <Typography color="text.secondary" variant="body2">
                    I have read the{' '}
                    <Link component="a" href="/terms-conditions">
                      Terms & Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(formik.touched.policy && formik.errors.policy) && (
                  <FormHelperText error>{formik.errors.policy}</FormHelperText>
                )}
                <Button
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  type="submit"
                  variant="contained"
                >
                  Register
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </div>
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
